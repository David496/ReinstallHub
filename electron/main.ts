import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { registerIpcHandlers } from './ipc/ipcHandlers';
import { InstallationQueue } from './services/InstallationQueue';
import { WingetService } from './services/WingetService';
import { LoggerService } from './services/LoggerService';

const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1080,
    minHeight: 680,
    frame: false, // Custom Windows 11 titlebar
    backgroundColor: '#0f141c',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    icon: path.join(__dirname, '../../public/icons/icon.png'),
  });

  registerIpcHandlers(win);

  win.once('ready-to-show', () => {
    win.show();
    LoggerService.getInstance().info('ReInstall Hub initialized.');
  });

  // Handle close attempt during active installation
  win.on('close', async (e) => {
    const queue = InstallationQueue.getInstance();
    if (queue.getState().isActive) {
      e.preventDefault();
      const choice = dialog.showMessageBoxSync(win, {
        type: 'warning',
        buttons: ['Continuar Instalación', 'Cancelar y Salir'],
        defaultId: 0,
        cancelId: 0,
        title: 'Instalación en Curso',
        message: 'Una instalación de software se está ejecutando actualmente.',
        detail: 'Cerrar ReInstall Hub ahora cancelará la cola de instalación y terminará los procesos activos de WinGet para evitar tareas huérfanas. ¿Deseas salir?',
      });

      if (choice === 1) {
        // User confirmed exit: cancel active process and exit
        await queue.cancel();
        mainWindow?.destroy();
      }
    }
  });

  loadWindowContent(win);

  return win;
}

async function loadWindowContent(win: BrowserWindow) {
  const localRendererPath = path.join(__dirname, '../renderer/index.html');
  const hasLocalBuild = fs.existsSync(localRendererPath);

  if (!isDev) {
    if (hasLocalBuild) {
      await win.loadFile(localRendererPath);
    } else {
      LoggerService.getInstance().error(`Production renderer bundle not found at: ${localRendererPath}`);
    }
    return;
  }

  // In development: try loading Vite dev server on 127.0.0.1 or localhost with retries
  const devUrl = 'http://127.0.0.1:5173';
  let loaded = false;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await win.loadURL(devUrl);
      loaded = true;
      break;
    } catch {
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 750));
      }
    }
  }

  if (!loaded) {
    // If Vite dev server is not active but built files exist, fallback cleanly
    if (hasLocalBuild) {
      LoggerService.getInstance().info(
        'Vite dev server not running on port 5173. Falling back to local built renderer.'
      );
      await win.loadFile(localRendererPath);
    } else {
      LoggerService.getInstance().error(
        'Neither Vite dev server nor local renderer bundle (dist/renderer/index.html) were found.'
      );
    }
  }
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    mainWindow = createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('will-quit', async () => {
    // Ensure any leftover winget process tree is killed
    await WingetService.getInstance().cancelCurrent();
  });
}

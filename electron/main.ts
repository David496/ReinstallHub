import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
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

  if (isDev) {
    win.loadURL('http://localhost:5173');
    // Open DevTools if desired in dev
    // win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  return win;
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

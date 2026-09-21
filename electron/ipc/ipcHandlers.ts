import { ipcMain, dialog, BrowserWindow, nativeTheme, app, shell } from 'electron';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { WingetDetector } from '../services/WingetDetector';
import { WingetService } from '../services/WingetService';
import { InstallationQueue } from '../services/InstallationQueue';
import { LoggerService } from '../services/LoggerService';
import { SettingsService } from '../services/SettingsService';
import { isProcessElevated } from '../utils/platformUtils';
import { Software } from '../../src/types/software';
import { InstallationOptions } from '../../src/types/installation';
import { AppSettings } from '../../src/types/settings';

export function registerIpcHandlers(mainWindow: BrowserWindow) {
  const logger = LoggerService.getInstance();
  const queue = InstallationQueue.getInstance();
  const wingetService = WingetService.getInstance();
  const settingsService = SettingsService.getInstance();

  logger.setWindow(mainWindow);
  queue.setWindow(mainWindow);

  // Sync native theme with stored settings
  const currentSettings = settingsService.getSettings();
  if (currentSettings.appearance?.theme) {
    nativeTheme.themeSource = currentSettings.appearance.theme;
  }

  // --- Winget Channels ---
  ipcMain.handle('winget:check', async () => {
    return WingetDetector.detect(true);
  });

  ipcMain.handle('winget:version', async () => {
    const info = await WingetDetector.detect();
    return info.version;
  });

  ipcMain.handle('winget:getInstalled', async () => {
    return wingetService.getInstalledApps();
  });

  // --- Software Catalog Channels ---
  ipcMain.handle('software:getAll', async () => {
    try {
      // In dev and packaged builds, locate data/software.json
      const possiblePaths = [
        path.join(__dirname, '../../data/software.json'),
        path.join(__dirname, '../data/software.json'),
        path.join(process.cwd(), 'data/software.json'),
      ];

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf8');
          return JSON.parse(raw) as Software[];
        }
      }
      logger.error('Could not find data/software.json');
      return [];
    } catch (err: any) {
      logger.error(`Error loading catalog: ${err.message}`);
      return [];
    }
  });

  // --- Installation Channels ---
  ipcMain.handle('installation:start', async (_, { softwareList, options }: { softwareList: Software[]; options?: Partial<InstallationOptions> }) => {
    return queue.startQueue(softwareList, options);
  });

  ipcMain.handle('installation:startSingle', async (_, { software, options }: { software: Software; options?: Partial<InstallationOptions> }) => {
    return queue.installSingle(software, options);
  });

  ipcMain.handle('installation:cancel', async () => {
    await queue.cancel();
    return true;
  });

  ipcMain.handle('installation:getState', () => {
    return queue.getState();
  });

  // --- Settings Channels ---
  ipcMain.handle('settings:get', () => {
    return settingsService.getSettings();
  });

  ipcMain.handle('settings:save', (_, newSettings: Partial<AppSettings>) => {
    if (newSettings.appearance?.theme) {
      nativeTheme.themeSource = newSettings.appearance.theme;
    }
    return settingsService.saveSettings(newSettings);
  });

  ipcMain.handle('settings:getStorageInfo', () => {
    return settingsService.getStorageInfo();
  });

  ipcMain.handle('settings:openProfilesFolder', async () => {
    const info = settingsService.getStorageInfo();
    if (!fs.existsSync(info.profilesPath)) {
      fs.mkdirSync(info.profilesPath, { recursive: true });
    }
    await shell.openPath(info.profilesPath);
    return true;
  });

  // --- Log Channels ---
  ipcMain.handle('log:getAll', () => {
    return logger.getAll();
  });

  ipcMain.handle('log:clear', () => {
    logger.clear();
    return true;
  });

  ipcMain.handle('log:export', async () => {
    const defaultFileName = `reinstall-hub-log-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Activity Log',
      defaultPath: defaultFileName,
      filters: [{ name: 'Text Documents (*.txt)', extensions: ['txt'] }],
    });

    if (!canceled && filePath) {
      const content = logger.formatForExport();
      fs.writeFileSync(filePath, content, 'utf8');
      logger.info(`Activity log exported to: ${filePath}`);
      return { success: true, filePath };
    }
    return { success: false };
  });

  // --- Window Control Channels ---
  ipcMain.handle('app:minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.handle('app:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return mainWindow.isMaximized();
  });

  ipcMain.handle('app:isMaximized', () => {
    return mainWindow.isMaximized();
  });

  ipcMain.handle('app:close', async () => {
    mainWindow.close();
  });

  // --- Elevation & Admin Channels ---
  ipcMain.handle('app:isElevated', async () => {
    return isProcessElevated();
  });

  ipcMain.handle('app:relaunchElevated', () => {
    if (process.platform !== 'win32') {
      return false;
    }

    const exe = process.execPath;
    let powershellCmd: string;

    if (app.isPackaged) {
      powershellCmd = `Start-Process -FilePath '${exe}' -Verb RunAs`;
    } else {
      const scriptArgs = process.argv
        .slice(1)
        .map((arg) => `'${arg.replace(/'/g, "''")}'`)
        .join(', ');
      powershellCmd = `Start-Process -FilePath '${exe}' -ArgumentList ${scriptArgs} -Verb RunAs`;
    }

    exec(`powershell.exe -NoProfile -Command "${powershellCmd}"`, (err) => {
      if (!err) {
        app.exit(0);
      }
    });
    return true;
  });
}

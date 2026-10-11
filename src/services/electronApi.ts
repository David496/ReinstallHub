import { ElectronAPI } from '../../electron/preload';

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

export const electronApi: ElectronAPI = {
  winget: {
    check: () => window.electronAPI?.winget.check() ?? Promise.resolve({
      isAvailable: false,
      version: null,
      architecture: null,
      platform: 'browser',
      error: 'Electron environment not detected',
    }),
    version: () => window.electronAPI?.winget.version() ?? Promise.resolve(null),
    getInstalled: () => window.electronAPI?.winget.getInstalled() ?? Promise.resolve([]),
    getUpgrades: () => window.electronAPI?.winget.getUpgrades() ?? Promise.resolve([]),
    upgradePackage: (wingetId, options) =>
      window.electronAPI?.winget.upgradePackage(wingetId, options) ??
      Promise.resolve({ success: false, exitCode: -1, message: 'Electron not available' }),
    upgradeAll: (options) =>
      window.electronAPI?.winget.upgradeAll(options) ??
      Promise.resolve({ success: false, exitCode: -1, message: 'Electron not available' }),
    uninstallPackage: (wingetId) =>
      window.electronAPI?.winget.uninstallPackage(wingetId) ??
      Promise.resolve({ success: false, exitCode: -1, message: 'Electron not available' }),
    searchOnline: (query) =>
      window.electronAPI?.winget.searchOnline(query) ?? Promise.resolve([]),
    installEngine: () =>
      window.electronAPI?.winget.installEngine() ??
      Promise.resolve({ success: false, message: 'Electron not available' }),
    onInstallProgress: (cb) =>
      window.electronAPI?.winget.onInstallProgress(cb) ?? (() => {}),
  },

  software: {
    getAll: () => window.electronAPI?.software.getAll() ?? Promise.resolve([]),
  },

  installation: {
    start: (softwareList, options) =>
      window.electronAPI?.installation.start(softwareList, options) ??
      Promise.reject(new Error('Electron not available')),
    startSingle: (software, options) =>
      window.electronAPI?.installation.startSingle(software, options) ??
      Promise.reject(new Error('Electron not available')),
    cancel: () => window.electronAPI?.installation.cancel() ?? Promise.resolve(false),
    getState: () =>
      window.electronAPI?.installation.getState() ??
      Promise.resolve({
        isActive: false,
        isPaused: false,
        currentTaskIndex: -1,
        tasks: [],
        options: {
          silent: true,
          acceptPackageAgreements: true,
          acceptSourceAgreements: true,
          stopOnError: false,
        },
      }),
    onState: (cb) => window.electronAPI?.installation.onState(cb) ?? (() => {}),
    onTaskStatus: (cb) => window.electronAPI?.installation.onTaskStatus(cb) ?? (() => {}),
    onStream: (cb) => window.electronAPI?.installation.onStream(cb) ?? (() => {}),
    onComplete: (cb) => window.electronAPI?.installation.onComplete(cb) ?? (() => {}),
  },

  logs: {
    getAll: () => window.electronAPI?.logs.getAll() ?? Promise.resolve([]),
    clear: () => window.electronAPI?.logs.clear() ?? Promise.resolve(true),
    export: () => window.electronAPI?.logs.export() ?? Promise.resolve({ success: false }),
    onEntry: (cb) => window.electronAPI?.logs.onEntry(cb) ?? (() => {}),
    onCleared: (cb) => window.electronAPI?.logs.onCleared(cb) ?? (() => {}),
  },

  settings: {
    get: () =>
      window.electronAPI?.settings.get() ??
      Promise.resolve({
        language: 'es' as const,
        installation: {
          silent: true,
          acceptPackageAgreements: true,
          acceptSourceAgreements: true,
          stopOnError: false,
        },
        appearance: { theme: 'dark' },
        logging: { detailedLogging: true, autoScroll: true, maxEntries: 1000 },
      }),
    save: (settings) =>
      window.electronAPI?.settings.save(settings) ??
      Promise.resolve(settings as any),
    getStorageInfo: () =>
      window.electronAPI?.settings.getStorageInfo() ??
      Promise.resolve({
        isPortable: true,
        storagePath: 'portable',
        profilesPath: 'portable/profiles',
      }),
    openProfilesFolder: () =>
      window.electronAPI?.settings.openProfilesFolder() ?? Promise.resolve(false),
  },

  app: {
    minimize: () => window.electronAPI?.app.minimize() ?? Promise.resolve(),
    maximize: () => window.electronAPI?.app.maximize() ?? Promise.resolve(false),
    isMaximized: () => window.electronAPI?.app.isMaximized() ?? Promise.resolve(false),
    close: () => window.electronAPI?.app.close() ?? Promise.resolve(),
    isElevated: () => window.electronAPI?.app.isElevated() ?? Promise.resolve(false),
    relaunchElevated: () => window.electronAPI?.app.relaunchElevated() ?? Promise.resolve(false),
  },
};

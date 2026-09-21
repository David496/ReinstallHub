import { contextBridge, ipcRenderer } from 'electron';
import { Software } from '../src/types/software';
import { InstallationOptions, InstallationSummaryData, InstallationTask, QueueState } from '../src/types/installation';
import { WingetInfo, InstalledApplication } from '../src/types/winget';
import { LogEntry } from '../src/types/log';
import { AppSettings } from '../src/types/settings';

const electronAPI = {
  winget: {
    check: (): Promise<WingetInfo> => ipcRenderer.invoke('winget:check'),
    version: (): Promise<string | null> => ipcRenderer.invoke('winget:version'),
    getInstalled: (): Promise<InstalledApplication[]> => ipcRenderer.invoke('winget:getInstalled'),
  },

  software: {
    getAll: (): Promise<Software[]> => ipcRenderer.invoke('software:getAll'),
  },

  installation: {
    start: (softwareList: Software[], options?: Partial<InstallationOptions>): Promise<InstallationSummaryData> =>
      ipcRenderer.invoke('installation:start', { softwareList, options }),
    startSingle: (software: Software, options?: Partial<InstallationOptions>): Promise<InstallationSummaryData> =>
      ipcRenderer.invoke('installation:startSingle', { software, options }),
    cancel: (): Promise<boolean> => ipcRenderer.invoke('installation:cancel'),
    getState: (): Promise<QueueState> => ipcRenderer.invoke('installation:getState'),
    onState: (callback: (state: QueueState) => void) => {
      const listener = (_: any, state: QueueState) => callback(state);
      ipcRenderer.on('installation:state', listener);
      return () => {
        ipcRenderer.removeListener('installation:state', listener);
      };
    },
    onTaskStatus: (callback: (task: InstallationTask) => void) => {
      const listener = (_: any, task: InstallationTask) => callback(task);
      ipcRenderer.on('installation:task-status', listener);
      return () => {
        ipcRenderer.removeListener('installation:task-status', listener);
      };
    },
    onStream: (callback: (data: { softwareId: string; stream: 'stdout' | 'stderr'; line: string }) => void) => {
      const listener = (_: any, data: any) => callback(data);
      ipcRenderer.on('installation:stream', listener);
      return () => {
        ipcRenderer.removeListener('installation:stream', listener);
      };
    },
    onComplete: (callback: (summary: InstallationSummaryData) => void) => {
      const listener = (_: any, summary: InstallationSummaryData) => callback(summary);
      ipcRenderer.on('installation:complete', listener);
      return () => {
        ipcRenderer.removeListener('installation:complete', listener);
      };
    },
  },

  logs: {
    getAll: (): Promise<LogEntry[]> => ipcRenderer.invoke('log:getAll'),
    clear: (): Promise<boolean> => ipcRenderer.invoke('log:clear'),
    export: (): Promise<{ success: boolean; filePath?: string }> => ipcRenderer.invoke('log:export'),
    onEntry: (callback: (entry: LogEntry) => void) => {
      const listener = (_: any, entry: LogEntry) => callback(entry);
      ipcRenderer.on('log:entry', listener);
      return () => {
        ipcRenderer.removeListener('log:entry', listener);
      };
    },
    onCleared: (callback: () => void) => {
      const listener = () => callback();
      ipcRenderer.on('log:cleared', listener);
      return () => {
        ipcRenderer.removeListener('log:cleared', listener);
      };
    },
  },

  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
    save: (settings: Partial<AppSettings>): Promise<AppSettings> => ipcRenderer.invoke('settings:save', settings),
    getStorageInfo: (): Promise<{ isPortable: boolean; storagePath: string; profilesPath: string }> =>
      ipcRenderer.invoke('settings:getStorageInfo'),
    openProfilesFolder: (): Promise<boolean> => ipcRenderer.invoke('settings:openProfilesFolder'),
  },

  app: {
    minimize: (): Promise<void> => ipcRenderer.invoke('app:minimize'),
    maximize: (): Promise<boolean> => ipcRenderer.invoke('app:maximize'),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke('app:isMaximized'),
    close: (): Promise<void> => ipcRenderer.invoke('app:close'),
    isElevated: (): Promise<boolean> => ipcRenderer.invoke('app:isElevated'),
    relaunchElevated: (): Promise<boolean> => ipcRenderer.invoke('app:relaunchElevated'),
  },
};

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

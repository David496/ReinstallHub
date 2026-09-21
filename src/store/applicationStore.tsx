import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Software, CategoryType } from '../types/software';
import { InstallationStatus, InstallationSummaryData, InstallationTask, QueueState } from '../types/installation';
import { WingetInfo, InstalledApplication } from '../types/winget';
import { LogEntry } from '../types/log';
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';
import { Profile, ProfileExportData } from '../types/profile';
import { DEFAULT_PROFILES } from '../data/defaultProfiles';
import { electronApi } from '../services/electronApi';
import { softwareProvider } from '../services/LocalSoftwareProvider';
import { Language, translations } from '../i18n/translations';

export type NavTab = 'dashboard' | 'catalog' | 'settings' | 'about';

interface ApplicationStoreContextType {
  // Language & Translations
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['es'];

  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Winget Status
  wingetInfo: WingetInfo | null;
  isLoadingWinget: boolean;
  refreshWinget: () => Promise<void>;
  installedApps: InstalledApplication[];
  installedWingetIdSet: Set<string>;
  refreshInstalledApps: () => Promise<void>;

  // Catalog & Search
  softwareList: Software[];
  filteredSoftware: Software[];
  isLoadingCatalog: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;

  // Selection
  selectedSoftwareIds: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: (list?: Software[]) => void;
  deselectAll: () => void;
  isAllSelected: boolean;
  selectedSoftwareList: Software[];
  totalEstimatedSizeMB: number;
  isSoftwareBlocked: (software: Software) => boolean;

  // Queue & Installation
  queueState: QueueState;
  taskStatusMap: Record<string, { status: InstallationStatus; exitCode?: number; error?: string; details?: string }>;
  isQueueRunning: boolean;
  startInstallationQueue: (customList?: Software[]) => Promise<InstallationSummaryData | null>;
  startSingleInstallation: (software: Software) => Promise<InstallationSummaryData | null>;
  cancelInstallation: () => Promise<void>;
  lastSummary: InstallationSummaryData | null;
  setLastSummary: (s: InstallationSummaryData | null) => void;

  // Modals & Panels
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: (open: boolean) => void;
  isProgressModalOpen: boolean;
  setIsProgressModalOpen: (open: boolean) => void;
  isResultModalOpen: boolean;
  setIsResultModalOpen: (open: boolean) => void;
  isLogPanelOpen: boolean;
  setIsLogPanelOpen: (open: boolean) => void;
  toggleLogPanel: () => void;

  // Logs
  logs: LogEntry[];
  clearLogs: () => Promise<void>;
  exportLogs: () => Promise<{ success: boolean; filePath?: string }>;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;

  // Elevation
  isElevated: boolean;
  relaunchElevated: () => Promise<void>;

  // Profiles
  profiles: Profile[];
  customProfiles: Profile[];
  activeProfileId: string | null;
  applyProfile: (profile: Profile) => void;
  saveCustomProfile: (name: string, description?: string) => Promise<Profile>;
  deleteCustomProfile: (profileId: string) => Promise<void>;
  exportProfile: (profile: Profile) => void;
  importProfile: (jsonString: string) => Promise<{ success: boolean; profile?: Profile; error?: string }>;
  isSaveProfileModalOpen: boolean;
  setIsSaveProfileModalOpen: (open: boolean) => void;
  storageInfo: { isPortable: boolean; storagePath: string; profilesPath: string } | null;
}

const ApplicationStoreContext = createContext<ApplicationStoreContextType | null>(null);

export const ApplicationStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('catalog');

  // Winget Status State
  const [wingetInfo, setWingetInfo] = useState<WingetInfo | null>(null);
  const [isLoadingWinget, setIsLoadingWinget] = useState<boolean>(true);
  const [installedApps, setInstalledApps] = useState<InstalledApplication[]>([]);

  // Catalog State
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedSoftwareIds, setSelectedSoftwareIds] = useState<Set<string>>(new Set());

  // Installation Queue State
  const [queueState, setQueueState] = useState<QueueState>({
    isActive: false,
    isPaused: false,
    currentTaskIndex: -1,
    tasks: [],
    options: DEFAULT_SETTINGS.installation,
  });
  const [taskStatusMap, setTaskStatusMap] = useState<Record<string, { status: InstallationStatus; exitCode?: number; error?: string; details?: string }>>({});
  const [lastSummary, setLastSummary] = useState<InstallationSummaryData | null>(null);

  // Modals State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState<boolean>(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [isLogPanelOpen, setIsLogPanelOpen] = useState<boolean>(false);
  const [isSaveProfileModalOpen, setIsSaveProfileModalOpen] = useState<boolean>(false);

  // Profile State
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Logs State
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Elevation State
  const [isElevated, setIsElevated] = useState<boolean>(false);

  // Storage & Portable Info
  const [storageInfo, setStorageInfo] = useState<{ isPortable: boolean; storagePath: string; profilesPath: string } | null>(null);

  // Load Settings, Storage Info & Elevation
  useEffect(() => {
    electronApi.settings.get().then((loaded) => {
      setSettings(loaded);
    });
    electronApi.settings.getStorageInfo().then(setStorageInfo);
    electronApi.app.isElevated().then(setIsElevated);
  }, []);

  const relaunchElevated = useCallback(async () => {
    await electronApi.app.relaunchElevated();
  }, []);

  // Sync Theme with DOM
  useEffect(() => {
    const theme = settings.appearance?.theme || 'dark';

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.style.colorScheme = 'light';
      }
    };

    applyTheme();

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [settings.appearance?.theme]);

  // Fetch Winget Status
  const refreshWinget = useCallback(async () => {
    setIsLoadingWinget(true);
    try {
      const info = await electronApi.winget.check();
      setWingetInfo(info);
    } catch (err: any) {
      setWingetInfo({
        isAvailable: false,
        version: null,
        architecture: null,
        platform: 'win32',
        error: err.message,
      });
    } finally {
      setIsLoadingWinget(false);
    }
  }, []);

  // Fetch Installed Apps on the system
  const refreshInstalledApps = useCallback(async () => {
    try {
      const apps = await electronApi.winget.getInstalled();
      setInstalledApps(apps);
    } catch {
      setInstalledApps([]);
    }
  }, []);

  // Load Catalog
  useEffect(() => {
    let isMounted = true;
    softwareProvider.getAll().then((list) => {
      if (isMounted) {
        setSoftwareList(list);
        setIsLoadingCatalog(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Initial Winget check
  useEffect(() => {
    refreshWinget();
    refreshInstalledApps();
  }, [refreshWinget, refreshInstalledApps]);

  // Subscribe to IPC events (Logs, Queue State, Tasks)
  useEffect(() => {
    // Initial logs
    electronApi.logs.getAll().then((initialLogs) => {
      setLogs(initialLogs);
    });

    const unsubscribeLog = electronApi.logs.onEntry((entry) => {
      setLogs((prev) => [...prev.slice(-1500), entry]);
    });

    const unsubscribeCleared = electronApi.logs.onCleared(() => {
      setLogs([]);
    });

    const unsubscribeState = electronApi.installation.onState((state) => {
      setQueueState(state);
      if (state.isActive) {
        setIsProgressModalOpen(true);
      }
    });

    const unsubscribeTask = electronApi.installation.onTaskStatus((task: InstallationTask) => {
      setTaskStatusMap((prev) => ({
        ...prev,
        [task.software.id]: {
          status: task.status,
          exitCode: task.exitCode,
          error: task.error,
          details: task.details,
        },
      }));
    });

    const unsubscribeComplete = electronApi.installation.onComplete((summary) => {
      setLastSummary(summary);
      setIsProgressModalOpen(false);
      setIsResultModalOpen(true);
      // Re-fetch installed apps to reflect newly installed ones
      refreshInstalledApps();
    });

    return () => {
      unsubscribeLog();
      unsubscribeCleared();
      unsubscribeState();
      unsubscribeTask();
      unsubscribeComplete();
    };
  }, [refreshInstalledApps]);

  // Set of installed winget IDs for quick lookup
  const installedWingetIdSet = useMemo(() => {
    const set = new Set<string>();
    for (const app of installedApps) {
      set.add(app.id.toLowerCase());
    }
    return set;
  }, [installedApps]);

  // Filter software by search query and category
  const filteredSoftware = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const cat = selectedCategory;

    return softwareList.filter((app) => {
      // Category filter
      if (cat !== 'All') {
        const hasCategory = app.category.some((c) => c.toLowerCase() === cat.toLowerCase());
        if (!hasCategory) return false;
      }

      // Search filter
      if (!q) return true;

      const nameMatch = app.name.toLowerCase().includes(q);
      const idMatch = app.wingetId.toLowerCase().includes(q) || app.id.toLowerCase().includes(q);
      const pubMatch = app.publisher ? app.publisher.toLowerCase().includes(q) : false;
      const descMatch = app.description.toLowerCase().includes(q);
      const tagMatch = app.tags ? app.tags.some((t) => t.toLowerCase().includes(q)) : false;

      return nameMatch || idMatch || pubMatch || descMatch || tagMatch;
    });
  }, [softwareList, searchQuery, selectedCategory]);

  // Selection actions
  const isSoftwareBlocked = useCallback(
    (software: Software) => {
      const block = settings.installation?.blockInstalled ?? true;
      if (!block) return false;
      const inSystem = installedWingetIdSet.has(software.wingetId.toLowerCase());
      const inSession = taskStatusMap[software.id]?.status === 'installed';
      return inSystem || inSession;
    },
    [settings.installation?.blockInstalled, installedWingetIdSet, taskStatusMap]
  );

  const toggleSelect = useCallback(
    (id: string) => {
      setActiveProfileId(null);
      setSelectedSoftwareIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          const item = softwareList.find((s) => s.id === id);
          if (item && isSoftwareBlocked(item)) {
            return prev;
          }
          next.add(id);
        }
        return next;
      });
    },
    [softwareList, isSoftwareBlocked]
  );

  const selectAll = useCallback(
    (list?: Software[]) => {
      setActiveProfileId(null);
      const targetList = list || filteredSoftware;
      setSelectedSoftwareIds((prev) => {
        const next = new Set(prev);
        for (const item of targetList) {
          if (!isSoftwareBlocked(item)) {
            next.add(item.id);
          }
        }
        return next;
      });
    },
    [filteredSoftware, isSoftwareBlocked]
  );

  const deselectAll = useCallback(() => {
    setActiveProfileId(null);
    setSelectedSoftwareIds(new Set());
  }, []);

  const isAllSelected = useMemo(() => {
    const selectable = filteredSoftware.filter((app) => !isSoftwareBlocked(app));
    if (selectable.length === 0) return false;
    return selectable.every((app) => selectedSoftwareIds.has(app.id));
  }, [filteredSoftware, selectedSoftwareIds, isSoftwareBlocked]);

  const selectedSoftwareList = useMemo(() => {
    return softwareList.filter((app) => selectedSoftwareIds.has(app.id) && !isSoftwareBlocked(app));
  }, [softwareList, selectedSoftwareIds, isSoftwareBlocked]);

  const totalEstimatedSizeMB = useMemo(() => {
    return selectedSoftwareList.reduce((acc, app) => acc + (app.estimatedSize || 0), 0);
  }, [selectedSoftwareList]);

  // Settings actions
  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    const updated = await electronApi.settings.save(newSettings);
    setSettings(updated);
  }, []);

  const language = settings.language || 'es';
  const t = translations[language] || translations.es;

  const setLanguage = useCallback(
    (newLang: Language) => {
      updateSettings({ language: newLang });
    },
    [updateSettings]
  );

  // Profiles logic
  const customProfiles = useMemo(() => {
    return settings.customProfiles || [];
  }, [settings.customProfiles]);

  const profiles = useMemo(() => {
    return [...DEFAULT_PROFILES, ...customProfiles];
  }, [customProfiles]);

  const applyProfile = useCallback(
    (profile: Profile) => {
      const nextSet = new Set<string>();
      for (const id of profile.softwareIds) {
        const item = softwareList.find((s) => s.id === id);
        if (item && !isSoftwareBlocked(item)) {
          nextSet.add(id);
        }
      }
      setSelectedSoftwareIds(nextSet);
      setActiveProfileId(profile.id);
    },
    [softwareList, isSoftwareBlocked]
  );

  const saveCustomProfile = useCallback(async (name: string, description?: string): Promise<Profile> => {
    const newProfile: Profile = {
      id: `custom-${Date.now()}`,
      name,
      description: description || '',
      softwareIds: Array.from(selectedSoftwareIds),
      isDefault: false,
      createdAt: new Date().toISOString(),
      icon: 'Bookmark',
    };
    const currentCustom = settings.customProfiles || [];
    const updated = [...currentCustom, newProfile];
    await updateSettings({ customProfiles: updated });
    setActiveProfileId(newProfile.id);
    return newProfile;
  }, [selectedSoftwareIds, settings.customProfiles, updateSettings]);

  const deleteCustomProfile = useCallback(async (profileId: string) => {
    const currentCustom = settings.customProfiles || [];
    const updated = currentCustom.filter((p) => p.id !== profileId);
    await updateSettings({ customProfiles: updated });
    setActiveProfileId((prev) => (prev === profileId ? null : prev));
  }, [settings.customProfiles, updateSettings]);

  const exportProfile = useCallback((profile: Profile) => {
    const exportData: ProfileExportData = {
      version: '1.0.0',
      generator: 'ReInstall Hub',
      exportedAt: new Date().toISOString(),
      profile,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reinstall-profile-${profile.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const importProfile = useCallback(async (jsonString: string): Promise<{ success: boolean; profile?: Profile; error?: string }> => {
    try {
      const parsed = JSON.parse(jsonString);
      const targetProfile: Profile = parsed.profile || parsed;
      if (!targetProfile.name || !Array.isArray(targetProfile.softwareIds) || targetProfile.softwareIds.length === 0) {
        return { success: false, error: 'invalidFile' };
      }
      const imported: Profile = {
        id: `imported-${Date.now()}`,
        name: targetProfile.name,
        description: targetProfile.description || '',
        softwareIds: targetProfile.softwareIds.filter((id) => softwareList.some((s) => s.id === id)),
        isDefault: false,
        createdAt: new Date().toISOString(),
        icon: 'Bookmark',
      };
      const currentCustom = settings.customProfiles || [];
      const updated = [...currentCustom, imported];
      await updateSettings({ customProfiles: updated });
      applyProfile(imported);
      return { success: true, profile: imported };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [softwareList, settings.customProfiles, updateSettings, applyProfile]);

  // Queue actions
  const startInstallationQueue = useCallback(async (customList?: Software[]): Promise<InstallationSummaryData | null> => {
    const listToInstall = customList || selectedSoftwareList;
    if (listToInstall.length === 0) return null;

    setIsConfirmModalOpen(false);
    setIsProgressModalOpen(true);

    try {
      const summary = await electronApi.installation.start(listToInstall, settings.installation);
      return summary;
    } catch (err: any) {
      console.error('Queue failed to start:', err);
      return null;
    }
  }, [selectedSoftwareList, settings.installation]);

  const startSingleInstallation = useCallback(async (software: Software): Promise<InstallationSummaryData | null> => {
    setIsProgressModalOpen(true);
    try {
      const summary = await electronApi.installation.startSingle(software, settings.installation);
      return summary;
    } catch (err: any) {
      console.error('Single installation failed:', err);
      return null;
    }
  }, [settings.installation]);

  const cancelInstallation = useCallback(async () => {
    await electronApi.installation.cancel();
  }, []);

  // Log actions
  const clearLogs = useCallback(async () => {
    await electronApi.logs.clear();
    setLogs([]);
  }, []);

  const exportLogs = useCallback(async () => {
    return electronApi.logs.export();
  }, []);

  const toggleLogPanel = useCallback(() => {
    setIsLogPanelOpen((prev) => !prev);
  }, []);

  const value = {
    language,
    setLanguage,
    t,
    activeTab,
    setActiveTab,
    wingetInfo,
    isLoadingWinget,
    refreshWinget,
    installedApps,
    installedWingetIdSet,
    refreshInstalledApps,
    softwareList,
    filteredSoftware,
    isLoadingCatalog,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSoftwareIds,
    toggleSelect,
    selectAll,
    deselectAll,
    isAllSelected,
    selectedSoftwareList,
    totalEstimatedSizeMB,
    isSoftwareBlocked,
    queueState,
    taskStatusMap,
    isQueueRunning: queueState.isActive,
    startInstallationQueue,
    startSingleInstallation,
    cancelInstallation,
    lastSummary,
    setLastSummary,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isProgressModalOpen,
    setIsProgressModalOpen,
    isResultModalOpen,
    setIsResultModalOpen,
    isLogPanelOpen,
    setIsLogPanelOpen,
    toggleLogPanel,
    logs,
    clearLogs,
    exportLogs,
    settings,
    updateSettings,
    isElevated,
    relaunchElevated,
    // Profiles
    profiles,
    customProfiles,
    activeProfileId,
    applyProfile,
    saveCustomProfile,
    deleteCustomProfile,
    exportProfile,
    importProfile,
    isSaveProfileModalOpen,
    setIsSaveProfileModalOpen,
    storageInfo,
  };

  return (
    <ApplicationStoreContext.Provider value={value}>
      {children}
    </ApplicationStoreContext.Provider>
  );
};

export function useAppStore(): ApplicationStoreContextType {
  const context = useContext(ApplicationStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an ApplicationStoreProvider');
  }
  return context;
}

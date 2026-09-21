import { useAppStore } from '../store/applicationStore';

export function useWinget() {
  const {
    wingetInfo,
    isLoadingWinget,
    refreshWinget,
    installedApps,
    installedWingetIdSet,
    refreshInstalledApps,
  } = useAppStore();

  const isWingetAvailable = !!wingetInfo?.isAvailable;
  const wingetVersion = wingetInfo?.version || null;
  const installedCount = installedApps.length;

  const isSoftwareInstalled = (wingetId: string): boolean => {
    return installedWingetIdSet.has(wingetId.toLowerCase());
  };

  return {
    wingetInfo,
    isWingetAvailable,
    wingetVersion,
    isLoadingWinget,
    refreshWinget,
    installedApps,
    installedCount,
    isSoftwareInstalled,
    refreshInstalledApps,
  };
}

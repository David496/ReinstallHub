import { useAppStore } from '../store/applicationStore';

export function useActivityLog() {
  const {
    logs,
    clearLogs,
    exportLogs,
    isLogPanelOpen,
    setIsLogPanelOpen,
    toggleLogPanel,
  } = useAppStore();

  const copyLogsToClipboard = async (): Promise<boolean> => {
    try {
      const text = logs
        .map((e) => `[${e.timestamp}] [${e.level.toUpperCase()}] ${e.message}`)
        .join('\n');
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  return {
    logs,
    clearLogs,
    exportLogs,
    copyLogsToClipboard,
    isLogPanelOpen,
    setIsLogPanelOpen,
    toggleLogPanel,
  };
}

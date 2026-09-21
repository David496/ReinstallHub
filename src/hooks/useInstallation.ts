import { useAppStore } from '../store/applicationStore';
import { Software } from '../types/software';

export function useInstallation() {
  const {
    queueState,
    taskStatusMap,
    isQueueRunning,
    startInstallationQueue,
    startSingleInstallation,
    cancelInstallation,
    selectedSoftwareList,
    totalEstimatedSizeMB,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isProgressModalOpen,
    setIsProgressModalOpen,
    isResultModalOpen,
    setIsResultModalOpen,
    lastSummary,
  } = useAppStore();

  const getTaskStatus = (softwareId: string) => {
    return taskStatusMap[softwareId] || null;
  };

  const requestBulkInstall = () => {
    if (selectedSoftwareList.length === 0) return;
    setIsConfirmModalOpen(true);
  };

  const confirmBulkInstall = (customList?: Software[]) => {
    return startInstallationQueue(customList);
  };

  return {
    queueState,
    isQueueRunning,
    taskStatusMap,
    getTaskStatus,
    selectedSoftwareList,
    totalEstimatedSizeMB,
    requestBulkInstall,
    confirmBulkInstall,
    startSingleInstallation,
    cancelInstallation,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isProgressModalOpen,
    setIsProgressModalOpen,
    isResultModalOpen,
    setIsResultModalOpen,
    lastSummary,
  };
}

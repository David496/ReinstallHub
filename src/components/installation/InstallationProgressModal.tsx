import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useInstallation } from '../../hooks/useInstallation';
import { electronApi } from '../../services/electronApi';
import { Loader2, CheckCircle2, AlertTriangle, XCircle, StopCircle, Terminal } from 'lucide-react';
import { useAppStore } from '../../store/applicationStore';

export const InstallationProgressModal: React.FC = () => {
  const {
    isProgressModalOpen,
    setIsProgressModalOpen,
    queueState,
    cancelInstallation,
    isQueueRunning,
  } = useInstallation();
  const { t } = useAppStore();

  const [liveStreamLine, setLiveStreamLine] = useState<string>('WinGet CLI...');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const unsub = electronApi.installation.onStream(({ line }) => {
      setLiveStreamLine(line);
    });
    return () => unsub();
  }, []);

  const total = queueState.tasks.length;
  const currentIdx = queueState.currentTaskIndex >= 0 ? queueState.currentTaskIndex : 0;
  const currentTask = queueState.tasks[currentIdx];

  // Calculate percentage
  const completedTasks = queueState.tasks.filter(
    (t) => t.status === 'installed' || t.status === 'failed' || t.status === 'cancelled' || t.status === 'skipped'
  ).length;
  const progressPercent = total > 0 ? Math.round((completedTasks / total) * 100) : 0;

  const handleCancel = async () => {
    setIsCancelling(true);
    await cancelInstallation();
    setIsCancelling(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'installing':
        return (
          <Badge variant="accent" icon={<Loader2 className="w-3 h-3 animate-spin" />}>
            {t.catalog.installing}
          </Badge>
        );
      case 'installed':
        return (
          <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
            {t.modals.installed}
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="danger" icon={<AlertTriangle className="w-3 h-3" />}>
            {t.modals.failed}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="muted" icon={<XCircle className="w-3 h-3" />}>
            {t.modals.cancelled}
          </Badge>
        );
      case 'skipped':
        return <Badge variant="warning">{t.modals.skipped}</Badge>;
      default:
        return <Badge variant="default">{t.modals.waiting}</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isProgressModalOpen}
      title={t.modals.installingTitle}
      description={`${t.modals.installingDesc} (${completedTasks} / ${total})`}
      maxWidth="lg"
      showCloseButton={!isQueueRunning}
      onClose={() => !isQueueRunning && setIsProgressModalOpen(false)}
    >
      <div className="space-y-4">
        {/* Active Application & Progress Bar */}
        <div className="p-3.5 bg-win-bg/90 border border-win-border rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-win-accent animate-spin" />
              <span className="text-xs font-semibold text-win-text">
                {currentTask ? `${t.catalog.installing} ${currentTask.software.name}...` : t.modals.preparingQueue}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-win-accent">{progressPercent}%</span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2 rounded-full bg-win-panel overflow-hidden border border-win-border/50">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Live stream preview */}
          <div className="flex items-center gap-2 text-[11px] text-win-muted font-mono bg-slate-100 dark:bg-black/40 px-2.5 py-1.5 rounded border border-win-border/40 overflow-hidden">
            <Terminal className="w-3 h-3 text-win-muted flex-shrink-0" />
            <span className="truncate">{liveStreamLine}</span>
          </div>
        </div>

        {/* Task Queue List */}
        <div className="max-h-56 overflow-y-auto space-y-1.5 p-1.5 bg-win-panel/40 border border-win-border/60 rounded-xl">
          {queueState.tasks.map((task, idx) => (
            <div
              key={task.software.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors ${
                task.status === 'installing'
                  ? 'bg-win-card border-win-primary/50 shadow-sm'
                  : 'bg-win-card/40 border-win-border/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-win-muted text-[10px] w-4">{idx + 1}.</span>
                <span className="font-medium text-win-text">{task.software.name}</span>
                <span className="text-[10px] text-win-muted font-mono hidden sm:inline">
                  [{task.software.wingetId}]
                </span>
              </div>
              <div>{getStatusBadge(task.status)}</div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-win-border">
          <span className="text-xs text-win-muted">
            {t.modals.doNotClose}
          </span>

          {isQueueRunning && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancel}
              isLoading={isCancelling}
              icon={<StopCircle className="w-3.5 h-3.5" />}
            >
              {t.modals.cancelInstallation}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

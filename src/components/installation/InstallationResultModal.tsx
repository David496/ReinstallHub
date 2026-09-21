import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useInstallation } from '../../hooks/useInstallation';
import { useAppStore } from '../../store/applicationStore';
import { CheckCircle2, AlertTriangle, RefreshCw, Terminal, Check } from 'lucide-react';
import { Software } from '../../types/software';

export const InstallationResultModal: React.FC = () => {
  const {
    isResultModalOpen,
    setIsResultModalOpen,
    lastSummary,
    confirmBulkInstall,
  } = useInstallation();

  const { setIsLogPanelOpen, t } = useAppStore();

  if (!lastSummary) return null;

  const failedTasks = lastSummary.tasks.filter((t) => t.status === 'failed');

  const handleRetryFailed = () => {
    setIsResultModalOpen(false);
    const failedSoftware: Software[] = failedTasks.map((t) => t.software);
    confirmBulkInstall(failedSoftware);
  };

  const handleViewLogs = () => {
    setIsResultModalOpen(false);
    setIsLogPanelOpen(true);
  };

  const durationSec = (lastSummary.durationMs / 1000).toFixed(1);

  return (
    <Modal
      isOpen={isResultModalOpen}
      onClose={() => setIsResultModalOpen(false)}
      title={t.modals.summaryTitle}
      description={`${t.modals.completedIn} ${durationSec} ${t.modals.seconds}.`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-xl font-bold text-emerald-400">{lastSummary.installed}</span>
            <span className="text-[11px] text-emerald-300 block font-medium">{t.modals.installed}</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <span className="text-xl font-bold text-rose-400">{lastSummary.failed}</span>
            <span className="text-[11px] text-rose-300 block font-medium">{t.modals.failed}</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-xl font-bold text-amber-400">{lastSummary.skipped}</span>
            <span className="text-[11px] text-amber-300 block font-medium">{t.modals.skipped}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20 text-center">
            <span className="text-xl font-bold text-slate-400">{lastSummary.cancelled}</span>
            <span className="text-[11px] text-slate-300 block font-medium">{t.modals.cancelled}</span>
          </div>
        </div>

        {/* Detailed Results List */}
        <div className="max-h-56 overflow-y-auto space-y-1.5 p-2 bg-win-bg/80 border border-win-border rounded-xl">
          {lastSummary.tasks.map((task) => (
            <div
              key={task.software.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-win-panel border border-win-border/40 text-xs"
            >
              <div className="flex items-center gap-2">
                {task.status === 'installed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-win-text">{task.software.name}</span>
                  {task.error && (
                    <p className="text-[11px] text-rose-400 mt-0.5">{task.error}</p>
                  )}
                  {task.details && !task.error && (
                    <p className="text-[11px] text-win-muted mt-0.5">{task.details}</p>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                {task.status === 'installed' ? (
                  <Badge variant="success">{t.modals.success}</Badge>
                ) : (
                  <Badge variant="danger">{t.modals.failed}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-win-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewLogs}
            icon={<Terminal className="w-3.5 h-3.5" />}
          >
            {t.modals.viewActivityLog}
          </Button>

          <div className="flex items-center gap-2">
            {failedTasks.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRetryFailed}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                {t.modals.retryFailed} ({failedTasks.length})
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsResultModalOpen(false)}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              {t.modals.done}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import {
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileCheck,
  Server,
  Terminal,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAppStore } from '../../store/applicationStore';

export const InstallWingetModal: React.FC = () => {
  const {
    t,
    isInstallWingetModalOpen,
    setIsInstallWingetModalOpen,
    isInstallingEngine,
    wingetInstallProgress,
    installWingetEngine,
    wingetInfo,
  } = useAppStore();

  if (!isInstallWingetModalOpen) return null;

  const progress = wingetInstallProgress;
  const currentStep = progress?.step;
  const isCompleted = currentStep === 'completed';
  const isFailed = currentStep === 'failed';
  const percent = progress?.percent ?? 0;

  const handleStart = async () => {
    await installWingetEngine();
  };

  const handleClose = () => {
    if (!isInstallingEngine) {
      setIsInstallWingetModalOpen(false);
    }
  };

  const steps = [
    {
      id: 'downloading_deps',
      label: t.installer.step_downloading_deps,
      icon: <Server className="w-3.5 h-3.5" />,
      done: ['downloading_bundle', 'installing', 'verifying', 'completed'].includes(currentStep || ''),
      active: currentStep === 'downloading_deps',
    },
    {
      id: 'downloading_bundle',
      label: t.installer.step_downloading_bundle,
      icon: <DownloadCloud className="w-3.5 h-3.5" />,
      done: ['installing', 'verifying', 'completed'].includes(currentStep || ''),
      active: currentStep === 'downloading_bundle',
    },
    {
      id: 'installing',
      label: t.installer.step_installing,
      icon: <Terminal className="w-3.5 h-3.5" />,
      done: ['verifying', 'completed'].includes(currentStep || ''),
      active: currentStep === 'installing',
    },
    {
      id: 'verifying',
      label: t.installer.step_verifying,
      icon: <FileCheck className="w-3.5 h-3.5" />,
      done: currentStep === 'completed',
      active: currentStep === 'verifying',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-win-panel border border-win-border rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-win-primary/10 border border-win-primary/30 flex items-center justify-center text-win-accent flex-shrink-0">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-win-text">{t.installer.installWingetTitle}</h3>
              <p className="text-xs text-win-muted mt-0.5">{t.installer.installWingetDesc}</p>
            </div>
          </div>
          {!isInstallingEngine && (
            <button
              onClick={handleClose}
              className="p-1 text-win-muted hover:text-win-text rounded hover:bg-win-card"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {(isInstallingEngine || progress) && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-mono text-win-muted">
              <span>{progress?.message || 'Procesando...'}</span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 w-full bg-win-card rounded-full overflow-hidden border border-win-border">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isFailed
                    ? 'bg-red-500'
                    : isCompleted
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-sky-500 to-win-primary animate-pulse'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Checkpoints */}
        <div className="p-3 rounded-lg bg-win-card border border-win-border/70 space-y-2.5">
          {steps.map((st) => (
            <div key={st.id} className="flex items-center gap-2.5 text-xs">
              <div className="flex-shrink-0">
                {st.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : st.active ? (
                  <Loader2 className="w-4 h-4 text-win-primary animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-win-border flex items-center justify-center text-win-muted text-[10px]">
                    {st.icon}
                  </div>
                )}
              </div>
              <span
                className={`truncate ${
                  st.done
                    ? 'text-win-text font-medium'
                    : st.active
                    ? 'text-win-accent font-semibold'
                    : 'text-win-muted'
                }`}
              >
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {/* Success or Error Callout */}
        {isCompleted && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>
              {t.installer.step_completed} {wingetInfo?.version ? `(v${wingetInfo.version})` : ''}
            </span>
          </div>
        )}

        {isFailed && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{progress?.error || t.installer.step_failed}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-win-border/50">
          {!isInstallingEngine && !isCompleted && (
            <Button
              size="sm"
              variant="primary"
              onClick={handleStart}
              icon={<DownloadCloud className="w-3.5 h-3.5" />}
            >
              {isFailed ? t.installer.retry : t.installer.installBtn}
            </Button>
          )}

          {isCompleted && (
            <Button size="sm" variant="primary" onClick={handleClose}>
              {t.installer.close}
            </Button>
          )}

          {!isInstallingEngine && !isCompleted && (
            <Button size="sm" variant="ghost" onClick={handleClose}>
              {t.installer.close}
            </Button>
          )}

          {isInstallingEngine && (
            <div className="flex items-center gap-2 text-xs text-win-muted font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-win-primary" />
              <span>{t.installer.installingBtn}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

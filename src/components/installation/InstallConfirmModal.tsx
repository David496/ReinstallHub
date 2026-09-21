import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useInstallation } from '../../hooks/useInstallation';
import { Download, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

import { useAppStore } from '../../store/applicationStore';

export const InstallConfirmModal: React.FC = () => {
  const {
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    selectedSoftwareList,
    confirmBulkInstall,
  } = useInstallation();
  const { t, isElevated, relaunchElevated } = useAppStore();

  const handleConfirm = () => {
    confirmBulkInstall();
  };

  return (
    <Modal
      isOpen={isConfirmModalOpen}
      onClose={() => setIsConfirmModalOpen(false)}
      title={t.modals.confirmTitle}
      description={t.modals.confirmDesc}
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-xs text-win-muted">{t.modals.aboutToInstall}</p>

        <div className="max-h-56 overflow-y-auto space-y-1.5 p-2 bg-win-bg/80 border border-win-border rounded-lg">
          {selectedSoftwareList.map((software, idx) => (
            <div
              key={software.id}
              className="flex items-center justify-between px-2.5 py-1.5 rounded bg-win-panel border border-win-border/40 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-win-muted text-[10px] w-4">{idx + 1}.</span>
                <span className="font-medium text-win-text">{software.name}</span>
              </div>
              <span className="font-mono text-[11px] text-win-muted">{software.wingetId}</span>
            </div>
          ))}
        </div>

        {/* Elevation Status & Guidance */}
        {!isElevated ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/25 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
              <div>
                <p className="font-semibold text-win-text">{t.modals.uacWarningTitle}</p>
                <p className="text-[11px] text-win-muted mt-0.5 leading-snug">{t.modals.uacWarningDesc}</p>
              </div>
            </div>
            <Button
              size="xs"
              variant="outline"
              onClick={relaunchElevated}
              icon={<Shield className="w-3 h-3 text-amber-500" />}
              className="flex-shrink-0 border-amber-500/40 hover:bg-amber-500/20 text-amber-500 font-medium"
            >
              {t.modals.relaunchAsAdminBtn}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span>Sesión con permisos de Administrador: las aplicaciones se instalarán de forma fluida y sin pausas de UAC.</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-win-border">
          <span className="text-xs font-semibold text-win-text">
            {t.modals.total}: {selectedSoftwareList.length} {t.modals.applications}
          </span>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmModalOpen(false)}>
              {t.modals.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              {t.modals.startInstallation}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import { Download, CheckSquare, Square, HardDrive } from 'lucide-react';
import { Button } from '../common/Button';
import { useCatalog } from '../../hooks/useCatalog';
import { useInstallation } from '../../hooks/useInstallation';
import { useWinget } from '../../hooks/useWinget';

import { useAppStore } from '../../store/applicationStore';

export const InstallationSummary: React.FC = () => {
  const {
    filteredSoftware,
    selectedCount,
    selectAll,
    deselectAll,
    isAllSelected,
  } = useCatalog();
  const { requestBulkInstall, totalEstimatedSizeMB, isQueueRunning } = useInstallation();
  const { isWingetAvailable } = useWinget();
  const { t } = useAppStore();

  const formattedSize =
    totalEstimatedSizeMB > 0
      ? totalEstimatedSizeMB >= 1024
        ? `${(totalEstimatedSizeMB / 1024).toFixed(2)} GB`
        : `${totalEstimatedSizeMB} MB`
      : t.catalog.unknown;

  return (
    <div className="bg-win-panel border border-win-border rounded-lg p-2.5 px-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm flex-shrink-0">
      {/* Left: Counts & Selection Controls */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-win-muted font-medium uppercase tracking-wider">
            {t.catalog.selectedApps}:
          </span>
          <span className="text-base font-bold text-win-text leading-none">{selectedCount}</span>
          <span className="text-[11px] text-win-muted/70">/ {filteredSoftware.length}</span>
        </div>

        <div className="h-5 w-px bg-win-border hidden sm:block" />

        {/* Estimated Size */}
        <div className="flex items-center gap-1.5 text-xs">
          <HardDrive className="w-3.5 h-3.5 text-win-accent flex-shrink-0" />
          <span className="text-win-muted text-[11px]">{t.catalog.estimatedDownload}:</span>
          <span className="font-semibold text-win-text text-[11px]">{formattedSize}</span>
        </div>

        <div className="h-5 w-px bg-win-border hidden sm:block" />

        {/* Quick select buttons */}
        <div className="flex items-center gap-1.5">
          {isAllSelected ? (
            <Button
              size="xs"
              variant="ghost"
              onClick={deselectAll}
              icon={<Square className="w-3 h-3 text-win-muted" />}
            >
              {t.catalog.deselectAll}
            </Button>
          ) : (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => selectAll(filteredSoftware)}
              icon={<CheckSquare className="w-3 h-3 text-win-primary" />}
            >
              {t.catalog.selectAllFiltered}
            </Button>
          )}
        </div>
      </div>

      {/* Right: Main Action Button */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Button
          size="sm"
          variant="primary"
          onClick={requestBulkInstall}
          disabled={selectedCount === 0 || !isWingetAvailable || isQueueRunning}
          icon={<Download className="w-3.5 h-3.5" />}
          className="w-full sm:w-auto px-4 py-1 font-semibold text-xs shadow-md shadow-sky-500/15"
        >
          {selectedCount === 0
            ? t.catalog.noAppsSelected
            : !isWingetAvailable
            ? t.catalog.wingetRequired
            : isQueueRunning
            ? t.catalog.installing
            : `${t.dashboard.installSelected} (${selectedCount})`}
        </Button>
      </div>
    </div>
  );
};

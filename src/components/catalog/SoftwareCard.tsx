import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, Star, HardDrive } from 'lucide-react';
import { Software } from '../../types/software';
import { Checkbox } from '../common/Checkbox';
import { useWinget } from '../../hooks/useWinget';
import { useInstallation } from '../../hooks/useInstallation';
import { useAppStore } from '../../store/applicationStore';

export interface SoftwareCardProps {
  software: Software;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onInstallSingle?: (software: Software) => void;
  disabled?: boolean;
}

export const SoftwareCard: React.FC<SoftwareCardProps> = ({
  software,
  isSelected,
  onToggleSelect,
  disabled = false,
}) => {
  const { isSoftwareInstalled } = useWinget();
  const { getTaskStatus } = useInstallation();
  const { t, language, settings } = useAppStore();

  const isInstalledOnSystem = isSoftwareInstalled(software.wingetId);
  const taskStatus = getTaskStatus(software.id);
  const isBlocked = Boolean((settings.installation?.blockInstalled ?? true) && (isInstalledOnSystem || taskStatus?.status === 'installed'));
  const isCardDisabled = disabled || isBlocked;
  const localizedDescription =
    language === 'es' && software.descriptionEs ? software.descriptionEs : software.description;

  const renderStatus = () => {
    if (taskStatus?.status === 'installing') {
      return (
        <span className="flex items-center gap-1 text-win-accent font-medium">
          <Clock className="w-2.5 h-2.5 animate-spin" />
          {t.catalog.installing}
        </span>
      );
    }
    if (taskStatus?.status === 'installed' || isInstalledOnSystem) {
      return (
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="w-2.5 h-2.5" />
          {t.catalog.alreadyInstalled || t.modals.installed}
        </span>
      );
    }
    if (taskStatus?.status === 'failed') {
      return (
        <span className="flex items-center gap-1 text-rose-500 font-medium" title={taskStatus?.error}>
          <AlertTriangle className="w-2.5 h-2.5" />
          {t.modals.failed}
        </span>
      );
    }
    if (taskStatus?.status === 'pending') {
      return (
        <span className="flex items-center gap-1 text-amber-500 font-medium">
          <Clock className="w-2.5 h-2.5" />
          {t.modals.inQueue}
        </span>
      );
    }
    return (
      <span className="text-win-muted/60">
        {software.category[0] ? (t.categories[software.category[0] as keyof typeof t.categories] || software.category[0]) : ''}
      </span>
    );
  };

  return (
    <div
      onClick={() => {
        if (!isCardDisabled) {
          onToggleSelect(software.id);
        }
      }}
      className={`group relative flex flex-col justify-between p-2.5 rounded-lg border transition-all duration-150 select-none ${
        isBlocked
          ? 'bg-win-panel/50 border-emerald-500/20 dark:border-emerald-500/20 cursor-default opacity-80'
          : isSelected
          ? 'bg-win-card border-win-primary shadow-md shadow-sky-500/10 ring-1 ring-win-primary/50 cursor-pointer'
          : disabled
          ? 'bg-win-panel/40 border-win-border/60 opacity-60 cursor-not-allowed'
          : 'bg-win-panel border-win-border hover:border-win-muted/40 hover:bg-win-card/60 shadow-sm cursor-pointer'
      }`}
    >
      <div>
        {/* Header: Icon + Name + Star + Checkbox */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-md bg-black/5 dark:bg-black/25 border border-win-border/50 p-1 flex items-center justify-center flex-shrink-0 group-hover:border-win-primary/40 transition-colors">
              <img
                src={software.icon}
                alt={software.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/icon.svg';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-bold text-win-text group-hover:text-win-primary dark:group-hover:text-white transition-colors leading-snug truncate">
                  {software.name}
                </h3>
                {software.recommended && (
                  <span title={t.catalog.recommended} className="flex-shrink-0 inline-flex">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </span>
                )}
              </div>
              {software.publisher && software.publisher !== 'Unknown Publisher' && (
                <p className="text-[10px] text-win-muted truncate leading-none mt-0.5">
                  {software.publisher}
                </p>
              )}
            </div>
          </div>

          <div
            className="flex-shrink-0 pt-0.5"
            onClick={(e) => e.stopPropagation()}
            title={isBlocked ? t.catalog.alreadyInstalledTooltip : undefined}
          >
            <Checkbox
              checked={isSelected && !isBlocked}
              onChange={() => onToggleSelect(software.id)}
              disabled={isCardDisabled}
            />
          </div>
        </div>

        {/* Compact Description (2 lines max, tight leading) */}
        <p className="text-[11px] text-win-muted/80 line-clamp-2 leading-snug min-h-[1.9rem]">
          {localizedDescription}
        </p>
      </div>

      {/* Clean Footer: Status & Size */}
      <div className="pt-1.5 mt-2 border-t border-win-border/40 flex items-center justify-between text-[10px] text-win-muted">
        <div>
          {renderStatus()}
        </div>

        <span className="flex items-center gap-0.5 text-win-muted/60 font-mono">
          <HardDrive className="w-2.5 h-2.5" />
          {software.estimatedSize ? `~${software.estimatedSize}MB` : ''}
        </span>
      </div>
    </div>
  );
};

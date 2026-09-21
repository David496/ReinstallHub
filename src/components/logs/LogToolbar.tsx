import React, { useState } from 'react';
import { Copy, Trash2, Download, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../common/Button';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useAppStore } from '../../store/applicationStore';

export interface LogToolbarProps {
  selectedLevel: string;
  onSelectLevel: (level: string) => void;
  isAutoScroll: boolean;
  onToggleAutoScroll: () => void;
}

export const LogToolbar: React.FC<LogToolbarProps> = ({
  selectedLevel,
  onSelectLevel,
  isAutoScroll,
  onToggleAutoScroll,
}) => {
  const { copyLogsToClipboard, clearLogs, exportLogs, toggleLogPanel, isLogPanelOpen } =
    useActivityLog();
  const { t } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = async () => {
    const ok = await copyLogsToClipboard();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportLogs();
    setIsExporting(false);
  };

  const levels = ['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR', 'COMMAND'];

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-win-panel border-t border-win-border text-xs select-none">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLogPanel}
          className="flex items-center gap-1.5 font-semibold text-win-text hover:text-win-accent transition-colors"
        >
          {isLogPanelOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          <span>{t.logs.activityLog}</span>
        </button>

        {/* Level Filters */}
        <div className="hidden sm:flex items-center gap-1 ml-4 bg-win-card px-1 py-0.5 rounded border border-win-border">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => onSelectLevel(lvl)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                selectedLevel === lvl
                  ? 'bg-win-primary text-white font-bold'
                  : 'text-win-muted hover:text-win-text'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleAutoScroll}
          className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
            isAutoScroll
              ? 'bg-win-card border-win-primary/40 text-win-accent'
              : 'bg-transparent border-transparent text-win-muted hover:text-win-text'
          }`}
          title="Toggle auto-scroll on new log entries"
        >
          {t.logs.autoScroll}: {isAutoScroll ? 'ON' : 'OFF'}
        </button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          icon={copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          title="Copy log to clipboard"
        >
          {copied ? t.logs.copied : t.logs.copy}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleExport}
          isLoading={isExporting}
          icon={<Download className="w-3 h-3" />}
          title="Export to reinstall-hub-log.txt"
        >
          {t.logs.export}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={clearLogs}
          icon={<Trash2 className="w-3 h-3 text-rose-400" />}
          title="Clear log activity"
        >
          {t.logs.clear}
        </Button>
      </div>
    </div>
  );
};

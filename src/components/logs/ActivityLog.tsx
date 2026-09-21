import React, { useState, useRef, useEffect } from 'react';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useAppStore } from '../../store/applicationStore';
import { LogToolbar } from './LogToolbar';
import { LogEntry } from '../../types/log';

export const ActivityLog: React.FC = () => {
  const { logs, isLogPanelOpen } = useActivityLog();
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new log entries arrive
  useEffect(() => {
    if (isAutoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll]);

  const filteredLogs = logs.filter((entry) => {
    if (selectedLevel === 'ALL') return true;
    return entry.level.toUpperCase() === selectedLevel;
  });

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return 'text-sky-400';
      case 'success':
        return 'text-emerald-400';
      case 'warning':
        return 'text-amber-400';
      case 'error':
        return 'text-rose-400 font-semibold';
      case 'command':
        return 'text-indigo-400';
      default:
        return 'text-win-muted';
    }
  };

  const { t } = useAppStore();

  if (!isLogPanelOpen) {
    return null;
  }

  return (
    <div className="flex flex-col border-t border-win-border bg-win-bg flex-shrink-0 animate-in slide-in-from-bottom-3 duration-150">
      <LogToolbar
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        isAutoScroll={isAutoScroll}
        onToggleAutoScroll={() => setIsAutoScroll((prev) => !prev)}
      />

      {isLogPanelOpen && (
        <div
          ref={logContainerRef}
          className="h-56 bg-slate-950 dark:bg-black/60 p-3 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-1 select-text transition-all duration-200"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-win-muted/60 italic py-4 text-center">{t.logs.noLogs}</div>
          ) : (
            filteredLogs.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2.5 hover:bg-white/[0.02] px-1 rounded">
                <span className="text-win-muted/60 flex-shrink-0 select-none">[{entry.timestamp}]</span>
                <span
                  className={`px-1 rounded text-[10px] font-bold uppercase flex-shrink-0 select-none ${getLevelColor(
                    entry.level
                  )}`}
                >
                  [{entry.level}]
                </span>
                <span className="text-slate-200 break-all">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

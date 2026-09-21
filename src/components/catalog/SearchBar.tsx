import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

import { useAppStore } from '../../store/applicationStore';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  totalCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  totalCount,
}) => {
  const { t } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const effectivePlaceholder = placeholder || t.catalog.searchPlaceholder;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-2.5 text-win-muted pointer-events-none">
        <Search className="w-3.5 h-3.5" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={effectivePlaceholder}
        className="w-full pl-8 pr-20 py-1.5 text-xs bg-win-panel border border-win-border rounded-md text-win-text placeholder-win-muted/60 focus:outline-none focus:border-win-primary focus:ring-1 focus:ring-win-primary transition-all"
      />

      <div className="absolute right-2.5 flex items-center gap-1.5">
        {value ? (
          <button
            onClick={() => onChange('')}
            className="p-1 text-win-muted hover:text-win-text rounded-md hover:bg-win-card"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-win-muted bg-win-card border border-win-border rounded">
            Ctrl K
          </kbd>
        )}
        <span className="text-[11px] text-win-muted/70 pl-1 border-l border-win-border">
          {totalCount} {t.catalog.appsCount}
        </span>
      </div>
    </div>
  );
};

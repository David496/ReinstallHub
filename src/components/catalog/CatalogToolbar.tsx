import React, { useRef, useEffect } from 'react';
import { Search, X, Download, HardDrive, CheckSquare, Square } from 'lucide-react';
import { CategoryType, Software } from '../../types/software';
import { Button } from '../common/Button';
import { ProfileSelector } from './ProfileSelector';
import { SaveProfileModal } from './SaveProfileModal';
import { useCatalog } from '../../hooks/useCatalog';
import { useInstallation } from '../../hooks/useInstallation';
import { useWinget } from '../../hooks/useWinget';
import { useAppStore } from '../../store/applicationStore';

export interface CatalogToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  categories: CategoryType[];
  softwareList: Software[];
  filteredCount: number;
}

export const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  softwareList,
  filteredCount,
}) => {
  const { filteredSoftware, selectedCount, selectAll, deselectAll, isAllSelected } = useCatalog();
  const { requestBulkInstall, totalEstimatedSizeMB, isQueueRunning } = useInstallation();
  const { isWingetAvailable } = useWinget();
  const { t } = useAppStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formattedSize =
    totalEstimatedSizeMB > 0
      ? totalEstimatedSizeMB >= 1024
        ? `${(totalEstimatedSizeMB / 1024).toFixed(2)} GB`
        : `${totalEstimatedSizeMB} MB`
      : null;

  const getCategoryCount = (category: CategoryType): number => {
    if (category === 'All') return softwareList.length;
    return softwareList.filter((s) =>
      s.category.some((c) => c.toLowerCase() === category.toLowerCase())
    ).length;
  };

  return (
    <div className="bg-win-panel border border-win-border rounded-lg p-2.5 shadow-sm space-y-2 flex-shrink-0">
      {/* Top Row: Search Input + Batch Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Search Field */}
        <div className="relative flex items-center w-full sm:max-w-md">
          <div className="absolute left-2.5 text-win-muted pointer-events-none">
            <Search className="w-3.5 h-3.5" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.catalog.searchPlaceholder}
            className="w-full pl-8 pr-16 py-1.5 text-xs bg-win-bg border border-win-border rounded-md text-win-text placeholder-win-muted/60 focus:outline-none focus:border-win-primary focus:ring-1 focus:ring-win-primary transition-all"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-win-muted hover:text-win-text rounded hover:bg-win-card"
                title="Borrar búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono text-win-muted bg-win-card border border-win-border rounded">
                Ctrl K
              </kbd>
            )}
            <span className="text-[10px] text-win-muted/60 pl-1 border-l border-win-border">
              {filteredCount}
            </span>
          </div>
        </div>

        {/* Batch Selection Controls & Primary Install Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Profile Manager Dropdown */}
          <ProfileSelector />

          {/* Quick Select / Deselect Button */}
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

          {/* Selection counter & estimated size pill */}
          {selectedCount > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-[11px] px-2 py-1 rounded bg-win-card border border-win-border text-win-text">
              <span className="font-bold text-win-primary">{selectedCount}</span>
              <span className="text-win-muted">sel.</span>
              {formattedSize && (
                <>
                  <span className="text-win-border">|</span>
                  <HardDrive className="w-3 h-3 text-win-accent" />
                  <span className="font-mono text-[10px]">{formattedSize}</span>
                </>
              )}
            </div>
          )}

          {/* Primary Install Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={requestBulkInstall}
            disabled={selectedCount === 0 || !isWingetAvailable || isQueueRunning}
            icon={<Download className="w-3.5 h-3.5" />}
            className="px-3.5 py-1 text-xs font-semibold shadow-sm"
          >
            {selectedCount === 0
              ? t.dashboard.selectSoftwareToInstall
              : isQueueRunning
              ? t.catalog.installing
              : `${t.dashboard.installSelected} (${selectedCount})`}
          </Button>
        </div>
      </div>

      {/* Bottom Row: Minimalist Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar select-none pt-0.5 border-t border-win-border/40">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = getCategoryCount(cat);
          const translatedLabel = t.categories[cat] || cat;

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-win-primary text-white border-win-primary shadow-sm font-semibold'
                  : 'bg-win-card/70 border-win-border/70 text-win-muted hover:text-win-text hover:bg-win-card'
              }`}
            >
              <span>{translatedLabel}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded-full font-mono leading-none ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-black/30 text-win-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Save Profile Modal */}
      <SaveProfileModal />
    </div>
  );
};

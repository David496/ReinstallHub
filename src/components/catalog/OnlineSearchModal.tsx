import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Search,
  X,
  Plus,
  Check,
  Download,
  Loader2,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAppStore } from '../../store/applicationStore';
import { WingetSearchResult } from '../../types/winget';

interface OnlineSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const OnlineSearchModal: React.FC<OnlineSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const {
    t,
    onlineSearchResults,
    isSearchingOnline,
    searchOnline,
    clearOnlineSearch,
    addCustomSoftware,
    setIsConfirmModalOpen,
    wingetInfo,
  } = useAppStore();

  const [query, setQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery && initialQuery.length >= 2) {
        setQuery(initialQuery);
        searchOnline(initialQuery);
        setHasSearched(true);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      clearOnlineSearch();
      setHasSearched(false);
    }
  }, [isOpen, initialQuery, searchOnline, clearOnlineSearch]);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || query.trim().length < 2) return;
    setHasSearched(true);
    searchOnline(query.trim());
  };

  const handleAdd = (result: WingetSearchResult) => {
    addCustomSoftware(result);
    setAddedIds((prev) => new Set(prev).add(result.id));
  };

  const handleInstallNow = (result: WingetSearchResult) => {
    addCustomSoftware(result);
    setAddedIds((prev) => new Set(prev).add(result.id));
    onClose();
    setIsConfirmModalOpen(true);
  };

  const popularSuggestions = ['Spotify', 'Docker', 'Postman', 'Git', 'Python', 'Steam', 'Obsidian', 'Discord'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-win-panel border border-win-border rounded-xl shadow-2xl max-w-2xl w-full p-5 space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-win-primary/10 border border-win-primary/30 flex items-center justify-center text-win-accent flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-win-text">{t.onlineSearch.title}</h3>
              <p className="text-xs text-win-muted mt-0.5">{t.onlineSearch.placeholder}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-win-muted hover:text-win-text rounded hover:bg-win-card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-win-muted" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.onlineSearch.placeholder}
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-win-bg border border-win-border rounded-md text-win-text placeholder-win-muted/60 focus:outline-none focus:border-win-primary"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-win-muted hover:text-win-text"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            size="sm"
            variant="primary"
            isLoading={isSearchingOnline}
            disabled={!query.trim() || query.trim().length < 2 || !wingetInfo?.isAvailable}
            icon={<Search className="w-3.5 h-3.5" />}
          >
            {t.onlineSearch.searchBtn}
          </Button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 no-scrollbar">
          <span className="text-[10px] text-win-muted uppercase font-semibold mr-1">Ejemplos:</span>
          {popularSuggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setQuery(item);
                setHasSearched(true);
                searchOnline(item);
              }}
              className="px-2 py-0.5 rounded text-[11px] bg-win-card border border-win-border text-win-muted hover:text-win-text hover:border-win-primary/50 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
          {isSearchingOnline ? (
            <div className="flex flex-col items-center justify-center py-16 text-win-muted">
              <Loader2 className="w-8 h-8 animate-spin text-win-primary mb-2" />
              <p className="text-xs font-medium">{t.onlineSearch.searching}</p>
            </div>
          ) : hasSearched && onlineSearchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-win-muted text-center rounded-lg bg-win-card border border-win-border/50">
              <AlertCircle className="w-8 h-8 text-amber-400/80 mb-2" />
              <p className="text-xs font-semibold text-win-text">{t.onlineSearch.noResults}</p>
              <p className="text-[11px] text-win-muted mt-1 max-w-sm">
                Verifica el nombre o prueba buscando palabras clave más simples.
              </p>
            </div>
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center py-16 text-win-muted text-center">
              <Globe className="w-10 h-10 text-win-muted/40 mb-2" />
              <p className="text-xs">{t.onlineSearch.queryTooShort}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-[11px] text-win-muted font-medium pb-1 border-b border-win-border/40">
                {onlineSearchResults.length} {t.onlineSearch.resultsCount}
              </div>

              {onlineSearchResults.map((result) => {
                const isAdded = addedIds.has(result.id);
                return (
                  <div
                    key={result.id}
                    className="p-3 rounded-lg bg-win-card border border-win-border hover:border-win-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-win-text truncate">{result.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-black/5 dark:bg-black/30 border border-win-border text-win-muted">
                          {result.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-win-muted">
                        <span>v{result.version}</span>
                        <span>•</span>
                        <span className="text-sky-400">{result.source}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="xs"
                        variant={isAdded ? 'outline' : 'secondary'}
                        onClick={() => handleAdd(result)}
                        icon={isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3" />}
                      >
                        {isAdded ? t.onlineSearch.addedToCatalog : t.onlineSearch.addToCatalog}
                      </Button>

                      <Button
                        size="xs"
                        variant="primary"
                        onClick={() => handleInstallNow(result)}
                        icon={<Download className="w-3 h-3" />}
                      >
                        {t.onlineSearch.addToQueue}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-win-border/50 text-[11px] text-win-muted flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Los paquetes agregados se integran a tu catálogo y perfil actual.</span>
          </div>
          <Button size="xs" variant="ghost" onClick={onClose}>
            {t.modals.cancel}
          </Button>
        </div>
      </div>
    </div>
  );
};

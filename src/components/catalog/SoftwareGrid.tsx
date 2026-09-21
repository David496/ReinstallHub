import React from 'react';
import { Software } from '../../types/software';
import { SoftwareCard } from './SoftwareCard';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { SearchX } from 'lucide-react';

import { useAppStore } from '../../store/applicationStore';

export interface SoftwareGridProps {
  softwareList: Software[];
  selectedSoftwareIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onInstallSingle: (software: Software) => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
  disabled?: boolean;
}

export const SoftwareGrid: React.FC<SoftwareGridProps> = ({
  softwareList,
  selectedSoftwareIds,
  onToggleSelect,
  onInstallSingle,
  onClearFilters,
  isFiltered = false,
  disabled = false,
}) => {
  const { t } = useAppStore();

  if (softwareList.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="w-10 h-10 text-win-muted/60" />}
        title={t.catalog.noAppsFound}
        description={
          isFiltered
            ? t.catalog.noAppsFoundDesc
            : t.catalog.noAppsFound
        }
        action={
          isFiltered && onClearFilters ? (
            <Button size="sm" variant="secondary" onClick={onClearFilters}>
              {t.catalog.clearFilters}
            </Button>
          ) : undefined
        }
        className="my-8"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 pb-4">
      {softwareList.map((software) => (
        <SoftwareCard
          key={software.id}
          software={software}
          isSelected={selectedSoftwareIds.has(software.id)}
          onToggleSelect={onToggleSelect}
          onInstallSingle={onInstallSingle}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

import React from 'react';
import { CatalogToolbar } from '../components/catalog/CatalogToolbar';
import { SoftwareGrid } from '../components/catalog/SoftwareGrid';
import { useCatalog } from '../hooks/useCatalog';
import { useInstallation } from '../hooks/useInstallation';
import { CategoryType } from '../types/software';

const CATEGORIES: CategoryType[] = [
  'All',
  'Recommended',
  'Essential',
  'Office',
  'Browsers',
  'Utilities',
  'Media',
  'Graphics',
  'Development',
  'Communication',
  'Gaming',
  'Security',
];

export const SoftwareCatalogPage: React.FC = () => {
  const {
    softwareList,
    filteredSoftware,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSoftwareIds,
    toggleSelect,
  } = useCatalog();

  const { isQueueRunning } = useInstallation();

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const isFiltered = searchQuery.trim().length > 0 || selectedCategory !== 'All';

  return (
    <div className="space-y-2.5 pb-4 flex flex-col h-full">
      {/* Streamlined Unified Toolbar */}
      <CatalogToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={CATEGORIES}
        softwareList={softwareList}
        filteredCount={filteredSoftware.length}
      />

      {/* Software Grid */}
      <div className="flex-1">
        <SoftwareGrid
          softwareList={filteredSoftware}
          selectedSoftwareIds={selectedSoftwareIds}
          onToggleSelect={toggleSelect}
          onInstallSingle={() => {}}
          onClearFilters={handleClearFilters}
          isFiltered={isFiltered}
          disabled={isQueueRunning}
        />
      </div>
    </div>
  );
};

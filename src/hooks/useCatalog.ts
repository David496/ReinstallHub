import { useAppStore } from '../store/applicationStore';

export function useCatalog() {
  const {
    softwareList,
    filteredSoftware,
    isLoadingCatalog,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSoftwareIds,
    toggleSelect,
    selectAll,
    deselectAll,
    isAllSelected,
    selectedSoftwareList,
    isSoftwareBlocked,
  } = useAppStore();

  const isSelected = (id: string) => selectedSoftwareIds.has(id);

  return {
    softwareList,
    filteredSoftware,
    isLoadingCatalog,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSoftwareIds,
    selectedCount: selectedSoftwareIds.size,
    isSelected,
    toggleSelect,
    selectAll,
    deselectAll,
    isAllSelected,
    selectedSoftwareList,
    isSoftwareBlocked,
  };
}

import React from 'react';
import { CategoryType, Software } from '../../types/software';
import { useAppStore } from '../../store/applicationStore';

export interface CategoryTabsProps {
  categories: CategoryType[];
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  softwareList: Software[];
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  softwareList,
}) => {
  const { t } = useAppStore();

  const getCategoryCount = (category: CategoryType): number => {
    if (category === 'All') return softwareList.length;
    return softwareList.filter((s) =>
      s.category.some((c) => c.toLowerCase() === category.toLowerCase())
    ).length;
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = getCategoryCount(cat);
        const translatedLabel = t.categories[cat] || cat;

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all duration-150 border ${
              isSelected
                ? 'bg-win-primary text-white border-win-primary shadow-sm font-semibold'
                : 'bg-win-card border-win-border text-win-muted hover:text-win-text hover:bg-win-cardHover'
            }`}
          >
            <span>{translatedLabel}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected
                  ? 'bg-white/25 text-white'
                  : 'bg-black/5 dark:bg-black/30 text-win-muted'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

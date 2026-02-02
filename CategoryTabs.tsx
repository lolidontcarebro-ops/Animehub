import { cn } from '@/lib/utils';
import type { ContentCategory } from '@/types';

interface CategoryTabsProps {
  activeCategory: ContentCategory | 'all';
  onCategoryChange: (category: ContentCategory | 'all') => void;
}

const categories: { value: ContentCategory | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: 'bg-white/10 text-white' },
  { value: 'anime', label: 'Anime', color: 'badge-anime' },
  { value: 'manga', label: 'Manga', color: 'badge-manga' },
  { value: 'manhwa', label: 'Manhwa', color: 'badge-manhwa' },
  { value: 'manhua', label: 'Manhua', color: 'badge-manhua' },
  { value: 'light-novel', label: 'Light Novel', color: 'badge-light-novel' },
  { value: 'web-novel', label: 'Web Novel', color: 'badge-web-novel' },
];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 py-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap',
              activeCategory === category.value
                ? `${category.color} shadow-lg`
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

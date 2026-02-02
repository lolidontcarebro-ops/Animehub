import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, Filter, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentItem, ContentCategory } from '@/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<ContentItem[]>;
  onItemClick: (item: ContentItem) => void;
}

const recentSearches: string[] = ['Attack on Titan', 'Solo Leveling', 'One Piece'];

const filterOptions: { label: string; value: ContentCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Anime', value: 'anime' },
  { label: 'Manga', value: 'manga' },
  { label: 'Manhwa', value: 'manhwa' },
  { label: 'Manhua', value: 'manhua' },
];

export function SearchOverlay({ isOpen, onClose, onSearch, onItemClick }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ContentCategory | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounced search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await onSearch(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch]
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  // Filter results
  const filteredResults = activeFilter === 'all'
    ? results
    : results.filter((item) => item.category === activeFilter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl animate-fade-in-up">
      {/* Search Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime, manga, and more..."
            className="w-full h-12 pl-10 pr-10 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted-foreground/20"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 text-muted-foreground mr-2">
          <Filter className="w-4 h-4" />
          <span className="text-xs">Filter:</span>
        </div>
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200',
              activeFilter === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
        {!query ? (
          /* Recent Searches */
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setQuery(search)}
                  className="px-4 py-2 rounded-full bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        ) : isLoading ? (
          /* Loading State */
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted animate-pulse">
                <div className="w-16 h-20 rounded-lg bg-muted-foreground/20" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted-foreground/20" />
                  <div className="h-3 w-1/2 rounded bg-muted-foreground/20" />
                  <div className="h-3 w-1/4 rounded bg-muted-foreground/20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          /* Search Results */
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">
              {filteredResults.length} results found
            </p>
            {filteredResults.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick(item);
                  onClose();
                }}
                className={cn(
                  'w-full flex gap-3 p-3 rounded-xl bg-card hover:bg-card/80 transition-all duration-200 text-left opacity-0 animate-fade-in-up',
                )}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    'inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase mb-1',
                    item.category === 'anime' && 'badge-anime',
                    item.category === 'manga' && 'badge-manga',
                    item.category === 'manhwa' && 'badge-manhwa',
                    item.category === 'manhua' && 'badge-manhua',
                    item.category === 'light-novel' && 'badge-light-novel',
                    item.category === 'web-novel' && 'badge-web-novel',
                  )}>
                    {item.category}
                  </span>
                  <h4 className="text-sm font-medium text-foreground line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {item.summary}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-muted-foreground">
                      {item.sourceName}
                    </span>
                    {item.score && (
                      <span className="text-[10px] text-yellow-400">
                        ★ {item.score / 10}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

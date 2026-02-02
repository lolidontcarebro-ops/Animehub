import { useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/ui/Header';
import { BottomNav } from '@/components/ui/BottomNav';
import { CategoryTabs } from '@/components/ui/CategoryTabs';
import { ContentCard } from '@/components/ui/ContentCard';
import { SearchOverlay } from '@/components/ui/SearchOverlay';
import { DetailModal } from '@/components/ui/DetailModal';
import { LoadingGrid } from '@/components/ui/LoadingGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFavorites } from '@/hooks/useFavorites';
import {
  fetchAllContent,
  fetchTrendingAnime,
  fetchTrendingManga,
  fetchMangaDexManga,
  searchContent,
} from '@/lib/api';
import type { ContentItem, ContentCategory, TabType } from '@/types';
import { Flame, TrendingUp, Clock } from 'lucide-react';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeCategory, setActiveCategory] = useState<ContentCategory | 'all'>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const queryClient = useQueryClient();

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // Fetch all content
  const {
    data: allContent = [],
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ['allContent'],
    queryFn: fetchAllContent,
  });

  // Fetch trending anime
  const { data: trendingAnime = [] } = useQuery({
    queryKey: ['trendingAnime'],
    queryFn: fetchTrendingAnime,
  });

  // Fetch trending manga
  const { data: trendingManga = [] } = useQuery({
    queryKey: ['trendingManga'],
    queryFn: fetchTrendingManga,
  });

  // Fetch MangaDex manga
  const { data: mangaDexManga = [] } = useQuery({
    queryKey: ['mangaDexManga'],
    queryFn: fetchMangaDexManga,
  });

  // Combine trending content
  const trendingContent = [...trendingAnime, ...trendingManga].slice(0, 20);

  // Filter content based on active category
  const filteredContent = allContent.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries();
    setLastUpdated(new Date());
  }, [queryClient]);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [handleRefresh]);

  // Get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Discover';
      case 'trending':
        return 'Trending';
      case 'categories':
        return 'Categories';
      case 'favorites':
        return 'Favorites';
      default:
        return 'Discover';
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'home') {
      if (isLoadingAll) {
        return <LoadingGrid count={8} />;
      }

      if (errorAll) {
        return (
          <EmptyState
            type="error"
            action={{ label: 'Try Again', onClick: () => refetchAll() }}
          />
        );
      }

      if (filteredContent.length === 0) {
        return <EmptyState type="default" />;
      }

      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 pb-24">
          {filteredContent.map((item, index) => (
            <ContentCard
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
              onClick={setSelectedItem}
              index={index}
            />
          ))}
        </div>
      );
    }

    if (activeTab === 'trending') {
      if (trendingContent.length === 0) {
        return <LoadingGrid count={6} />;
      }

      return (
        <div className="p-4 pb-24 space-y-6">
          {/* Trending Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20">
              <Flame className="w-6 h-6 text-violet-400 mb-2" />
              <p className="text-2xl font-bold text-white">{trendingAnime.length}</p>
              <p className="text-xs text-muted-foreground">Trending Anime</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/20">
              <TrendingUp className="w-6 h-6 text-pink-400 mb-2" />
              <p className="text-2xl font-bold text-white">{trendingManga.length}</p>
              <p className="text-xs text-muted-foreground">Trending Manga</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20">
              <Clock className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-2xl font-bold text-white">Live</p>
              <p className="text-xs text-muted-foreground">Updates</p>
            </div>
          </div>

          {/* Trending Grid */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Hot Right Now
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {trendingContent.slice(0, 12).map((item, index) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={setSelectedItem}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'categories') {
      return (
        <div className="p-4 pb-24 space-y-6">
          {/* Category Sections */}
          {mangaDexManga.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">From MangaDex</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {mangaDexManga.slice(0, 8).map((item, index) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={setSelectedItem}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {trendingManga.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Popular Manga</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {trendingManga.slice(0, 8).map((item, index) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={setSelectedItem}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {trendingAnime.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Popular Anime</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {trendingAnime.slice(0, 8).map((item, index) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={setSelectedItem}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'favorites') {
      if (favorites.length === 0) {
        return (
          <EmptyState
            type="favorites"
            action={{ label: 'Browse Content', onClick: () => setActiveTab('home') }}
          />
        );
      }

      return (
        <div className="p-4 pb-24">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {favorites.length} {favorites.length === 1 ? 'Item' : 'Items'}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {favorites.map((item, index) => (
              <ContentCard
                key={item.id}
                item={item}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                onClick={setSelectedItem}
                index={index}
              />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        title={getPageTitle()}
        onSearchClick={() => setIsSearchOpen(true)}
        onRefreshClick={handleRefresh}
        lastUpdated={lastUpdated}
      />

      {/* Main Content */}
      <main className="pt-14">
        {/* Category Tabs - Only show on home tab */}
        {activeTab === 'home' && (
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}

        {/* Content */}
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={searchContent}
        onItemClick={setSelectedItem}
      />

      {/* Detail Modal */}
      <DetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        isFavorite={selectedItem ? isFavorite(selectedItem.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;

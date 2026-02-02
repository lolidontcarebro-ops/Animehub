export type ContentCategory = 'anime' | 'manga' | 'manhwa' | 'manhua' | 'light-novel' | 'web-novel';
export type ContentStatus = 'ongoing' | 'upcoming' | 'finished';

export interface ContentItem {
  id: string;
  title: string;
  alternativeTitles?: string[];
  summary: string;
  category: ContentCategory;
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  releaseDate: string;
  updatedAt: string;
  status: ContentStatus;
  popularity?: number;
  score?: number;
  isTrending?: boolean;
  episodes?: number;
  chapters?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  tags: string[];
}

export interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export interface FilterOptions {
  type: ContentCategory | 'all';
  status: ContentStatus | 'all';
  sortBy: 'latest' | 'popular' | 'trending';
  dateRange: 'all' | 'today' | 'week' | 'month';
}

export interface FavoriteItem extends ContentItem {
  addedAt: string;
}

export type TabType = 'home' | 'trending' | 'categories' | 'favorites' | 'settings';

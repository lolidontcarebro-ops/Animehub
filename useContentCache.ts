import { useState, useEffect, useCallback } from 'react';
import type { ContentItem } from '@/types';

interface CacheData {
  items: ContentItem[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'anime-news-hub-cache';

export function useContentCache() {
  const [cache, setCache] = useState<Record<string, CacheData>>({});

  // Load cache from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY);
      if (stored) {
        setCache(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load cache:', error);
    }
  }, []);

  // Save cache to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  }, [cache]);

  const getCached = useCallback(
    (key: string): ContentItem[] | null => {
      const data = cache[key];
      if (!data) return null;
      
      const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
      if (isExpired) {
        // Remove expired cache
        setCache((prev) => {
          const newCache = { ...prev };
          delete newCache[key];
          return newCache;
        });
        return null;
      }
      
      return data.items;
    },
    [cache]
  );

  const setCached = useCallback((key: string, items: ContentItem[]) => {
    setCache((prev) => ({
      ...prev,
      [key]: {
        items,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const clearCache = useCallback(() => {
    setCache({});
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, []);

  return {
    getCached,
    setCached,
    clearCache,
  };
}

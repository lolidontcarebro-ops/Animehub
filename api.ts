import type { ContentItem, ContentCategory, NewsItem } from '@/types';

// AniList GraphQL API
const ANILIST_API = 'https://graphql.anilist.co';

// MangaDex API
const MANGADEX_API = 'https://api.mangadex.org';

// Jikan API (MyAnimeList wrapper) - Available for future use
// const JIKAN_API = 'https://api.jikan.moe/v4';

// GraphQL queries for AniList
const TRENDING_ANIME_QUERY = `
  query {
    Page(page: 1, perPage: 20) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          medium
        }
        siteUrl
        status
        episodes
        popularity
        averageScore
        trending
        updatedAt
      }
    }
  }
`;

const TRENDING_MANGA_QUERY = `
  query {
    Page(page: 1, perPage: 20) {
      media(type: MANGA, sort: TRENDING_DESC) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          medium
        }
        siteUrl
        status
        chapters
        popularity
        averageScore
        trending
        updatedAt
      }
    }
  }
`;

const POPULAR_ANIME_QUERY = `
  query {
    Page(page: 1, perPage: 20) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          medium
        }
        siteUrl
        status
        episodes
        popularity
        averageScore
        trending
        updatedAt
      }
    }
  }
`;

const SEASONAL_ANIME_QUERY = `
  query($season: MediaSeason, $seasonYear: Int) {
    Page(page: 1, perPage: 20) {
      media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          medium
        }
        siteUrl
        status
        episodes
        popularity
        averageScore
        trending
        updatedAt
        startDate {
          year
          month
          day
        }
      }
    }
  }
`;

// Helper to map AniList status to our status
function mapStatus(status: string): 'ongoing' | 'upcoming' | 'finished' {
  switch (status) {
    case 'RELEASING':
      return 'ongoing';
    case 'NOT_YET_RELEASED':
      return 'upcoming';
    case 'FINISHED':
    case 'CANCELLED':
      return 'finished';
    default:
      return 'ongoing';
  }
}

// Helper to format description
function formatDescription(desc: string | null): string {
  if (!desc) return 'No description available.';
  // Remove HTML tags and limit to 150 chars
  const clean = desc.replace(/<[^>]*>/g, '').substring(0, 150);
  return clean.length >= 150 ? clean + '...' : clean;
}

// Fetch from AniList
async function fetchAniList(query: string, variables = {}): Promise<any> {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

// Fetch trending anime from AniList
export async function fetchTrendingAnime(): Promise<ContentItem[]> {
  const data = await fetchAniList(TRENDING_ANIME_QUERY);
  
  return data.Page.media.map((item: any) => ({
    id: `anime-${item.id}`,
    title: item.title.english || item.title.romaji || item.title.native,
    alternativeTitles: [item.title.romaji, item.title.native].filter(Boolean),
    summary: formatDescription(item.description),
    category: 'anime' as ContentCategory,
    imageUrl: item.coverImage.large || item.coverImage.medium,
    sourceUrl: item.siteUrl,
    sourceName: 'AniList',
    releaseDate: item.startDate ? `${item.startDate.year}-${item.startDate.month || '??'}-${item.startDate.day || '??'}` : 'Unknown',
    updatedAt: item.updatedAt ? new Date(item.updatedAt * 1000).toISOString() : new Date().toISOString(),
    status: mapStatus(item.status),
    popularity: item.popularity,
    score: item.averageScore,
    isTrending: item.trending > 50,
    episodes: item.episodes,
  }));
}

// Fetch trending manga from AniList
export async function fetchTrendingManga(): Promise<ContentItem[]> {
  const data = await fetchAniList(TRENDING_MANGA_QUERY);
  
  return data.Page.media.map((item: any) => ({
    id: `manga-${item.id}`,
    title: item.title.english || item.title.romaji || item.title.native,
    alternativeTitles: [item.title.romaji, item.title.native].filter(Boolean),
    summary: formatDescription(item.description),
    category: 'manga' as ContentCategory,
    imageUrl: item.coverImage.large || item.coverImage.medium,
    sourceUrl: item.siteUrl,
    sourceName: 'AniList',
    releaseDate: item.startDate ? `${item.startDate.year}-${item.startDate.month || '??'}-${item.startDate.day || '??'}` : 'Unknown',
    updatedAt: item.updatedAt ? new Date(item.updatedAt * 1000).toISOString() : new Date().toISOString(),
    status: mapStatus(item.status),
    popularity: item.popularity,
    score: item.averageScore,
    isTrending: item.trending > 50,
    chapters: item.chapters,
  }));
}

// Fetch popular anime from AniList
export async function fetchPopularAnime(): Promise<ContentItem[]> {
  const data = await fetchAniList(POPULAR_ANIME_QUERY);
  
  return data.Page.media.map((item: any) => ({
    id: `anime-${item.id}`,
    title: item.title.english || item.title.romaji || item.title.native,
    alternativeTitles: [item.title.romaji, item.title.native].filter(Boolean),
    summary: formatDescription(item.description),
    category: 'anime' as ContentCategory,
    imageUrl: item.coverImage.large || item.coverImage.medium,
    sourceUrl: item.siteUrl,
    sourceName: 'AniList',
    releaseDate: item.startDate ? `${item.startDate.year}-${item.startDate.month || '??'}-${item.startDate.day || '??'}` : 'Unknown',
    updatedAt: item.updatedAt ? new Date(item.updatedAt * 1000).toISOString() : new Date().toISOString(),
    status: mapStatus(item.status),
    popularity: item.popularity,
    score: item.averageScore,
    isTrending: item.trending > 50,
    episodes: item.episodes,
  }));
}

// Fetch seasonal anime
export async function fetchSeasonalAnime(): Promise<ContentItem[]> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  let season: string;
  if (month >= 1 && month <= 3) season = 'WINTER';
  else if (month >= 4 && month <= 6) season = 'SPRING';
  else if (month >= 7 && month <= 9) season = 'SUMMER';
  else season = 'FALL';
  
  const data = await fetchAniList(SEASONAL_ANIME_QUERY, { season, seasonYear: year });
  
  return data.Page.media.map((item: any) => ({
    id: `anime-${item.id}`,
    title: item.title.english || item.title.romaji || item.title.native,
    alternativeTitles: [item.title.romaji, item.title.native].filter(Boolean),
    summary: formatDescription(item.description),
    category: 'anime' as ContentCategory,
    imageUrl: item.coverImage.large || item.coverImage.medium,
    sourceUrl: item.siteUrl,
    sourceName: 'AniList',
    releaseDate: item.startDate ? `${item.startDate.year}-${item.startDate.month || '??'}-${item.startDate.day || '??'}` : 'Unknown',
    updatedAt: item.updatedAt ? new Date(item.updatedAt * 1000).toISOString() : new Date().toISOString(),
    status: mapStatus(item.status),
    popularity: item.popularity,
    score: item.averageScore,
    isTrending: item.trending > 50,
    episodes: item.episodes,
  }));
}

// Fetch manga from MangaDex
export async function fetchMangaDexManga(): Promise<ContentItem[]> {
  try {
    const response = await fetch(
      `${MANGADEX_API}/manga?limit=20&order[followedCount]=desc&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data.map((item: any) => {
      const coverArt = item.relationships?.find((r: any) => r.type === 'cover_art');
      const coverFileName = coverArt?.attributes?.fileName;
      const coverUrl = coverFileName 
        ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}`
        : 'https://via.placeholder.com/200x300/1a1a25/71717a?text=No+Cover';
      
      const attributes = item.attributes;
      const title = attributes.title.en || Object.values(attributes.title)[0] || 'Unknown Title';
      const description = attributes.description?.en || Object.values(attributes.description || {})[0] || '';
      
      // Determine category based on originalLanguage
      let category: ContentCategory = 'manga';
      if (attributes.originalLanguage === 'ko') category = 'manhwa';
      else if (attributes.originalLanguage === 'zh' || attributes.originalLanguage === 'zh-hk') category = 'manhua';
      
      return {
        id: `mangadex-${item.id}`,
        title,
        summary: formatDescription(description),
        category,
        imageUrl: coverUrl,
        sourceUrl: `https://mangadex.org/title/${item.id}`,
        sourceName: 'MangaDex',
        releaseDate: attributes.year?.toString() || 'Unknown',
        updatedAt: attributes.updatedAt || new Date().toISOString(),
        status: attributes.status === 'ongoing' ? 'ongoing' : attributes.status === 'completed' ? 'finished' : 'ongoing',
        popularity: attributes.followCount,
        isTrending: true,
      };
    });
  } catch (error) {
    console.error('MangaDex fetch error:', error);
    return [];
  }
}

// Search across all sources
export async function searchContent(query: string): Promise<ContentItem[]> {
  if (!query.trim()) return [];
  
  try {
    const searchQuery = `
      query($search: String) {
        Page(page: 1, perPage: 20) {
          media(search: $search, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              large
              medium
            }
            siteUrl
            status
            episodes
            chapters
            popularity
            averageScore
            trending
            updatedAt
            type
            startDate {
              year
              month
              day
            }
          }
        }
      }
    `;
    
    const data = await fetchAniList(searchQuery, { search: query });
    
    return data.Page.media.map((item: any) => ({
      id: `${item.type.toLowerCase()}-${item.id}`,
      title: item.title.english || item.title.romaji || item.title.native,
      alternativeTitles: [item.title.romaji, item.title.native].filter(Boolean),
      summary: formatDescription(item.description),
      category: item.type === 'ANIME' ? 'anime' : 'manga' as ContentCategory,
      imageUrl: item.coverImage.large || item.coverImage.medium,
      sourceUrl: item.siteUrl,
      sourceName: 'AniList',
      releaseDate: item.startDate ? `${item.startDate.year}-${item.startDate.month || '??'}-${item.startDate.day || '??'}` : 'Unknown',
      updatedAt: item.updatedAt ? new Date(item.updatedAt * 1000).toISOString() : new Date().toISOString(),
      status: mapStatus(item.status),
      popularity: item.popularity,
      score: item.averageScore,
      isTrending: item.trending > 50,
      episodes: item.episodes,
      chapters: item.chapters,
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Fetch all content combined
export async function fetchAllContent(): Promise<ContentItem[]> {
  try {
    const [trendingAnime, trendingManga, mangaDexManga] = await Promise.all([
      fetchTrendingAnime(),
      fetchTrendingManga(),
      fetchMangaDexManga(),
    ]);
    
    // Combine and deduplicate by title
    const allContent = [...trendingAnime, ...trendingManga, ...mangaDexManga];
    const seen = new Set();
    return allContent.filter((item) => {
      if (seen.has(item.title)) return false;
      seen.add(item.title);
      return true;
    });
  } catch (error) {
    console.error('Fetch all content error:', error);
    return [];
  }
}

// Fetch news from multiple sources (simulated for demo)
export async function fetchNews(): Promise<NewsItem[]> {
  // In a real implementation, this would fetch from actual news APIs
  // For now, we'll return mock data that looks realistic
  const mockNews: NewsItem[] = [
    {
      id: 'news-1',
      title: 'New Season of Attack on Titan Final Arc Announced',
      excerpt: 'The highly anticipated final arc will continue with new episodes premiering this fall...',
      imageUrl: 'https://via.placeholder.com/400x200/1a1a25/8b5cf6?text=AOT+News',
      sourceUrl: 'https://crunchyroll.com/news',
      sourceName: 'Crunchyroll News',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      tags: ['anime', 'announcement'],
    },
    {
      id: 'news-2',
      title: 'Solo Leveling Anime Breaks Viewership Records',
      excerpt: 'The adaptation of the popular web novel has become the most-watched anime of the season...',
      imageUrl: 'https://via.placeholder.com/400x200/1a1a25/ec4899?text=Solo+Leveling',
      sourceUrl: 'https://animenewsnetwork.com',
      sourceName: 'Anime News Network',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      tags: ['anime', 'trending'],
    },
    {
      id: 'news-3',
      title: 'One Piece Manga Reaches New Milestone',
      excerpt: 'Eiichiro Oda\'s epic series continues to break records with over 500 million copies sold...',
      imageUrl: 'https://via.placeholder.com/400x200/1a1a25/06b6d4?text=One+Piece',
      sourceUrl: 'https://myanimelist.net/news',
      sourceName: 'MyAnimeList News',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      tags: ['manga', 'milestone'],
    },
  ];
  
  return mockNews;
}

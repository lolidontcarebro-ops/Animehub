import { useState } from 'react';
import { Heart, ExternalLink, TrendingUp } from 'lucide-react';
import type { ContentItem } from '@/types';
import { formatDistanceToNow } from '@/lib/utils';

interface ContentCardProps {
  item: ContentItem;
  isFavorite: boolean;
  onToggleFavorite: (item: ContentItem) => void;
  onClick?: (item: ContentItem) => void;
  index?: number;
}

const categoryColors: Record<string, string> = {
  anime: 'badge-anime',
  manga: 'badge-manga',
  manhwa: 'badge-manhwa',
  manhua: 'badge-manhua',
  'light-novel': 'badge-light-novel',
  'web-novel': 'badge-web-novel',
};

const categoryLabels: Record<string, string> = {
  anime: 'Anime',
  manga: 'Manga',
  manhwa: 'Manhwa',
  manhua: 'Manhua',
  'light-novel': 'Light Novel',
  'web-novel': 'Web Novel',
};

export function ContentCard({
  item,
  isFavorite,
  onToggleFavorite,
  onClick,
  index = 0,
}: ContentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(item);
  };

  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-card cursor-pointer card-hover opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
      onClick={() => onClick?.(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ aspectRatio: '1/1.5' }}
    >
      {/* Image Container */}
      <div className="relative h-[70%] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 image-placeholder animate-shimmer" />
        )}
        <img
          src={item.imageUrl}
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide ${categoryColors[item.category]}`}>
          {categoryLabels[item.category]}
        </div>
        
        {/* Trending Badge */}
        {item.isTrending && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            HOT
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute bottom-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isFavorite
              ? 'bg-pink-500 text-white'
              : 'bg-black/50 text-white/70 hover:bg-black/70'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isFavorite ? 'fill-current scale-110' : ''
            }`}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="h-[30%] p-3 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
            {item.title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="truncate max-w-[80px]">{item.sourceName}</span>
          </div>
          
          <button
            onClick={handleSourceClick}
            className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Open source"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(item.updatedAt)}
          </span>
          {item.score && (
            <span className="text-[10px] font-medium text-yellow-400">
              ★ {item.score / 10}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

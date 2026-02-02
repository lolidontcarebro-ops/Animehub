import { X, ExternalLink, Heart, TrendingUp, Star, Calendar, BookOpen } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { ShareButton } from './ShareButton';
import type { ContentItem } from '@/types';

interface DetailModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (item: ContentItem) => void;
}

const categoryLabels: Record<string, string> = {
  anime: 'Anime',
  manga: 'Manga',
  manhwa: 'Manhwa',
  manhua: 'Manhua',
  'light-novel': 'Light Novel',
  'web-novel': 'Web Novel',
};

export function DetailModal({
  item,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}: DetailModalProps) {
  if (!isOpen || !item) return null;

  const handleSourceClick = () => {
    window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
        style={{ animationDuration: '200ms' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] bg-card rounded-t-3xl sm:rounded-3xl overflow-hidden animate-fade-in-up"
        style={{ animationDelay: '50ms' }}
      >
        {/* Hero Image */}
        <div className="relative h-48 sm:h-64">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Trending Badge */}
          {item.isTrending && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-medium flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Trending Now
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-24 -mt-16 relative">
          {/* Title Section */}
          <div className="mb-4">
            <span className={cn(
              'inline-block px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide mb-2',
              item.category === 'anime' && 'badge-anime',
              item.category === 'manga' && 'badge-manga',
              item.category === 'manhwa' && 'badge-manhwa',
              item.category === 'manhua' && 'badge-manhua',
              item.category === 'light-novel' && 'badge-light-novel',
              item.category === 'web-novel' && 'badge-web-novel',
            )}>
              {categoryLabels[item.category]}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {item.title}
            </h2>
            {item.alternativeTitles && item.alternativeTitles.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Also known as: {item.alternativeTitles.join(', ')}
              </p>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-3 mb-4">
            {item.score && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{item.score / 10}</span>
              </div>
            )}
            {item.popularity && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {item.popularity.toLocaleString()} fans
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(item.releaseDate)}</span>
            </div>
            {(item.episodes || item.chapters) && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">
                  {item.episodes ? `${item.episodes} eps` : `${item.chapters} chs`}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">Synopsis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.summary}
            </p>
          </div>

          {/* Source Info */}
          <div className="p-4 rounded-xl bg-muted mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Data Source</p>
                <p className="text-sm font-medium text-foreground">{item.sourceName}</p>
              </div>
              <button
                onClick={handleSourceClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Source
              </button>
            </div>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-muted-foreground text-center">
            Last updated: {formatDate(item.updatedAt)}
          </p>
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
          <div className="flex gap-3">
            <button
              onClick={() => onToggleFavorite(item)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200',
                isFavorite
                  ? 'bg-pink-500 text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              )}
            >
              <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </button>
            <ShareButton item={item} variant="button" />
          </div>
        </div>
      </div>
    </div>
  );
}

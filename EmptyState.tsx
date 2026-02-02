import { Search, Heart, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'search' | 'favorites' | 'trending' | 'error' | 'default';
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  search: Search,
  favorites: Heart,
  trending: TrendingUp,
  error: AlertCircle,
  default: Search,
};

const defaultMessages: Record<string, { title: string; message: string }> = {
  search: {
    title: 'No results found',
    message: 'Try adjusting your search or filters',
  },
  favorites: {
    title: 'No favorites yet',
    message: 'Save items you love to find them here',
  },
  trending: {
    title: 'No trending items',
    message: 'Check back later for trending content',
  },
  error: {
    title: 'Something went wrong',
    message: 'Unable to load content. Please try again.',
  },
  default: {
    title: 'Nothing here',
    message: 'There are no items to display',
  },
};

export function EmptyState({ type, title, message, action }: EmptyStateProps) {
  const Icon = icons[type];
  const defaultContent = defaultMessages[type];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      'animate-fade-in-up'
    )}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {title || defaultContent.title}
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {message || defaultContent.message}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors animate-pulse-glow"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

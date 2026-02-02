import { Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  onSearchClick: () => void;
  onRefreshClick: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date;
}

export function Header({
  title,
  onSearchClick,
  onRefreshClick,
  isRefreshing = false,
  lastUpdated,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gradient">AnimeHub</h1>
        </div>
        
        {/* Center Title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button
            onClick={onRefreshClick}
            disabled={isRefreshing}
            className={cn(
              'p-2 rounded-full hover:bg-muted transition-colors',
              isRefreshing && 'cursor-not-allowed'
            )}
            aria-label="Refresh"
          >
            <RefreshCw
              className={cn(
                'w-5 h-5 text-muted-foreground',
                isRefreshing && 'animate-spin-slow'
              )}
            />
          </button>
        </div>
      </div>
      
      {/* Last Updated Indicator */}
      {lastUpdated && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <span className="text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded-t-md">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      )}
    </header>
  );
}

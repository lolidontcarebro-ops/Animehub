import { Home, Flame, LayoutGrid, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TabType } from '@/types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems: { id: TabType; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'trending', icon: Flame, label: 'Trending' },
  { id: 'categories', icon: LayoutGrid, label: 'Categories' },
  { id: 'favorites', icon: Heart, label: 'Favorites' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around h-16 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-all duration-300',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div
                className={cn(
                  'relative p-2 rounded-xl transition-all duration-300',
                  isActive && 'bg-primary/10'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-300',
                    isActive && 'scale-110'
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] mt-0.5 transition-all duration-300',
                  isActive ? 'font-medium' : 'font-normal'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import { useState } from 'react';
import { Share2, Link, Check, Twitter, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentItem } from '@/types';

interface ShareButtonProps {
  item: ContentItem;
  variant?: 'icon' | 'button';
  className?: string;
}

export function ShareButton({ item, variant = 'icon', className }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(item.sourceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareTwitter = () => {
    const text = `Check out ${item.title} on Anime News Hub!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(item.sourceUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.sourceUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.summary,
          url: item.sourceUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={cn(
          variant === 'icon'
            ? 'p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors'
            : 'flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors',
          className
        )}
      >
        <Share2 className="w-5 h-5" />
        {variant === 'button' && <span>Share</span>}
      </button>

      {/* Share Menu (for browsers without native share) */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 bottom-full mb-2 p-2 rounded-xl bg-card border border-border shadow-lg z-50 min-w-[160px] animate-fade-in-up">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Link className="w-4 h-4" />
              )}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleShareTwitter}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <Twitter className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Twitter</span>
            </button>
            <button
              onClick={handleShareFacebook}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Facebook</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

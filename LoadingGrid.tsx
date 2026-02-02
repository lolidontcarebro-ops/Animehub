export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden bg-card animate-pulse"
          style={{ aspectRatio: '1/1.5' }}
        >
          {/* Image placeholder */}
          <div className="h-[70%] bg-muted" />
          
          {/* Content placeholder */}
          <div className="h-[30%] p-3 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="flex justify-between">
              <div className="h-3 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 6, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-14 w-full" />
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-border/60 bg-card p-3">
          <div className="skeleton h-28 w-full rounded-2xl" />
          <div className="skeleton mt-4 h-3 w-16" />
          <div className="skeleton mt-3 h-5 w-2/3" />
          <div className="skeleton mt-2 h-3 w-full" />
          <div className="skeleton mt-1 h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

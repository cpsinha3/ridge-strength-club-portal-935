export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 animate-pulse">
      <div className="h-4 bg-carbon-lighter rounded w-2/3 mb-3" />
      <div className="h-3 bg-carbon-lighter rounded w-1/2 mb-2" />
      <div className="h-3 bg-carbon-lighter rounded w-1/3" />
    </div>
  );
}

export function ScheduleSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-10 w-20 bg-carbon-lighter rounded-md animate-pulse flex-shrink-0" />
        ))}
      </div>
      <div className="grid gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-8 bg-carbon-lighter rounded w-48 animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

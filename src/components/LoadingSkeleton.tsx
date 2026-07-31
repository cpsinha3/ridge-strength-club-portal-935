export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 animate-pulse">
      <div className="h-4 bg-carbon-lighter rounded w-2/3 mb-3" />
      <div className="h-3 bg-carbon-lighter rounded w-1/2 mb-2" />
      <div className="h-3 bg-carbon-lighter rounded w-1/3" />
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

export function Skeleton({ className = '' }) {
  return <div className={`nz-skeleton ${className}`} aria-hidden="true" />;
}

export function CourseCardSkeleton() {
  return (
    <div className="nz-card" aria-hidden="true">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <Skeleton className="mt-5 h-4 w-2/3" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function InstitutionCardSkeleton() {
  return (
    <div className="nz-card flex items-center gap-4" aria-hidden="true">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-2.5 h-3 w-3/4" />
      </div>
    </div>
  );
}

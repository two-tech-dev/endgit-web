import { Skeleton } from "@/components/Skeleton";

function PluginCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/80">
      <div className="flex flex-col gap-2 p-6 pb-4">
        <div className="flex items-center gap-2">
          <Skeleton width={28} height={28} borderRadius="0.375rem" />
          <Skeleton width="40%" height="1.25rem" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton width="3rem" height="1.25rem" borderRadius="9999px" />
          <Skeleton width="4.5rem" height="1.25rem" borderRadius="9999px" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-6 pb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:gap-4 sm:text-sm">
          <Skeleton width="5rem" height="0.75rem" />
          <Skeleton width="5rem" height="0.75rem" />
          <Skeleton width="2.5rem" height="0.75rem" />
          <Skeleton width="3.5rem" height="0.75rem" />
        </div>
        <Skeleton width="2.5rem" height="0.875rem" />
      </div>
    </div>
  );
}

export default function AuthorPluginsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Skeleton width="7rem" height="2rem" />
          <Skeleton width="8rem" height="2rem" />
        </div>
        <div className="mt-1">
          <Skeleton width="16rem" height="0.875rem" />
        </div>
      </div>

      <div className="grid min-w-0 auto-rows-min content-start gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <PluginCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

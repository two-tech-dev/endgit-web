import { Skeleton } from "@/components/Skeleton";

function PluginCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
      <div className="flex flex-wrap items-start gap-4 pb-2">
        <Skeleton width={64} height={64} borderRadius="rounded-md" />
        <div className="min-w-0 flex-1">
          <Skeleton width="60%" height="1.25rem" style={{ marginBottom: "0.5rem" }} />
          <Skeleton width="100%" height="0.875rem" />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border bg-muted/50 px-4 py-3">
        <Skeleton width="5rem" height="0.75rem" />
        <Skeleton width="4rem" height="0.75rem" />
      </div>
    </div>
  );
}

export default function TopPluginsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8">
        <Skeleton width="8rem" height="0.875rem" style={{ marginBottom: "1rem" }} />
        <div className="flex items-center gap-3">
          <Skeleton width={32} height={32} />
          <Skeleton width="10rem" height="2rem" />
        </div>
        <Skeleton width="18rem" height="0.875rem" style={{ marginTop: "0.5rem" }} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <PluginCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

import { Skeleton, SkeletonCard } from "@/components/Skeleton";

function PluginCardSkeleton() {
  return (
    <SkeletonCard className="p-0 flex flex-col overflow-hidden">
      <div className="p-4 flex gap-4 items-center">
        <Skeleton width={56} height={56} borderRadius="var(--radius-sm)" />
        <div className="flex-1 min-w-0">
          <Skeleton width="60%" height="1.25rem" className="mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton width="3rem" height="0.8125rem" />
            <Skeleton width="5rem" height="0.8125rem" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Skeleton width="3rem" height="0.75rem" />
          <Skeleton width="2rem" height="0.75rem" />
        </div>
      </div>
    </SkeletonCard>
  );
}

export default function PluginsLoading() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <Skeleton width="8rem" height="2.5rem" className="mb-1.5" />
          <Skeleton width="12rem" height="0.875rem" />
        </div>
        <Skeleton
          width="300px"
          height="2.5rem"
          borderRadius="var(--radius-sm)"
          className="hidden lg:block"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:flex flex-col gap-6 w-[250px] shrink-0">
          <SkeletonCard className="p-4">
            <Skeleton width="5rem" height="0.875rem" className="mb-3" />
            <Skeleton
              width="100%"
              height="2.5rem"
              borderRadius="var(--radius-sm)"
            />
          </SkeletonCard>
          <SkeletonCard className="p-4">
            <Skeleton width="4rem" height="0.875rem" className="mb-3" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton
                  key={i}
                  width="100%"
                  height="1.75rem"
                  borderRadius="var(--radius-sm)"
                />
              ))}
            </div>
          </SkeletonCard>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 align-content-start">
            {Array.from({ length: 6 }, (_, i) => (
              <PluginCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

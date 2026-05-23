import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function PluginDetailLoading() {
  return (
    <div className="container py-8">
      <SkeletonCard className="p-6 mb-6">
        <div className="grid lg:grid-cols-[1fr_auto] justify-between items-start gap-4">
          <div className="plugin-header-inner flex flex-col sm:flex-row gap-4 min-w-0 w-full">
            <Skeleton width={72} height={72} borderRadius="var(--radius-lg)" className="shrink-0" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Skeleton width="14rem" height="2rem" />
                <Skeleton
                  width="5rem"
                  height="1.25rem"
                  borderRadius="var(--radius-full)"
                />
              </div>
              <Skeleton width="10rem" height="0.875rem" className="mb-2" />
              <Skeleton width="20rem" height="0.875rem" />
            </div>
          </div>

          <div className="plugin-header-actions flex flex-col gap-2 shrink-0 items-start sm:items-end w-full sm:w-auto">
            <Skeleton
              width="10rem"
              height="2.5rem"
              borderRadius="var(--radius-md)"
              className="w-full sm:w-auto"
            />
            <div className="flex flex-wrap gap-6">
              <Skeleton width="4rem" height="1rem" />
              <Skeleton width="5rem" height="1rem" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      <div className="plugin-layout grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">
        <div className="plugin-main-content min-w-0 grid gap-6">
          <SkeletonCard className="p-5">
            <Skeleton width="10rem" height="1rem" className="mb-3" />
            <Skeleton
              width="100%"
              height="2.75rem"
              borderRadius="var(--radius-md)"
            />
          </SkeletonCard>

          <div className="plugin-description-panel border border-border rounded-md bg-surface-secondary overflow-hidden min-w-0 max-w-full">
            <div className="plugin-description-header flex items-center justify-between gap-4 px-4 py-[10px] border-b border-border">
              <Skeleton width="8rem" height="0.875rem" />
              <Skeleton width="3rem" height="0.875rem" />
            </div>
            <div className="p-3">
              <Skeleton
                width="100%"
                height="12rem"
                borderRadius="var(--radius-sm)"
              />
            </div>
          </div>

          <SkeletonCard className="p-5">
            <Skeleton width="10rem" height="1rem" className="mb-4" />
            <Skeleton
              width="100%"
              height="10rem"
              borderRadius="var(--radius-sm)"
            />
          </SkeletonCard>

          <SkeletonCard className="p-5">
            <Skeleton width="8rem" height="1rem" className="mb-4" />
            <div className="grid gap-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton circle width={32} height={32} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Skeleton width="40%" height="0.875rem" className="mb-1" />
                    <Skeleton width="100%" height="0.75rem" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        <aside className="plugin-sidebar w-full xl:max-w-[280px] grid gap-6 overflow-hidden">
          <SkeletonCard className="p-5 bg-surface-secondary">
            <div className="grid grid-cols-[1fr_auto] items-center">
              <Skeleton width="6rem" height="1rem" />
              <Skeleton circle width={48} height={48} />
            </div>
          </SkeletonCard>

          <SkeletonCard className="p-5">
            <Skeleton width="4rem" height="1rem" className="mb-4" />
            <div className="grid gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto]">
                  <Skeleton width="5rem" height="0.875rem" />
                  <Skeleton width="5rem" height="0.875rem" />
                </div>
              ))}
            </div>
          </SkeletonCard>

          <SkeletonCard className="p-5">
            <Skeleton width="8rem" height="1rem" className="mb-3" />
            <div className="grid gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                >
                  <Skeleton circle width={32} height={32} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Skeleton width="7rem" height="0.875rem" className="mb-1" />
                    <Skeleton width="5rem" height="0.625rem" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </aside>
      </div>
    </div>
  );
}

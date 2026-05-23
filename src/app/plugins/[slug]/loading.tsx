import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function PluginDetailLoading() {
  return (
    <div className="container !py-6 lg:!py-8">
      <SkeletonCard className="p-4 lg:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] justify-between items-start gap-4 lg:flex-nowrap">
          {/* Header left */}
          <div className="plugin-header-inner grid grid-cols-[auto_1fr] gap-4 min-w-0 flex-1">
            <Skeleton width={72} height={72} borderRadius="var(--radius-lg)" className="shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="heading-2 m-0 flex flex-wrap items-center gap-3">
                <Skeleton width="10rem" height="1.75rem" />
                <Skeleton
                  width="4.5rem"
                  height="1.25rem"
                  borderRadius="var(--radius-full)"
                />
              </h1>
              <p className="text-text-muted mt-1 flex flex-wrap items-center gap-1.5">
                <Skeleton width="6rem" height="0.875rem" />
              </p>
              <p className="text-text-secondary mt-2 max-w-[600px] leading-relaxed">
                <Skeleton width="14rem" height="0.875rem" />
              </p>
            </div>
          </div>

          {/* Header right / actions */}
          <div className="plugin-header-actions grid gap-2 shrink-0">
            <div className="grid gap-3 w-full">
              <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                <Skeleton
                  width="100%"
                  height="2.5rem"
                  borderRadius="var(--radius-md)"
                  className="w-full sm:w-28"
                />
                <Skeleton
                  width="100%"
                  height="2.5rem"
                  borderRadius="var(--radius-md)"
                  className="w-full sm:w-32"
                />
              </div>
              <div className="version-info-text text-xs text-text-muted flex flex-wrap gap-x-3.5 gap-y-1 justify-center md:justify-end items-center w-full">
                <Skeleton width="3rem" height="0.875rem" />
                <Skeleton width="3.5rem" height="0.875rem" />
                <Skeleton width="3rem" height="0.875rem" />
                <Skeleton width="5rem" height="0.875rem" />
              </div>
            </div>
          </div>
        </div>
      </SkeletonCard>

      <div className="plugin-layout grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 xl:gap-6 items-start">
        <div className="plugin-main-content min-w-0 grid gap-6">
          <SkeletonCard className="p-4 lg:p-5">
            <Skeleton width="10rem" height="1rem" className="mb-3" />
            <Skeleton
              width="100%"
              height="2.75rem"
              borderRadius="var(--radius-md)"
            />
          </SkeletonCard>

          <SkeletonCard className="p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <Skeleton width="6rem" height="1.25rem" />
              <Skeleton
                width="5rem"
                height="1.75rem"
                borderRadius="var(--radius-md)"
              />
            </div>
            <div className="py-2">
              <Skeleton
                width="100%"
                height="12rem"
                borderRadius="var(--radius-sm)"
              />
            </div>
          </SkeletonCard>

          <SkeletonCard className="p-4 lg:p-5">
            <Skeleton width="10rem" height="1rem" className="mb-4" />
            <Skeleton
              width="100%"
              height="10rem"
              borderRadius="var(--radius-sm)"
            />
          </SkeletonCard>

          <SkeletonCard className="p-4 lg:p-5">
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

        <aside className="plugin-sidebar w-full xl:max-w-[280px] min-w-0 grid gap-6">
          <SkeletonCard className="p-5 bg-surface-secondary">
            <div className="grid grid-cols-[1fr_auto] items-center">
              <Skeleton width="6rem" height="1rem" />
              <Skeleton circle width={48} height={48} />
            </div>
          </SkeletonCard>

          <SkeletonCard className="p-4 lg:p-5">
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

          <SkeletonCard className="p-4 lg:p-5">
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

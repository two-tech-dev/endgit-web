import { Skeleton, SkeletonCard } from "@/components/Skeleton";

function StatCardSkeleton() {
  return (
    <SkeletonCard className="p-6 grid grid-flow-col auto-cols-max items-center gap-4">
      <Skeleton width={48} height={48} className="rounded-md" />
      <div>
        <Skeleton width="5rem" height="0.875rem" className="mb-1" />
        <Skeleton width="3rem" height="2rem" />
      </div>
    </SkeletonCard>
  );
}

export default function DashboardLoading() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-[1fr_auto] items-end mb-8 gap-4">
        <div>
          <Skeleton width="14rem" height="2rem" className="mb-2" />
          <Skeleton width="18rem" height="0.875rem" />
        </div>
        <Skeleton width="12rem" height="2.5rem" className="rounded-md" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-6 mb-10">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <Skeleton width="8rem" height="1.5rem" className="mb-6" />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonCard key={i} className="grid overflow-hidden">
            <Skeleton width="100%" height="4px" className="rounded-none" />
            <div className="p-5 grid gap-4">
              <div className="grid grid-cols-[1fr_auto]">
                <div className="grid grid-flow-col auto-cols-max gap-3 items-center">
                  <Skeleton width={48} height={48} className="rounded-sm" />
                  <div>
                    <Skeleton width="8rem" height="1.25rem" className="mb-1" />
                    <Skeleton width="4rem" height="0.875rem" />
                  </div>
                </div>
                <Skeleton
                  width="4rem"
                  height="1.25rem"
                  className="rounded-full"
                />
              </div>
              <div className="grid grid-flow-col auto-cols-max gap-4 py-4 border-y border-border">
                {Array.from({ length: 3 }, (_, j) => (
                  <div key={j}>
                    <Skeleton width="4rem" height="0.625rem" className="mb-1" />
                    <Skeleton width="3rem" height="0.875rem" />
                  </div>
                ))}
              </div>
              <Skeleton width="100%" height="2.25rem" className="rounded-sm" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

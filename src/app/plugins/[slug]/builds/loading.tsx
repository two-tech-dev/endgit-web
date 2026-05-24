import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function PluginBuildsLoading() {
  return (
    <div className="container py-8">
      <Skeleton width="10rem" height="0.875rem" className="mb-6" />

      <div className="mb-6">
        <Skeleton width="14rem" height="2rem" className="mb-1" />
        <Skeleton width="16rem" height="0.875rem" />
      </div>

      <SkeletonCard className="p-6">
        <div className="grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`grid grid-flow-col auto-cols-max items-center p-4 gap-4 ${i < 5 ? "border-b border-border" : ""}`}
            >
              <div className="w-[100px] shrink-0">
                <Skeleton width="4rem" height="0.875rem" className="mb-[2px]" />
                <Skeleton width="3rem" height="0.75rem" />
              </div>
              <div className="w-20 shrink-0">
                <Skeleton width="4rem" height="0.875rem" />
              </div>
              <div className="w-[60px] shrink-0">
                <Skeleton width="3rem" height="0.875rem" />
              </div>
              <div>
                <Skeleton width="70%" height="0.875rem" />
              </div>
              <div className="w-20 shrink-0">
                <Skeleton width="4rem" height="0.875rem" />
              </div>
              <div className="w-[100px] shrink-0 grid grid-flow-col auto-cols-max gap-2 justify-end">
                <Skeleton
                  width="3rem"
                  height="1.75rem"
                  className="rounded-sm"
                />
                <Skeleton
                  width="4rem"
                  height="1.75rem"
                  className="rounded-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

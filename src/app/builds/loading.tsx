import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function BuildsLoading() {
  return (
    <div className="container pt-10 pb-16 mx-auto px-4">
      <div className="mb-8">
        <Skeleton width="10rem" height="2rem" className="mb-2" />
        <Skeleton width="16rem" height="0.875rem" />
      </div>

      <SkeletonCard className="p-0">
        <div className="grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 ${
                i < 7 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-1 h-10 bg-surface-secondary shrink-0 rounded-xs" />
              <div className="flex-1 min-w-0">
                <Skeleton width="8rem" height="1.125rem" className="mb-2" />
                <div className="flex flex-wrap gap-3">
                  <Skeleton width="4rem" height="0.75rem" />
                  <Skeleton width="3.5rem" height="0.75rem" />
                  <Skeleton width="2rem" height="0.75rem" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0 ml-auto">
                <Skeleton
                  width="4rem"
                  height="1.25rem"
                  borderRadius="var(--radius-full)"
                />
                <Skeleton width="3rem" height="0.75rem" />
              </div>
            </div>
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function BuildDetailLoading() {
  return (
    <div className="container pt-8 pb-16 max-w-[960px] mx-auto px-4">
      <Skeleton
        width="10rem"
        height="0.875rem"
        className="mb-6"
      />

      <SkeletonCard className="p-6 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton width="14rem" height="1.5rem" />
              <Skeleton
                width="5rem"
                height="1.5rem"
                borderRadius="var(--radius-full)"
              />
            </div>
            <Skeleton width="8rem" height="0.875rem" />
          </div>
          <Skeleton
            width="10rem"
            height="2.25rem"
            borderRadius="var(--radius-md)"
          />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mt-5 pt-5 border-t border-border">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <Skeleton
                width="4rem"
                height="0.625rem"
                className="mb-1.5"
              />
              <Skeleton width="6rem" height="0.875rem" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      <SkeletonCard className="p-5">
        <div className="flex justify-between mb-3">
          <Skeleton width="6rem" height="1rem" />
          <Skeleton width="4rem" height="0.875rem" />
        </div>
        <Skeleton width="100%" height="16rem" borderRadius="var(--radius-sm)" />
      </SkeletonCard>
    </div>
  );
}

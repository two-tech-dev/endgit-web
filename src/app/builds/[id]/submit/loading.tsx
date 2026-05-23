import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function SubmitReviewLoading() {
  return (
    <div className="container pt-10 pb-16 mx-auto px-4">
      <SkeletonCard className="p-6 max-w-[700px] mx-auto">
        <Skeleton width="14rem" height="1.5rem" className="mb-2" />
        <Skeleton width="18rem" height="0.875rem" className="mb-6" />

        <div className="grid gap-5">
          <div>
            <Skeleton width="6rem" height="0.875rem" className="mb-2" />
            <Skeleton
              width="100%"
              height="2.5rem"
              borderRadius="var(--radius-md)"
            />
          </div>

          <div>
            <Skeleton width="8rem" height="0.875rem" className="mb-2" />
            <Skeleton
              width="100%"
              height="6rem"
              borderRadius="var(--radius-md)"
            />
          </div>

          <div>
            <Skeleton width="4rem" height="0.875rem" className="mb-2" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton
                  key={i}
                  width="5rem"
                  height="1.75rem"
                  borderRadius="var(--radius-full)"
                />
              ))}
            </div>
          </div>

          <Skeleton
            width="100%"
            height="2.75rem"
            borderRadius="var(--radius-md)"
          />
        </div>
      </SkeletonCard>
    </div>
  );
}

import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function BuildsLoading() {
  return (
    <div className="container pt-10 pb-16 mx-auto px-4">
      <div className="mb-8">
        <Skeleton width="10rem" height="2rem" className="mb-2" />
        <Skeleton width="16rem" height="0.875rem" />
      </div>

      <SkeletonCard className="p-0">
        <div className="flex flex-col">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`flex items-center p-4 gap-4 ${
                i < 7 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex-1">
                <Skeleton width="60%" height="0.875rem" className="mb-1" />
                <Skeleton width="30%" height="0.75rem" className="mb-1" />
                <Skeleton width="40%" height="0.75rem" />
              </div>
              <Skeleton width="5rem" height="0.875rem" />
              <Skeleton
                width="4rem"
                height="1.5rem"
                borderRadius="var(--radius-full)"
              />
              <Skeleton width="3rem" height="0.875rem" />
            </div>
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

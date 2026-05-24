import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function EditPluginLoading() {
  return (
    <div className="container py-8">
      <SkeletonCard className="p-6">
        <Skeleton width="10rem" height="1.5rem" className="mb-6" />

        <div className="grid gap-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <Skeleton width="6rem" height="0.875rem" className="mb-2" />
              <Skeleton width="100%" height="2.5rem" className="rounded-sm" />
            </div>
          ))}

          <div>
            <Skeleton width="5rem" height="0.875rem" className="mb-2" />
            <Skeleton width="100%" height="8rem" className="rounded-sm" />
          </div>

          <div className="grid grid-flow-col auto-cols-max gap-3 justify-end">
            <Skeleton width="5rem" height="2.5rem" className="rounded-sm" />
            <Skeleton width="5rem" height="2.5rem" className="rounded-sm" />
          </div>
        </div>
      </SkeletonCard>
    </div>
  );
}

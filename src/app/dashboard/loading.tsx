import { Skeleton } from "@/components/Skeleton";

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/80">
      <div className="flex items-center gap-4 p-6">
        <Skeleton width={48} height={48} borderRadius="var(--radius-md)" />
        <div>
          <Skeleton
            width="5rem"
            height="0.875rem"
            style={{ marginBottom: "0.25rem" }}
          />
          <Skeleton width="3rem" height="2rem" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton
            width="14rem"
            height="2rem"
            style={{ marginBottom: "0.5rem" }}
          />
          <Skeleton width="18rem" height="0.875rem" />
        </div>
        <Skeleton
          width="12rem"
          height="2.5rem"
          borderRadius="var(--radius-md)"
        />
      </div>

      <div className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <Skeleton
        width="8rem"
        height="1.5rem"
        style={{ marginBottom: "1.5rem" }}
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80"
          >
            <Skeleton width="100%" height="4px" borderRadius="0" />
            <div className="flex flex-col gap-4 p-5">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton
                    width={48}
                    height={48}
                    borderRadius="var(--radius-sm)"
                  />
                  <div>
                    <Skeleton
                      width="8rem"
                      height="1.25rem"
                      style={{ marginBottom: "0.25rem" }}
                    />
                    <Skeleton width="4rem" height="0.875rem" />
                  </div>
                </div>
                <Skeleton
                  width="4rem"
                  height="1.25rem"
                  borderRadius="var(--radius-full)"
                />
              </div>
              <div className="flex gap-4 border-y border-border py-4">
                {Array.from({ length: 3 }, (_, j) => (
                  <div key={j} className="flex-1">
                    <Skeleton
                      width="4rem"
                      height="0.625rem"
                      style={{ marginBottom: "4px" }}
                    />
                    <Skeleton width="3rem" height="0.875rem" />
                  </div>
                ))}
              </div>
              <Skeleton
                width="100%"
                height="2.25rem"
                borderRadius="var(--radius-sm)"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

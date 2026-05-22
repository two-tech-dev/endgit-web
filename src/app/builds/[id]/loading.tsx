import { Skeleton } from "@/components/Skeleton";

export default function BuildDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton
        width="10rem"
        height="0.875rem"
        style={{ marginBottom: "1.5rem" }}
      />

      <div className="rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-sm sm:p-5 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
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

        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 border-t border-border pt-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <Skeleton
                width="4rem"
                height="0.625rem"
                style={{ marginBottom: "6px" }}
              />
              <Skeleton width="6rem" height="0.875rem" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
        <div className="flex justify-between mb-3">
          <Skeleton width="6rem" height="1rem" />
          <Skeleton width="4rem" height="0.875rem" />
        </div>
        <Skeleton
          width="100%"
          height="16rem"
          borderRadius="var(--radius-sm)"
        />
      </div>
    </div>
  );
}

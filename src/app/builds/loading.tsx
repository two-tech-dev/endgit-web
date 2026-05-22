import { Skeleton } from "@/components/Skeleton";

export default function BuildsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Skeleton
          width="10rem"
          height="2rem"
          style={{ marginBottom: "0.5rem" }}
        />
        <Skeleton width="16rem" height="0.875rem" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/80">
        <div className="flex flex-col p-0">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-4 py-4 ${i < 7 ? "border-b border-border" : ""}`}
            >
              <div className="flex-1">
                <Skeleton
                  width="60%"
                  height="0.875rem"
                  style={{ marginBottom: "4px" }}
                />
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
      </div>
    </div>
  );
}

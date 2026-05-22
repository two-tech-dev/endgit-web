import { Skeleton } from "@/components/Skeleton";

export default function PluginBuildsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton
        width="10rem"
        height="0.875rem"
        style={{ marginBottom: "1.5rem" }}
      />

      <div className="mb-6">
        <Skeleton
          width="14rem"
          height="2rem"
          style={{ marginBottom: "4px" }}
        />
        <Skeleton width="16rem" height="0.875rem" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/80 p-6">
        <div className="flex flex-col">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-4 py-4 ${i < 5 ? "border-b border-border" : ""}`}
            >
              <div className="shrink-0 basis-[100px]">
                <Skeleton
                  width="4rem"
                  height="0.875rem"
                  style={{ marginBottom: "2px" }}
                />
                <Skeleton width="3rem" height="0.75rem" />
              </div>
              <div className="shrink-0 basis-[80px]">
                <Skeleton width="4rem" height="0.875rem" />
              </div>
              <div className="shrink-0 basis-[60px]">
                <Skeleton width="3rem" height="0.875rem" />
              </div>
              <div className="flex-1">
                <Skeleton width="70%" height="0.875rem" />
              </div>
              <div className="shrink-0 basis-[80px]">
                <Skeleton width="4rem" height="0.875rem" />
              </div>
              <div className="flex shrink-0 basis-[100px] justify-end gap-2">
                <Skeleton
                  width="3rem"
                  height="1.75rem"
                  borderRadius="var(--radius-md)"
                />
                <Skeleton
                  width="4rem"
                  height="1.75rem"
                  borderRadius="var(--radius-md)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

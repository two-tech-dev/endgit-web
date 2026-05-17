import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function PluginBuildsLoading() {
  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      <Skeleton
        width="10rem"
        height="0.875rem"
        style={{ marginBottom: "var(--space-6)" }}
      />

      <div style={{ marginBottom: "var(--space-6)" }}>
        <Skeleton width="14rem" height="2rem" style={{ marginBottom: "4px" }} />
        <Skeleton width="16rem" height="0.875rem" />
      </div>

      <SkeletonCard style={{ padding: "var(--space-6)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "var(--space-4)",
                gap: "var(--space-4)",
                borderBottom: i < 5 ? "1px solid var(--border-color)" : "none",
              }}
            >
              <div style={{ flex: "0 0 100px" }}>
                <Skeleton
                  width="4rem"
                  height="0.875rem"
                  style={{ marginBottom: "2px" }}
                />
                <Skeleton width="3rem" height="0.75rem" />
              </div>
              <div style={{ flex: "0 0 80px" }}>
                <Skeleton width="4rem" height="0.875rem" />
              </div>
              <div style={{ flex: "0 0 60px" }}>
                <Skeleton width="3rem" height="0.875rem" />
              </div>
              <div style={{ flex: 1 }}>
                <Skeleton width="70%" height="0.875rem" />
              </div>
              <div style={{ flex: "0 0 80px" }}>
                <Skeleton width="4rem" height="0.875rem" />
              </div>
              <div
                style={{
                  flex: "0 0 100px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "var(--space-2)",
                }}
              >
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
      </SkeletonCard>
    </div>
  );
}

import { Skeleton, SkeletonCard } from "@/components/Skeleton";

function StatCardSkeleton() {
  return (
    <SkeletonCard
      style={{
        padding: "var(--space-6)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
      }}
    >
      <Skeleton width={48} height={48} borderRadius="var(--radius-md)" />
      <div>
        <Skeleton width="5rem" height="0.875rem" style={{ marginBottom: "var(--space-1)" }} />
        <Skeleton width="3rem" height="2rem" />
      </div>
    </SkeletonCard>
  );
}

export default function DashboardLoading() {
  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "var(--space-8)",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <Skeleton width="14rem" height="2rem" style={{ marginBottom: "var(--space-2)" }} />
          <Skeleton width="18rem" height="0.875rem" />
        </div>
        <Skeleton width="12rem" height="2.5rem" borderRadius="var(--radius-md)" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
          gap: "var(--space-6)",
          marginBottom: "var(--space-10)",
        }}
      >
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <Skeleton width="8rem" height="1.5rem" style={{ marginBottom: "var(--space-6)" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))",
          gap: "var(--space-6)",
        }}
      >
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonCard
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Skeleton width="100%" height="4px" borderRadius="0" />
            <div
              style={{
                padding: "var(--space-5)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                  <Skeleton width={48} height={48} borderRadius="var(--radius-sm)" />
                  <div>
                    <Skeleton width="8rem" height="1.25rem" style={{ marginBottom: "var(--space-1)" }} />
                    <Skeleton width="4rem" height="0.875rem" />
                  </div>
                </div>
                <Skeleton width="4rem" height="1.25rem" borderRadius="var(--radius-full)" />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-4)",
                  padding: "var(--space-4) 0",
                  borderTop: "1px solid var(--border-color)",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                {Array.from({ length: 3 }, (_, j) => (
                  <div key={j} style={{ flex: 1 }}>
                    <Skeleton width="4rem" height="0.625rem" style={{ marginBottom: "4px" }} />
                    <Skeleton width="3rem" height="0.875rem" />
                  </div>
                ))}
              </div>
              <Skeleton width="100%" height="2.25rem" borderRadius="var(--radius-sm)" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

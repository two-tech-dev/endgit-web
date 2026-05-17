import { Skeleton, SkeletonText, SkeletonCard } from "@/components/Skeleton";

function PluginCardSkeleton() {
  return (
    <SkeletonCard style={{ padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          padding: "var(--space-4)",
          display: "flex",
          gap: "var(--space-4)",
          flexWrap: "wrap",
        }}
      >
        <Skeleton width={64} height={64} borderRadius="var(--radius-md)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Skeleton width="60%" height="1.25rem" style={{ marginBottom: "var(--space-2)" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "var(--space-3)",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Skeleton width="3rem" height="0.8125rem" />
              <Skeleton width="5rem" height="0.8125rem" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
              <Skeleton width="6rem" height="0.75rem" />
              <Skeleton width="5rem" height="0.75rem" />
            </div>
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}

export default function PluginsLoading() {
  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-8)",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <Skeleton width="8rem" height="2rem" style={{ marginBottom: "var(--space-1)" }} />
          <Skeleton width="12rem" height="0.875rem" />
        </div>
        <Skeleton width="300px" height="2.5rem" borderRadius="var(--radius-md)" />
      </div>

      <div
        className="plugins-layout"
        style={{ display: "flex", gap: "var(--space-8)" }}
      >
        <div
          className="sidebar-filters"
          style={{
            width: "250px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          <SkeletonCard style={{ padding: "var(--space-4)" }}>
            <Skeleton width="5rem" height="0.875rem" style={{ marginBottom: "var(--space-3)" }} />
            <Skeleton width="100%" height="2.5rem" borderRadius="var(--radius-md)" />
          </SkeletonCard>
          <SkeletonCard style={{ padding: "var(--space-4)" }}>
            <Skeleton width="4rem" height="0.875rem" style={{ marginBottom: "var(--space-3)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} width="100%" height="1.75rem" borderRadius="var(--radius-sm)" />
              ))}
            </div>
          </SkeletonCard>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
              gap: "var(--space-6)",
              alignContent: "start",
            }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <PluginCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

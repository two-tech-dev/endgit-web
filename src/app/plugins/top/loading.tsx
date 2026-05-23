import { Skeleton, SkeletonCard } from "@/components/Skeleton";

function PluginCardSkeleton() {
  return (
    <SkeletonCard
      style={{
        padding: 0,
        display: "grid",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "var(--space-4)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <Skeleton width={64} height={64} borderRadius="var(--radius-md)" />
        <div style={{ minWidth: 0 }}>
          <Skeleton
            width="60%"
            height="1.25rem"
            style={{ marginBottom: "var(--space-2)" }}
          />
          <Skeleton width="100%" height="0.875rem" />
        </div>
      </div>
      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid var(--border-color)",
          padding: "var(--space-3) var(--space-4)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          background: "var(--bg-secondary)",
        }}
      >
        <Skeleton width="5rem" height="0.75rem" />
        <Skeleton width="4rem" height="0.75rem" />
      </div>
    </SkeletonCard>
  );
}

export default function TopPluginsLoading() {
  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      <div style={{ marginBottom: "var(--space-8)" }}>
        <Skeleton
          width="8rem"
          height="0.875rem"
          style={{ marginBottom: "var(--space-4)" }}
        />
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "max-content",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <Skeleton width={32} height={32} />
          <Skeleton width="10rem" height="2rem" />
        </div>
        <Skeleton
          width="18rem"
          height="0.875rem"
          style={{ marginTop: "var(--space-2)" }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
          gap: "var(--space-6)",
        }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <PluginCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

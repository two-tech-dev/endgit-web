import { Skeleton, SkeletonCard } from "@/components/Skeleton";

function PluginCardSkeleton() {
  return (
    <SkeletonCard
      style={{
        padding: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
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
          <Skeleton
            width="60%"
            height="1.25rem"
            style={{ marginBottom: "var(--space-2)" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Skeleton width="3rem" height="0.8125rem" />
            <Skeleton width="5rem" height="0.8125rem" />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "4px",
          }}
        >
          <Skeleton width="6rem" height="0.75rem" />
          <Skeleton width="5rem" height="0.75rem" />
        </div>
      </div>
    </SkeletonCard>
  );
}

export default function AuthorPluginsLoading() {
  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      <div style={{ marginBottom: "var(--space-8)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <Skeleton width="7rem" height="2rem" />
          <Skeleton width="8rem" height="2rem" />
        </div>
        <Skeleton
          width="16rem"
          height="0.875rem"
          style={{ marginTop: "4px" }}
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
        {Array.from({ length: 4 }, (_, i) => (
          <PluginCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

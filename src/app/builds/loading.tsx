import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function BuildsLoading() {
  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-16)",
      }}
    >
      <div style={{ marginBottom: "var(--space-8)" }}>
        <Skeleton
          width="10rem"
          height="2rem"
          style={{ marginBottom: "var(--space-2)" }}
        />
        <Skeleton width="16rem" height="0.875rem" />
      </div>

      <SkeletonCard style={{ padding: 0 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "var(--space-4)",
                gap: "var(--space-4)",
                borderBottom: i < 7 ? "1px solid var(--border-color)" : "none",
              }}
            >
              <div style={{ flex: 1 }}>
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
      </SkeletonCard>
    </div>
  );
}

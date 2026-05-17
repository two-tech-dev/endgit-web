import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function SubmitReviewLoading() {
  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-16)",
      }}
    >
      <SkeletonCard style={{ padding: "var(--space-6)", maxWidth: "700px", margin: "0 auto" }}>
        <Skeleton width="14rem" height="1.5rem" style={{ marginBottom: "var(--space-2)" }} />
        <Skeleton width="18rem" height="0.875rem" style={{ marginBottom: "var(--space-6)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <div>
            <Skeleton width="6rem" height="0.875rem" style={{ marginBottom: "var(--space-2)" }} />
            <Skeleton width="100%" height="2.5rem" borderRadius="var(--radius-md)" />
          </div>

          <div>
            <Skeleton width="8rem" height="0.875rem" style={{ marginBottom: "var(--space-2)" }} />
            <Skeleton width="100%" height="6rem" borderRadius="var(--radius-md)" />
          </div>

          <div>
            <Skeleton width="4rem" height="0.875rem" style={{ marginBottom: "var(--space-2)" }} />
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} width="5rem" height="1.75rem" borderRadius="var(--radius-full)" />
              ))}
            </div>
          </div>

          <Skeleton width="100%" height="2.75rem" borderRadius="var(--radius-md)" />
        </div>
      </SkeletonCard>
    </div>
  );
}

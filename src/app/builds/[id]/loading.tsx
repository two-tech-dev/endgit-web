import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function BuildDetailLoading() {
  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-8)",
        paddingBottom: "var(--space-16)",
        maxWidth: "960px",
      }}
    >
      <Skeleton
        width="10rem"
        height="0.875rem"
        style={{ marginBottom: "var(--space-6)" }}
      />

      <SkeletonCard
        style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-2)",
              }}
            >
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "var(--space-4)",
            marginTop: "var(--space-5)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid var(--border-color)",
          }}
        >
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
      </SkeletonCard>

      <SkeletonCard style={{ padding: "var(--space-5)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "var(--space-3)",
          }}
        >
          <Skeleton width="6rem" height="1rem" />
          <Skeleton width="4rem" height="0.875rem" />
        </div>
        <Skeleton width="100%" height="16rem" borderRadius="var(--radius-sm)" />
      </SkeletonCard>
    </div>
  );
}

import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <section
        style={{
          padding: "clamp(4rem, 10vw, 8rem) 0 clamp(3rem, 8vw, 6rem)",
          textAlign: "center",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-5)",
          }}
        >
          <Skeleton width="7rem" height="1.5rem" borderRadius="var(--radius-full)" />
          <Skeleton width="24rem" height="3rem" style={{ maxWidth: "90%" }} />
          <Skeleton width="30rem" height="1rem" style={{ maxWidth: "90%" }} />
          <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
            <Skeleton width="10rem" height="3rem" borderRadius="var(--radius-md)" />
            <Skeleton width="12rem" height="3rem" borderRadius="var(--radius-md)" />
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: "var(--space-12)" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            justifyContent: "center",
          }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard
              key={i}
              style={{
                flex: "1 1 200px",
                maxWidth: "260px",
                textAlign: "center",
                padding: "var(--space-5) var(--space-6)",
              }}
            >
              <Skeleton width="4rem" height="1.75rem" style={{ margin: "0 auto var(--space-1)" }} />
              <Skeleton width="5rem" height="0.75rem" style={{ margin: "0 auto" }} />
            </SkeletonCard>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: "var(--space-16)" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <Skeleton width="14rem" height="2rem" style={{ margin: "0 auto var(--space-2)" }} />
          <Skeleton width="20rem" height="0.875rem" style={{ margin: "0 auto" }} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonCard
              key={i}
              style={{
                padding: "var(--space-4)",
                display: "flex",
                gap: "var(--space-4)",
              }}
            >
              <Skeleton width={64} height={64} borderRadius="var(--radius-md)" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="1.125rem" style={{ marginBottom: "var(--space-2)" }} />
                <Skeleton width="100%" height="0.875rem" />
                <Skeleton width="80%" height="0.875rem" style={{ marginTop: "4px" }} />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </section>
    </div>
  );
}

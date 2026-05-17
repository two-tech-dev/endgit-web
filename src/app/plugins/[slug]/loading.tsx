import { Skeleton, SkeletonText, SkeletonCard } from "@/components/Skeleton";

export default function PluginDetailLoading() {
  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
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
          <div
            className="plugin-header-inner"
            style={{
              display: "flex",
              gap: "var(--space-4)",
              minWidth: 0,
              flex: "1 1 auto",
            }}
          >
            <Skeleton width={72} height={72} borderRadius="var(--radius-lg)" />
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-2)",
                }}
              >
                <Skeleton width="14rem" height="2rem" />
                <Skeleton
                  width="5rem"
                  height="1.25rem"
                  borderRadius="var(--radius-full)"
                />
              </div>
              <Skeleton
                width="10rem"
                height="0.875rem"
                style={{ marginBottom: "var(--space-2)" }}
              />
              <Skeleton width="20rem" height="0.875rem" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
              alignItems: "flex-end",
            }}
          >
            <Skeleton
              width="10rem"
              height="2.5rem"
              borderRadius="var(--radius-md)"
            />
            <div style={{ display: "flex", gap: "var(--space-6)" }}>
              <Skeleton width="4rem" height="1rem" />
              <Skeleton width="5rem" height="1rem" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      <div
        className="plugin-layout"
        style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}
      >
        <div
          className="plugin-main-content"
          style={{
            flex: "1 1 min(400px, 100%)",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          <SkeletonCard style={{ padding: "var(--space-5)" }}>
            <Skeleton
              width="10rem"
              height="1rem"
              style={{ marginBottom: "var(--space-3)" }}
            />
            <Skeleton
              width="100%"
              height="2.75rem"
              borderRadius="var(--radius-md)"
            />
          </SkeletonCard>

          <div
            style={{
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-secondary)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                padding: "10px 16px",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <Skeleton width="8rem" height="0.875rem" />
              <Skeleton width="3rem" height="0.875rem" />
            </div>
            <div style={{ padding: "12px" }}>
              <Skeleton
                width="100%"
                height="12rem"
                borderRadius="var(--radius-sm)"
              />
            </div>
          </div>

          <SkeletonCard style={{ padding: "var(--space-5)" }}>
            <Skeleton
              width="10rem"
              height="1rem"
              style={{ marginBottom: "var(--space-4)" }}
            />
            <Skeleton
              width="100%"
              height="10rem"
              borderRadius="var(--radius-sm)"
            />
          </SkeletonCard>

          <SkeletonCard style={{ padding: "var(--space-5)" }}>
            <Skeleton
              width="8rem"
              height="1rem"
              style={{ marginBottom: "var(--space-4)" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} style={{ display: "flex", gap: "var(--space-3)" }}>
                  <Skeleton circle width={32} height={32} />
                  <div style={{ flex: 1 }}>
                    <Skeleton
                      width="40%"
                      height="0.875rem"
                      style={{ marginBottom: "var(--space-1)" }}
                    />
                    <Skeleton width="100%" height="0.75rem" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        <aside
          className="plugin-sidebar"
          style={{
            flex: "0 0 100%",
            maxWidth: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          <SkeletonCard
            style={{
              padding: "var(--space-5)",
              background: "var(--bg-secondary)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Skeleton width="6rem" height="1rem" />
              <Skeleton circle width={48} height={48} />
            </div>
          </SkeletonCard>

          <SkeletonCard style={{ padding: "var(--space-5)" }}>
            <Skeleton
              width="4rem"
              height="1rem"
              style={{ marginBottom: "var(--space-4)" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Skeleton width="5rem" height="0.875rem" />
                  <Skeleton width="5rem" height="0.875rem" />
                </div>
              ))}
            </div>
          </SkeletonCard>

          <SkeletonCard style={{ padding: "var(--space-5)" }}>
            <Skeleton
              width="8rem"
              height="1rem"
              style={{ marginBottom: "var(--space-3)" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Skeleton circle width={32} height={32} />
                  <div>
                    <Skeleton
                      width="7rem"
                      height="0.875rem"
                      style={{ marginBottom: "4px" }}
                    />
                    <Skeleton width="5rem" height="0.625rem" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </aside>
      </div>
    </div>
  );
}

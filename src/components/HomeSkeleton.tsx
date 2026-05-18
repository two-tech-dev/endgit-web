import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* ── Hero skeleton ── */}
      <section
        style={{
          padding: "clamp(3.5rem, 10vw, 7rem) 0 clamp(3rem, 8vw, 5rem)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(2.5rem, 6vw, 5rem)",
            flexWrap: "wrap",
          }}
        >
          {/* Left copy */}
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <Skeleton
              width="7rem"
              height="1.5rem"
              borderRadius="var(--radius-full)"
              style={{ marginBottom: "var(--space-5)" }}
            />
            <Skeleton
              width="100%"
              height="3rem"
              style={{ maxWidth: "480px", marginBottom: "var(--space-4)" }}
            />
            <Skeleton
              width="100%"
              height="1rem"
              style={{ maxWidth: "400px", marginBottom: "var(--space-6)" }}
            />
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                marginBottom: "var(--space-8)",
              }}
            >
              <Skeleton
                width="10rem"
                height="2.75rem"
                borderRadius="var(--radius-sm)"
              />
              <Skeleton
                width="9rem"
                height="2.75rem"
                borderRadius="var(--radius-sm)"
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "var(--space-8)",
                paddingTop: "var(--space-5)",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i}>
                  <Skeleton
                    width="3rem"
                    height="1.5rem"
                    style={{ marginBottom: "4px" }}
                  />
                  <Skeleton width="4rem" height="0.6875rem" />
                </div>
              ))}
            </div>
          </div>

          {/* Right terminal */}
          <div
            style={{
              flex: "1 1 400px",
              display: "flex",
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            <Skeleton
              width="100%"
              height="260px"
              borderRadius="var(--radius-xl)"
              style={{ maxWidth: "520px" }}
            />
          </div>
        </div>
      </section>

      {/* ── How it works skeleton ── */}
      <section
        className="container"
        style={{ paddingBottom: "var(--space-16)" }}
      >
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <Skeleton
            width="6rem"
            height="0.6875rem"
            style={{ margin: "0 auto var(--space-2)" }}
          />
          <Skeleton width="18rem" height="2rem" style={{ margin: "0 auto" }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
            maxWidth: "640px",
            margin: "0 auto",
          }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-5)",
                padding: "var(--space-5) var(--space-6)",
              }}
            >
              <Skeleton
                width="40px"
                height="40px"
                borderRadius="var(--radius-md)"
              />
              <div style={{ flex: 1 }}>
                <Skeleton
                  width="40%"
                  height="0.9375rem"
                  style={{ marginBottom: "var(--space-2)" }}
                />
                <Skeleton width="100%" height="0.8125rem" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </section>

      {/* ── Latest plugins skeleton ── */}
      <section
        className="container"
        style={{ paddingBottom: "var(--space-16)" }}
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
            <Skeleton
              width="12rem"
              height="2rem"
              style={{ marginBottom: "var(--space-2)" }}
            />
            <Skeleton width="18rem" height="1rem" />
          </div>
          <Skeleton
            width="7rem"
            height="2.25rem"
            borderRadius="var(--radius-sm)"
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
            <SkeletonCard
              key={i}
              style={{
                padding: "var(--space-4)",
                display: "flex",
                gap: "var(--space-4)",
              }}
            >
              <Skeleton
                width={64}
                height={64}
                borderRadius="var(--radius-md)"
              />
              <div style={{ flex: 1 }}>
                <Skeleton
                  width="60%"
                  height="1.125rem"
                  style={{ marginBottom: "var(--space-2)" }}
                />
                <Skeleton
                  width="40%"
                  height="0.8125rem"
                  style={{ marginBottom: "4px" }}
                />
                <Skeleton width="30%" height="0.75rem" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </section>

      {/* ── Features skeleton ── */}
      <section
        className="container"
        style={{ paddingBottom: "var(--space-16)" }}
      >
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <Skeleton
            width="5rem"
            height="0.6875rem"
            style={{ margin: "0 auto var(--space-2)" }}
          />
          <Skeleton width="20rem" height="2rem" style={{ margin: "0 auto" }} />
        </div>
        <SkeletonCard
          style={{
            padding: "var(--space-8)",
            display: "flex",
            gap: "var(--space-6)",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "var(--space-5)",
          }}
        >
          <Skeleton
            width="56px"
            height="56px"
            borderRadius="var(--radius-lg)"
          />
          <div style={{ flex: 1, minWidth: "240px" }}>
            <Skeleton
              width="45%"
              height="1.25rem"
              style={{ marginBottom: "var(--space-2)" }}
            />
            <Skeleton width="100%" height="0.9375rem" />
            <Skeleton
              width="80%"
              height="0.9375rem"
              style={{ marginTop: "4px" }}
            />
          </div>
        </SkeletonCard>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard
              key={i}
              style={{
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              <Skeleton
                width="40px"
                height="40px"
                borderRadius="var(--radius-md)"
              />
              <Skeleton width="50%" height="0.9375rem" />
              <Skeleton width="100%" height="0.8125rem" />
              <Skeleton width="85%" height="0.8125rem" />
            </SkeletonCard>
          ))}
        </div>
      </section>

      {/* ── CTA skeleton ── */}
      <section
        className="container"
        style={{ paddingBottom: "var(--space-16)" }}
      >
        <div
          style={{
            background: "#0f172a",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-10) var(--space-8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-4)",
          }}
        >
          <Skeleton
            width="16rem"
            height="1.75rem"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <Skeleton
            width="20rem"
            height="0.9375rem"
            style={{ background: "rgba(255,255,255,0.05)", maxWidth: "90%" }}
          />
          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              marginTop: "var(--space-2)",
            }}
          >
            <Skeleton
              width="9rem"
              height="2.75rem"
              borderRadius="var(--radius-sm)"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <Skeleton
              width="8rem"
              height="2.75rem"
              borderRadius="var(--radius-sm)"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

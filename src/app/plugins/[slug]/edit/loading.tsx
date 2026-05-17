import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function EditPluginLoading() {
  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      <SkeletonCard style={{ padding: "var(--space-6)" }}>
        <Skeleton
          width="10rem"
          height="1.5rem"
          style={{ marginBottom: "var(--space-6)" }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <Skeleton
                width="6rem"
                height="0.875rem"
                style={{ marginBottom: "var(--space-2)" }}
              />
              <Skeleton
                width="100%"
                height="2.5rem"
                borderRadius="var(--radius-md)"
              />
            </div>
          ))}

          <div>
            <Skeleton
              width="5rem"
              height="0.875rem"
              style={{ marginBottom: "var(--space-2)" }}
            />
            <Skeleton
              width="100%"
              height="8rem"
              borderRadius="var(--radius-md)"
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              justifyContent: "flex-end",
            }}
          >
            <Skeleton
              width="5rem"
              height="2.5rem"
              borderRadius="var(--radius-md)"
            />
            <Skeleton
              width="5rem"
              height="2.5rem"
              borderRadius="var(--radius-md)"
            />
          </div>
        </div>
      </SkeletonCard>
    </div>
  );
}

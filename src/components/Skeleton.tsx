interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
  circle?: boolean;
}

export function Skeleton({
  width,
  height = "1rem",
  borderRadius,
  style,
  circle,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton${circle ? " skeleton-circle" : ""}`}
      style={{
        width: circle ? height : width,
        height,
        borderRadius: circle ? undefined : borderRadius,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export function SkeletonText({
  lines = 3,
  width,
  gap = "var(--space-2)",
  style,
}: {
  lines?: number;
  width?: string;
  gap?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? "60%" : width || "100%"}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="skeleton-card" style={style}>
      {children}
    </div>
  );
}

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
  circle?: boolean;
}

export function Skeleton({
  width,
  height = "1rem",
  borderRadius,
  className = "",
  style,
  circle,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton${circle ? " skeleton-circle" : ""} ${className}`}
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
  gap = "0.5rem",
  className = "",
  style,
}: {
  lines?: number;
  width?: string;
  gap?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`grid ${className}`} style={{ gap, ...style }}>
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
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`skeleton-card ${className}`} style={style}>
      {children}
    </div>
  );
}

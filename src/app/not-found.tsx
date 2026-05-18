import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-16)",
        textAlign: "center",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(4rem, 10vw, 8rem)",
          fontWeight: 800,
          color: "var(--text-muted)",
          lineHeight: 1,
          margin: 0,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          color: "var(--text-secondary)",
          marginTop: "var(--space-4)",
          maxWidth: "480px",
        }}
      >
        The page you're looking for doesn't exist or has been removed.
      </p>
      <div
        style={{
          display: "flex",
          gap: "var(--space-3)",
          marginTop: "var(--space-8)",
        }}
      >
        <Link
          href="/"
          className="btn btn-primary"
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.9375rem",
            textDecoration: "none",
          }}
        >
          Go Home
        </Link>
        <Link
          href="/plugins"
          className="btn btn-secondary"
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.9375rem",
            textDecoration: "none",
          }}
        >
          Browse Plugins
        </Link>
      </div>
    </div>
  );
}

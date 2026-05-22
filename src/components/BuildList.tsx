"use client";

import { useMemo, useState } from "react";
import {
  GitBranch,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Package,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "SUCCESS":
      return <CheckCircle size={16} color="var(--status-success)" />;

    case "FAILED":
      return <XCircle size={16} color="var(--status-error)" />;

    case "RUNNING":
      return (
        <Loader2
          size={16}
          color="var(--accent-primary)"
          style={{ animation: "spin 1s linear infinite" }}
        />
      );

    default:
      return <Clock size={16} color="var(--text-muted)" />;
  }
}

function statusColor(status: string) {
  switch (status) {
    case "SUCCESS":
      return "var(--status-success)";

    case "FAILED":
      return "var(--status-error)";

    case "RUNNING":
      return "var(--accent-primary)";

    default:
      return "var(--text-muted)";
  }
}

export default function BuildsList({
  builds,
  today,
}: {
  builds: any[];
  today: string;
}) {
  const [query, setQuery] = useState("");

  const filteredBuilds = useMemo(() => {
    const q = query.toLowerCase();

    return builds.filter((build) => {
      const plugin = build.plugin?.displayName || build.plugin?.name || "";
      const author = build.plugin?.author?.username || "";

      const matchesSearch =
        plugin.toLowerCase().includes(q) ||
        author.toLowerCase().includes(q) ||
        build.branch?.toLowerCase().includes(q) ||
        build.status?.toLowerCase().includes(q);

      if (!q) {
        // If no search query, only show today's builds
        const isToday =
          new Date(build.createdAt).toISOString().slice(0, 10) === today;
        return isToday && matchesSearch;
      }

      // If there is a search query, show any matching build regardless of date
      return matchesSearch;
    });
  }, [builds, query, today]);

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            marginBottom: "var(--space-2)",
          }}
        >
          <h1 className="heading-2">Dev Builds</h1>

          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: "var(--radius-full)",
              background: "rgba(6, 182, 212, 0.1)",
              color: "var(--accent-primary)",
              border: "1px solid rgba(6, 182, 212, 0.2)",
            }}
          >
            Today ({today})
          </span>
        </div>

        <p className="text-muted" style={{ maxWidth: "600px" }}>
          CI builds from developer pushes today (UTC).
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "0 var(--space-4)",
          }}
        >
          <Search size={18} color="var(--text-muted)" />

          <input
            type="text"
            placeholder="Search builds..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              height: "48px",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
            }}
          />
        </div>
      </div>

      {/* Warning */}
      <div
        className="card"
        style={{
          padding: "var(--space-4) var(--space-5)",
          marginBottom: "var(--space-8)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          borderLeft: "4px solid var(--status-warning)",
          background: "rgba(245, 158, 11, 0.04)",
        }}
      >
        <AlertTriangle
          size={20}
          color="var(--status-warning)"
          style={{ flexShrink: 0 }}
        />

        <div>
          <span style={{ fontWeight: 600 }}>Caution:</span> Development builds
          may be unstable.
        </div>
      </div>

      {/* Builds */}
      {filteredBuilds.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "var(--space-12)",
            textAlign: "center",
          }}
        >
          <Package
            size={48}
            color="var(--text-muted)"
            style={{ margin: "0 auto var(--space-4)" }}
          />

          <p>No matching builds</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {filteredBuilds.map((build: any) => (
            <Link
              key={build.id}
              href={`/plugins/${build.plugin?.slug}/builds`}
              className="card"
              style={{
                padding: "var(--space-4) var(--space-5)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "40px",
                  borderRadius: "2px",
                  background: statusColor(build.status),
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {build.plugin?.displayName || build.plugin?.name}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-3)",
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <User size={12} />
                    {build.plugin?.author?.username || "unknown"}
                  </span>

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <GitBranch size={12} />
                    {build.branch}
                  </span>

                  <span>#{build.buildNumber}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "2px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <StatusIcon status={build.status} />

                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: statusColor(build.status),
                    }}
                  >
                    {build.status}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {timeAgo(build.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

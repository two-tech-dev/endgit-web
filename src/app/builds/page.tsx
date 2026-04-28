import { GitBranch, Clock, AlertTriangle, CheckCircle, XCircle, Loader2, Package } from "lucide-react";

async function getRecentBuilds() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/builds/recent?limit=30`, { cache: "no-store" });
    if (!res.ok) return { builds: [], pagination: null };
    const json = await res.json();
    return { builds: json.data || [], pagination: json.pagination };
  } catch {
    return { builds: [], pagination: null };
  }
}

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
    case "SUCCESS": return <CheckCircle size={16} color="var(--status-success)" />;
    case "FAILED": return <XCircle size={16} color="var(--status-error)" />;
    case "RUNNING": return <Loader2 size={16} color="var(--accent-cyan)" style={{ animation: "spin 1s linear infinite" }} />;
    case "QUEUED": return <Clock size={16} color="var(--text-muted)" />;
    default: return <Clock size={16} color="var(--text-muted)" />;
  }
}

function statusColor(status: string) {
  switch (status) {
    case "SUCCESS": return "var(--status-success)";
    case "FAILED": return "var(--status-error)";
    case "RUNNING": return "var(--accent-cyan)";
    default: return "var(--text-muted)";
  }
}

export default async function BuildsPage() {
  const { builds } = await getRecentBuilds();

  return (
    <div className="container" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>
      {/* Header */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "var(--radius-full)", background: "var(--status-success)", boxShadow: "0 0 8px var(--status-success)", animation: "pulse 2s infinite" }} />
          <h1 className="heading-2">Live Builds</h1>
        </div>
        <p className="text-muted" style={{ maxWidth: "600px" }}>
          Real-time CI builds from developer pushes. These are development builds and may contain unstable or untested code.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="card" style={{
        padding: "var(--space-4) var(--space-5)",
        marginBottom: "var(--space-8)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        borderLeft: "4px solid var(--status-warning)",
        background: "rgba(245, 158, 11, 0.04)"
      }}>
        <AlertTriangle size={20} color="var(--status-warning)" style={{ flexShrink: 0 }} />
        <div>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Caution: </span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Development builds are unreviewed and may contain dangerous or broken code. Only install builds you trust.
          </span>
        </div>
      </div>

      {/* Build List */}
      {builds.length === 0 ? (
        <div className="card" style={{ padding: "var(--space-12)", textAlign: "center" }}>
          <Package size={48} color="var(--text-muted)" style={{ margin: "0 auto var(--space-4)" }} />
          <p style={{ fontSize: "1.125rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>No builds yet</p>
          <p className="text-muted">Builds will appear here when developers push code to their repositories.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-4)" }}>
          {builds.map((build: any) => (
            <a
              key={build.id}
              href={`/plugins/${build.plugin?.slug}/builds`}
              className="card"
              style={{
                padding: "var(--space-4) var(--space-5)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                textDecoration: "none"
              }}
            >
              {/* Status indicator bar */}
              <div style={{
                width: "4px",
                height: "40px",
                borderRadius: "2px",
                background: statusColor(build.status),
                flexShrink: 0
              }} />

              {/* Plugin info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "2px" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {build.plugin?.displayName || build.plugin?.name}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "0.8125rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <GitBranch size={12} /> {build.branch}
                  </span>
                  <span>#{build.buildNumber}</span>
                </div>
              </div>

              {/* Status + Time */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <StatusIcon status={build.status} />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: statusColor(build.status) }}>
                    {build.status}
                  </span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {timeAgo(build.createdAt)}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}

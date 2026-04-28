import { ArrowLeft, GitBranch, Clock, Download, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import LiveBuildLog from "@/components/LiveBuildLog";
import SubmitForReview from "@/components/SubmitForReview";

async function getBuild(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/builds/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; icon: any }> = {
    SUCCESS: { color: "var(--status-success)", bg: "rgba(16, 185, 129, 0.1)", icon: <CheckCircle size={14} /> },
    FAILED: { color: "var(--status-error)", bg: "rgba(239, 68, 68, 0.1)", icon: <XCircle size={14} /> },
    RUNNING: { color: "var(--accent-cyan)", bg: "rgba(14, 165, 233, 0.1)", icon: <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> },
    QUEUED: { color: "var(--text-muted)", bg: "rgba(100, 116, 139, 0.1)", icon: <Clock size={14} /> },
  };
  const c = config[status] || config.QUEUED;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "4px 10px", borderRadius: "var(--radius-full)",
      fontSize: "0.8125rem", fontWeight: 600,
      color: c.color, background: c.bg
    }}>
      {c.icon} {status}
    </span>
  );
}

export default async function BuildDetailPage({ params }: { params: { id: string } }) {
  const build = await getBuild(params.id);

  if (!build) {
    return (
      <div className="container" style={{ paddingTop: "var(--space-16)", textAlign: "center" }}>
        <h1 className="heading-2">Build not found</h1>
        <p className="text-muted" style={{ marginTop: "var(--space-2)" }}>This build may have been deleted or doesn't exist.</p>
        <a href="/builds" className="btn btn-secondary" style={{ marginTop: "var(--space-6)" }}>
          <ArrowLeft size={16} /> Back to Live Builds
        </a>
      </div>
    );
  }

  let canSubmit = build.plugin?.status !== "PENDING_REVIEW";
  if (canSubmit && build.plugin?.reviewBuildId) {
    const reviewBuild = await getBuild(build.plugin.reviewBuildId);
    if (reviewBuild && build.buildNumber <= reviewBuild.buildNumber) {
      canSubmit = false;
    }
  }

  return (
    <div className="container" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-16)", maxWidth: "960px" }}>
      {/* Breadcrumb */}
      <a href="/builds" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>
        <ArrowLeft size={14} /> Back to Live Builds
      </a>

      {/* Header Card */}
      <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
              <h1 className="heading-3" style={{ margin: 0 }}>
                {build.plugin?.displayName} — Build #{build.buildNumber}
              </h1>
              <StatusBadge status={build.status} />
              {!build.isRelease && (
                <span style={{
                  fontSize: "0.6875rem", padding: "2px 8px", borderRadius: "var(--radius-sm)",
                  background: "rgba(245, 158, 11, 0.1)", color: "var(--status-warning)",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"
                }}>
                  ⚠️ Unstable
                </span>
              )}
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              by {build.plugin?.author?.username || "unknown"}
            </p>
          </div>

          {build.artifactUrl && build.status === "SUCCESS" && (
            <a href={build.artifactUrl} className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>
              <Download size={16} /> Download Artifact
            </a>
          )}
        </div>

        {/* Metadata Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "var(--space-4)", marginTop: "var(--space-5)",
          paddingTop: "var(--space-5)", borderTop: "1px solid var(--border-color)"
        }}>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Branch</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 500, color: "var(--text-primary)" }}>
              <GitBranch size={14} color="var(--accent-purple)" /> {build.branch}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Commit</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>
              {build.commitHash ? build.commitHash.slice(0, 7) : "—"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Duration</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 500, color: "var(--text-primary)" }}>
              <Clock size={14} color="var(--accent-cyan)" /> {build.duration ? `${build.duration}s` : "—"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Created</div>
            <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "0.875rem" }}>
              {timeAgo(build.createdAt)}
            </div>
          </div>
          {build.artifactSize && (
            <div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Artifact Size</div>
              <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "0.875rem" }}>
                {(build.artifactSize / 1024).toFixed(1)} KB
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Build Logs — Live SSE Stream (Phase 11) */}
      <LiveBuildLog 
        buildId={build.id} 
        initialLogs={build.logs || ""} 
        initialStatus={build.status} 
      />

      {/* Submit for Review (Feature 4) */}
      <SubmitForReview
        buildId={build.id}
        buildNumber={build.buildNumber}
        buildStatus={build.status}
        isSubmitted={build.id === build.plugin?.reviewBuildId}
        canSubmit={canSubmit}
      />

      {/* Not Reviewed Warning */}
      {!build.isRelease ? (
        <div className="card" style={{
          padding: "var(--space-4) var(--space-5)",
          marginTop: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          borderLeft: "4px solid var(--status-warning)",
          background: "rgba(245, 158, 11, 0.04)"
        }}>
          <AlertTriangle size={18} color="var(--status-warning)" style={{ flexShrink: 0 }} />
          <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            <strong style={{ color: "var(--text-primary)" }}>NOT REVIEWED</strong> — This is a development build. It has not been reviewed for safety or stability. Use at your own risk.
          </span>
        </div>
      ) : null}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

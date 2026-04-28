import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { Clock, GitBranch, CheckCircle, XCircle, Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getPluginBuilds(slug: string) {
  const { data } = await fetchApi(`/api/v1/builds/plugin/${slug}`);
  return data?.data?.builds || [];
}

async function getPlugin(slug: string) {
  const { data } = await fetchApi(`/api/v1/plugins/${slug}`);
  return data?.data || null;
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
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)",
      fontSize: "0.75rem", fontWeight: 600,
      color: c.color, background: c.bg
    }}>
      {c.icon} {status}
    </span>
  );
}

export default async function PluginBuildsPage({ params }: { params: { slug: string } }) {
  const [plugin, builds] = await Promise.all([
    getPlugin(params.slug),
    getPluginBuilds(params.slug)
  ]);

  if (!plugin) return notFound();

  // Find the currently reviewed build if any
  const reviewedBuild = plugin.reviewBuildId ? builds.find((b: any) => b.id === plugin.reviewBuildId) : null;
  let reviewedBuildNumber = reviewedBuild ? reviewedBuild.buildNumber : -1;

  // If the reviewed build is older than the current page, fetch it directly
  if (plugin.reviewBuildId && reviewedBuildNumber === -1) {
    const res = await fetchApi(`/api/v1/builds/${plugin.reviewBuildId}`);
    if (res?.data?.data) {
      reviewedBuildNumber = Number(res.data.data.buildNumber);
    }
  }

  return (
    <div className="container" style={{ padding: "var(--space-8) 0" }}>
      <Link href="/dashboard/dev" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        color: "var(--text-muted)", textDecoration: "none",
        fontSize: "0.875rem", fontWeight: 500, marginBottom: "var(--space-6)"
      }}>
        <ArrowLeft size={16} /> Back to Dev Dashboard
      </Link>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>{plugin.displayName} CI Builds</h1>
        <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>View build history and logs for this plugin.</p>
      </div>

      <div className="card" style={{ padding: "var(--space-6)" }}>
        {builds.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-muted)" }}>
            <GitBranch size={32} style={{ margin: "0 auto var(--space-4)", opacity: 0.5 }} />
            <p style={{ fontWeight: 500 }}>No builds found.</p>
            <p style={{ fontSize: "0.875rem", marginTop: "4px" }}>Push to your repository to trigger the first build.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ padding: "0 var(--space-4) var(--space-3)", color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600 }}>Build</th>
                <th style={{ padding: "0 var(--space-4) var(--space-3)", color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600 }}>Commit</th>
                <th style={{ padding: "0 var(--space-4) var(--space-3)", color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "0 var(--space-4) var(--space-3)", color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600 }}>Time</th>
                <th style={{ padding: "0 var(--space-4) var(--space-3)", color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {builds.map((build: any) => (
                <tr key={build.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--space-4)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>#{build.buildNumber}</span>
                      {build.triggerType === "WEBHOOK" && <span className="badge" style={{ fontSize: "0.625rem" }}>AUTO</span>}
                    </div>
                  </td>
                  <td style={{ padding: "var(--space-4)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        {build.commitMessage || "No message"}
                        {plugin.reviewBuildId === build.id && plugin.status === "PENDING_REVIEW" && (
                          <span className="badge badge-warning" style={{ fontSize: "0.625rem", background: "rgba(245, 158, 11, 0.2)", color: "var(--status-warning)" }}>PENDING REVIEW</span>
                        )}
                        {plugin.reviewBuildId === build.id && plugin.status === "APPROVED" && (
                          <span className="badge badge-success" style={{ fontSize: "0.625rem", background: "rgba(16, 185, 129, 0.2)", color: "var(--status-success)" }}>APPROVED</span>
                        )}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <GitBranch size={12} /> {build.branch}
                        {build.commitHash && (
                          <>
                            <span style={{ opacity: 0.5 }}>•</span>
                            <span style={{ fontFamily: "var(--font-mono)" }}>{build.commitHash.slice(0, 7)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "var(--space-4)" }}>
                    <StatusBadge status={build.status} />
                  </td>
                  <td style={{ padding: "var(--space-4)", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    {timeAgo(build.createdAt)}
                    {build.duration && <div style={{ fontSize: "0.75rem", marginTop: "2px" }}>in {build.duration}s</div>}
                  </td>
                  <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                      <Link href={`/builds/${build.id}`} className="btn btn-secondary" style={{ padding: "0.375rem 0.75rem", fontSize: "0.8125rem" }}>
                        View Logs
                      </Link>
                      {build.status === "SUCCESS" && Number(build.buildNumber) > Number(reviewedBuildNumber) && plugin.status !== "PENDING_REVIEW" && (
                        <Link href={`/builds/${build.id}/submit`} className="btn btn-primary" style={{ padding: "0.375rem 0.75rem", fontSize: "0.8125rem", gap: "4px" }}>
                          <Send size={14} /> Submit
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

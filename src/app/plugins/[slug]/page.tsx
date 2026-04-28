import { Download, ShieldCheck, Star, CheckCircle, Tag, GitBranch, Terminal, Activity, Copy, Shield, Zap } from "lucide-react";
import MarkdownTabs from "@/components/MarkdownTabs";
import PluginAnalyticsChart from "@/components/PluginAnalyticsChart";
import DependencyGraph from "@/components/DependencyGraph";
import CompatibilityChecker from "@/components/CompatibilityChecker";
import PluginRatings from "@/components/PluginRatings";
import PluginImage from "@/components/PluginImage";
import VersionSelector from "@/components/VersionSelector";
import NewVersionForm from "@/components/NewVersionForm";
import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getPlugin(slug: string) {
  const { data } = await fetchApi(`/api/v1/plugins/${slug}`);
  return data?.data || null;
}

export default async function PluginDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const plugin = await getPlugin(params.slug);

  if (!plugin) return notFound();

  const safeScore = plugin.trustScore || 0;
  const scoreClass = safeScore >= 90 ? 'var(--status-success)' : safeScore >= 60 ? 'var(--status-warning)' : 'var(--status-error)';
  const latestVersion = plugin.versions?.[0];
  const isAuthor = session?.user?.id === plugin.authorId;

  const getRoleStyle = (role: string) => {
    switch(role) {
      case "COLLABORATOR": return { background: "rgba(16, 185, 129, 0.1)", color: "var(--status-success)", border: "1px solid rgba(16, 185, 129, 0.2)" };
      case "CONTRIBUTOR": return { background: "rgba(14, 165, 233, 0.1)", color: "var(--accent-cyan)", border: "1px solid rgba(14, 165, 233, 0.2)" };
      case "TRANSLATOR": return { background: "rgba(168, 85, 247, 0.1)", color: "var(--accent-purple)", border: "1px solid rgba(168, 85, 247, 0.2)" };
      case "REQUESTER": return { background: "rgba(245, 158, 11, 0.1)", color: "var(--status-warning)", border: "1px solid rgba(245, 158, 11, 0.2)" };
      default: return { background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border-color)" };
    }
  };

  return (
    <div className="container" style={{ padding: "var(--space-8) 0" }}>
      {/* Header Section */}
      <div className="card" style={{ padding: "var(--space-8)", marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", gap: "var(--space-6)" }}>
            <div style={{
              width: "100px", height: "100px", borderRadius: "var(--radius-lg)",
              background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--border-color)", flexShrink: 0, overflow: "hidden"
            }}>
              <PluginImage iconUrl={plugin.iconUrl} repoUrl={plugin.repoUrl} alt={`${plugin.displayName} icon`} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <h1 className="heading-2" style={{ margin: 0 }}>{plugin.displayName}</h1>
                {plugin.qualityBadge === "VERIFIED" && (
                  <span className="badge badge-cyan" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={14} /> VERIFIED
                  </span>
                )}
              </div>
              <p style={{ color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
                by {plugin.author?.displayName || plugin.author?.username || "Unknown"}
              </p>
              <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)", maxWidth: "600px", lineHeight: 1.6 }}>
                {plugin.description}
              </p>
            </div>
          </div>

          {/* Download Button & Version Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", alignItems: "flex-end" }}>
            <VersionSelector slug={plugin.slug} versions={plugin.versions} />
            <div style={{ display: "flex", gap: "var(--space-6)", marginTop: "var(--space-2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                <Star size={16} color="var(--status-warning)" /> {(plugin.stars || 0).toLocaleString()}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                <Download size={16} color="var(--text-muted)" /> {(plugin.downloads || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}>
        {/* Main Content */}
        <div style={{ flex: "1 1 0%", minWidth: "0", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>

          {/* Quick Install */}
          <div className="card" style={{ padding: "var(--space-5)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Terminal size={18} color="var(--accent-cyan)" /> Quick Install (CLI)
            </h3>
            <div style={{
              background: "#0f172a", color: "#e2e8f0", padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono)", fontSize: "0.875rem",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <code>endgit install {plugin.slug}</code>
              <Copy size={16} color="var(--text-muted)" style={{ cursor: "pointer" }} />
            </div>
          </div>

          {/* What's New */}
          {latestVersion && latestVersion.changelog && (
            <div className="card" style={{ padding: "var(--space-5)" }}>
              <h3 style={{ fontWeight: 600, marginBottom: "var(--space-3)", fontSize: "1rem" }}>
                What's New in v{latestVersion.version}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", whiteSpace: "pre-wrap", margin: 0, fontFamily: "var(--font-mono)" }}>
                {latestVersion.changelog}
              </p>
            </div>
          )}

          {/* About */}
          <div className="card" style={{ padding: "0", border: "none", background: "transparent" }}>
            <MarkdownTabs markdown={plugin.longDescription || plugin.description} />
          </div>

          {/* Analytics Chart */}
          <PluginAnalyticsChart slug={plugin.slug} />

          {/* Ratings & Reviews */}
          <PluginRatings slug={plugin.slug} />
        </div>

        {/* Right Sidebar */}
        <aside style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>

          {/* Safe Score Card */}
          <div className="card" style={{ padding: "var(--space-5)", background: "var(--bg-secondary)", borderColor: "var(--border-highlight)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <h3 style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Shield size={18} color={scoreClass} /> Safe Score
              </h3>
              <div style={{
                background: "var(--bg-card)", border: `2px solid ${scoreClass}`,
                color: scoreClass, fontWeight: 700, fontSize: "1.25rem",
                width: "48px", height: "48px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 15px rgba(16, 185, 129, 0.1)`
              }}>
                {safeScore}
              </div>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Based on automated CI tests and static analysis.
            </p>
          </div>

          {/* Producers */}
          {latestVersion && latestVersion.producers && latestVersion.producers.length > 0 && (
            <div className="card" style={{ padding: "var(--space-5)" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "6px" }}>
                Producers
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {latestVersion.producers.map((producer: any) => (
                  <div key={producer.githubUser} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img 
                      src={`https://github.com/${producer.githubUser}.png?size=40`} 
                      alt={producer.githubUser} 
                      style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", background: "var(--bg-secondary)" }} 
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <a href={`https://github.com/${producer.githubUser}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none" }}>
                        @{producer.githubUser}
                      </a>
                      <span style={{ 
                        fontSize: "0.625rem", 
                        textTransform: "uppercase",
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        display: "inline-block",
                        marginTop: "2px",
                        width: "fit-content",
                        ...getRoleStyle(producer.role)
                      }}>
                        {producer.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="card" style={{ padding: "var(--space-5)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "var(--space-4)" }}>Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Type</span>
                <span style={{ fontWeight: 600, textTransform: "uppercase" }}>{plugin.pluginType}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--text-muted)" }}>License</span>
                <span style={{ fontWeight: 600 }}>{plugin.license || "—"}</span>
              </div>
              {latestVersion && latestVersion.supportedApis && latestVersion.supportedApis.length > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Endstone API</span>
                  <span style={{ fontWeight: 600 }}>{latestVersion.supportedApis.join(", ")}</span>
                </div>
              )}
              {plugin.repoUrl && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Repository</span>
                  <a href={plugin.repoUrl} style={{ color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 500 }}>
                    <GitBranch size={14} /> GitHub
                  </a>
                </div>
              )}
            </div>

            {/* Tags */}
            {plugin.tags && plugin.tags.length > 0 && (
              <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-color)" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "var(--space-2)" }}>Tags</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {plugin.tags.map((tag: string) => (
                    <span key={tag} className="badge badge-outline" style={{ fontSize: "0.75rem" }}>
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Review Status */}
            <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-color)" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "var(--space-2)" }}>Review Status</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: plugin.status === "APPROVED" ? "var(--status-success)" : "var(--status-warning)", fontSize: "0.875rem" }}>
                <CheckCircle size={16} /> {plugin.status === "APPROVED" ? "Approved" : plugin.status}
              </div>
            </div>
          </div>

          {/* Compatibility Checker */}
          <CompatibilityChecker slug={plugin.slug} />

          {/* Dependency Graph */}
          <DependencyGraph slug={plugin.slug} />
        </aside>
      </div>
    </div>
  );
}

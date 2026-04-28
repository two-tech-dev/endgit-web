import { PackagePlus, Settings, Activity, Upload, AlertCircle } from "lucide-react";
import PluginImage from "@/components/PluginImage";

import { fetchApi } from "@/lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Fetch real data from backend
  const [pluginsRes, statsRes] = await Promise.all([
    fetchApi("/api/v1/dashboard/plugins"),
    fetchApi("/api/v1/dashboard/stats")
  ]);
  
  const stats = statsRes.data?.data || {
    totalPlugins: 0,
    totalDownloads: 0,
    totalVersions: 0,
    pendingReviews: 0,
  };

  const myPlugins: any[] = pluginsRes.data?.data || [];

  return (
    <div className="container" style={{ padding: "var(--space-8) 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)" }}>
        <div>
          <h1 className="heading-2">Developer Dashboard</h1>
          <p className="text-muted">Manage your plugins and track performance.</p>
        </div>
        <a href="/dashboard/upload" className="btn btn-primary">
          <Upload size={18} /> Publish New Plugin
        </a>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-6)", marginBottom: "var(--space-10)" }}>
        <div className="card" style={{ padding: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ background: "rgba(124, 58, 237, 0.1)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", color: "var(--accent-purple)" }}>
            <PackagePlus size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Total Plugins</div>
            <div className="heading-2">{stats.totalPlugins}</div>
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ background: "rgba(6, 182, 212, 0.1)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", color: "var(--accent-cyan)" }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Total Downloads</div>
            <div className="heading-2">{stats.totalDownloads.toLocaleString()}</div>
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", color: "var(--status-warning)" }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Pending Review</div>
            <div className="heading-2">{stats.pendingReviews}</div>
          </div>
        </div>
      </div>

      {/* Plugins List */}
      <h2 className="heading-3" style={{ marginBottom: "var(--space-6)" }}>My Plugins</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
        {myPlugins.map(plugin => (
          <div key={plugin.id} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Status Bar */}
            <div style={{ height: "4px", width: "100%", background: plugin.status === "APPROVED" ? "var(--status-success)" : "var(--status-warning)" }} />
            
            <div style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", flex: 1, gap: "var(--space-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                  <div style={{ 
                    width: "48px", height: "48px", borderRadius: "var(--radius-sm)", 
                    background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid var(--border-color)", flexShrink: 0, overflow: "hidden"
                  }}>
                    <PluginImage iconUrl={plugin.iconUrl} repoUrl={plugin.repoUrl} alt={`${plugin.displayName} icon`} />
                  </div>
                  <div>
                    <a href={`/plugins/${plugin.name}`} className="heading-3" style={{ fontSize: "1.25rem", color: "var(--text-primary)", display: "block", marginBottom: "var(--space-1)" }}>
                      {plugin.displayName}
                    </a>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>v{plugin.latestVersion || "0.0.0"}</span>
                  </div>
                </div>
                <span className={`badge ${plugin.pluginType === "PYTHON" ? "badge-green" : "badge-purple"}`}>{plugin.pluginType}</span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", padding: "var(--space-4) 0", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Downloads</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 500, color: "var(--text-primary)" }}>
                    <Activity size={14} color="var(--accent-cyan)" /> {plugin.downloads.toLocaleString()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Latest Version</div>
                  <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {plugin.latestVersion ? `v${plugin.latestVersion}` : "No versions"}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</div>
                  <div style={{ fontWeight: 500, color: plugin.status === "APPROVED" ? "var(--status-success)" : "var(--status-warning)" }}>{plugin.status}</div>
                </div>
              </div>

              <div style={{ marginTop: "auto" }}>
                {plugin.status === "PENDING_REVIEW" ? (
                  <div style={{ 
                    width: "100%", background: "var(--status-warning)", color: "#000",
                    fontWeight: 600, padding: "0.5rem", borderRadius: "var(--radius-sm)",
                    textAlign: "center"
                  }}>
                    Submitted
                  </div>
                ) : (
                  <button className="btn btn-secondary" style={{ width: "100%", display: "flex", justifyContent: "center", padding: "0.5rem" }}>
                    <Settings size={16} /> Manage Plugin
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        

      </div>
    </div>
  );
}

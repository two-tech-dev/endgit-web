"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PluginImage from "@/components/PluginImage";
import {
  Users, Shield, BarChart3, AlertTriangle, CheckCircle, XCircle,
  Search, Eye, Clock, Package, Activity, Loader2
} from "lucide-react";

const TRUST_LEVELS = ["NEW", "TRUSTED", "FLAGGED", "ADMIN"];
const TRUST_COLORS: Record<string, { bg: string; color: string }> = {
  ADMIN: { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  TRUSTED: { bg: "rgba(16,185,129,0.1)", color: "var(--status-success)" },
  NEW: { bg: "rgba(100,116,139,0.1)", color: "var(--text-muted)" },
  FLAGGED: { bg: "rgba(239,68,68,0.1)", color: "var(--status-error)" },
};

export default function AdminPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [tab, setTab] = useState<"users" | "queue" | "plugins" | "system">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, plugins: 0, builds: 0, pendingReviews: 0 });
  const [userSearch, setUserSearch] = useState("");
  const [pluginSearch, setPluginSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const token = (session?.user as any)?.apiToken || "";

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    loadData();
  }, [sessionStatus, tab]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      if (tab === "users") {
        const res = await fetch(`${apiUrl}/api/v1/admin/users?search=${userSearch}`, { headers });
        const json = await res.json();
        if (json.success) setUsers(json.data);
        else setError(json.error);
      } else if (tab === "queue") {
        const res = await fetch(`${apiUrl}/api/v1/reviews/admin/queue`, { headers });
        const json = await res.json();
        if (json.success) setQueue(json.data);
        else setError(json.error);
      } else if (tab === "plugins") {
        const res = await fetch(`${apiUrl}/api/v1/admin/plugins?search=${pluginSearch}`, { headers });
        const json = await res.json();
        if (json.success) setPlugins(json.data);
        else setError(json.error);
      } else {
        const res = await fetch(`${apiUrl}/api/v1/admin/stats`, { headers });
        const json = await res.json();
        if (json.success) setStats(json.data);
        else setError(json.error);
      }
    } catch {
      setError("Failed to connect to API. Admin access required.");
    } finally {
      setLoading(false);
    }
  };

  const changeTrustLevel = async (userId: string, newLevel: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/users/${userId}/trust`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ trustLevel: newLevel })
      });
      const json = await res.json();
      if (json.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, trustLevel: newLevel } : u));
      }
    } catch { /* noop */ }
  };

  const reviewPlugin = async (slug: string, decision: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/reviews/${slug}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ decision, comment: `${decision} by admin` })
      });
      const json = await res.json();
      if (json.success) {
        setQueue(prev => prev.filter(p => p.slug !== slug));
      }
    } catch { /* noop */ }
  };

  const changePluginStatus = async (pluginId: string, newStatus: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/plugins/${pluginId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        setPlugins(prev => prev.map(p => p.id === pluginId ? { ...p, status: newStatus } : p));
      }
    } catch { /* noop */ }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <Loader2 size={32} color="#8b5cf6" style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <Shield size={48} color="#8b5cf6" style={{ margin: "0 auto var(--space-4)" }} />
        <h2 className="heading-3">Admin Access Required</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "var(--space-2)" }}>Please sign in with an admin account.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "var(--space-8) 0", maxWidth: "1100px" }}>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1 className="heading-2" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Shield size={28} color="#8b5cf6" /> Admin Panel
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
          Manage users, review queue, and system settings
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", background: "var(--bg-secondary)", padding: "3px", borderRadius: "var(--radius-md)", marginBottom: "var(--space-6)", width: "fit-content" }}>
        {([
          { key: "users", label: "Users", icon: <Users size={14} /> },
          { key: "queue", label: "Review Queue", icon: <Eye size={14} /> },
          { key: "plugins", label: "Plugins", icon: <Package size={14} /> },
          { key: "system", label: "System", icon: <BarChart3 size={14} /> },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)",
            fontSize: "0.8125rem", fontWeight: 500, border: "none", cursor: "pointer",
            background: tab === t.key ? "var(--bg-card)" : "transparent",
            color: tab === t.key ? "var(--text-primary)" : "var(--text-muted)",
            boxShadow: tab === t.key ? "var(--shadow-sm)" : "none",
            transition: "all 150ms"
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)", borderLeft: "4px solid var(--status-error)" }}>
          <p style={{ color: "var(--status-error)", fontSize: "0.875rem" }}>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "var(--space-12)" }}>
          <Loader2 size={32} color="#8b5cf6" style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Users Tab */}
      {!loading && tab === "users" && (
        <div>
          <div style={{ marginBottom: "var(--space-4)", position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input type="text" placeholder="Search users..." value={userSearch}
              onChange={e => { setUserSearch(e.target.value); }}
              onKeyDown={e => { if (e.key === "Enter") loadData(); }}
              style={{ width: "100%", maxWidth: "400px", padding: "0.625rem 0.75rem 0.625rem 2.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.875rem", outline: "none" }} />
          </div>

          {users.length === 0 ? (
            <div className="card" style={{ padding: "var(--space-12)", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)" }}>No users found</p>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
                    {["User", "Trust Level", "Plugins", "Reviews", "Joined", "Actions"].map(h => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700, overflow: "hidden" }}>
                            {user.avatarUrl ? <img src={user.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{user.displayName || user.username}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: "0.6875rem", fontWeight: 600, ...(TRUST_COLORS[user.trustLevel] || TRUST_COLORS.NEW) }}>
                          {user.trustLevel}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{user._count?.plugins || 0}</td>
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{user._count?.reviews || 0}</td>
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <select value={user.trustLevel} onChange={e => changeTrustLevel(user.id, e.target.value)}
                          style={{ padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.75rem", cursor: "pointer" }}>
                          {TRUST_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Review Queue Tab */}
      {!loading && tab === "queue" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-6)" }}>
          {queue.length === 0 ? (
            <div className="card" style={{ padding: "var(--space-12)", textAlign: "center", gridColumn: "1 / -1" }}>
              <CheckCircle size={40} color="var(--status-success)" style={{ margin: "0 auto var(--space-3)" }} />
              <p style={{ fontWeight: 600 }}>All caught up!</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No plugins pending review</p>
            </div>
          ) : (
            queue.map((plugin: any) => (
              <a href={`/plugins/${plugin.slug}`} key={plugin.id} className="card" style={{ 
                padding: "0", 
                display: "flex", 
                flexDirection: "column", 
                textDecoration: "none",
                overflow: "hidden",
                borderTop: "4px solid var(--status-warning)"
              }}>
                <div style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                      <div style={{ 
                        width: "48px", height: "48px", borderRadius: "var(--radius-md)", 
                        background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid var(--border-color)", flexShrink: 0, overflow: "hidden"
                      }}>
                        <PluginImage iconUrl={plugin.iconUrl} repoUrl={plugin.repoUrl} alt={`${plugin.displayName} icon`} />
                      </div>
                      <div>
                        <h3 className="heading-3" style={{ fontSize: "1.125rem", margin: 0, color: "var(--text-primary)" }}>
                          {plugin.displayName}
                        </h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>@{plugin.author.username}</p>
                      </div>
                    </div>
                    <span className={`badge ${plugin.pluginType === "PYTHON" ? "badge-green" : "badge-purple"}`}>{plugin.pluginType}</span>
                  </div>

                  <p style={{ 
                    color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.5,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                  }}>
                    {plugin.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "var(--space-2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                      <AlertTriangle size={14} color="var(--status-warning)" />
                      Pending v{plugin.versions?.[0]?.version || "unknown"}
                    </div>
                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                      {new Date(plugin.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--border-color)" }}>
                    <button onClick={(e) => { e.preventDefault(); reviewPlugin(plugin.slug, "APPROVED"); }} style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      padding: "0.5rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 600,
                      background: "var(--status-success)", color: "white", border: "none", cursor: "pointer"
                    }}>
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button onClick={(e) => { e.preventDefault(); reviewPlugin(plugin.slug, "REJECTED"); }} style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      padding: "0.5rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 600,
                      background: "rgba(239,68,68,0.1)", color: "var(--status-error)", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer"
                    }}>
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      )}

      {/* Plugins Tab */}
      {!loading && tab === "plugins" && (
        <div className="card" style={{ padding: "var(--space-6)" }}>
          <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "var(--space-3)", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search plugins by name or slug..."
                className="input"
                style={{ paddingLeft: "var(--space-10)" }}
                value={pluginSearch}
                onChange={e => setPluginSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && loadData()}
              />
            </div>
            <button onClick={loadData} className="btn btn-secondary">Search</button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ padding: "0 var(--space-4) var(--space-3)", color: "var(--text-muted)", fontSize: "0.8125rem" }}>Plugin</th>
                <th style={{ padding: "0 var(--space-4) var(--space-3)", color: "var(--text-muted)", fontSize: "0.8125rem" }}>Author</th>
                <th style={{ padding: "0 var(--space-4) var(--space-3)", color: "var(--text-muted)", fontSize: "0.8125rem" }}>Status</th>
                <th style={{ padding: "0 var(--space-4) var(--space-3)", color: "var(--text-muted)", fontSize: "0.8125rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plugins.map((plugin: any) => (
                <tr key={plugin.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--space-4)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <div style={{ fontWeight: 600 }}>{plugin.displayName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{plugin.slug}</div>
                    </div>
                  </td>
                  <td style={{ padding: "var(--space-4)", fontSize: "0.875rem" }}>
                    {plugin.author?.displayName || plugin.author?.username}
                  </td>
                  <td style={{ padding: "var(--space-4)" }}>
                    <select
                      value={plugin.status}
                      onChange={(e) => changePluginStatus(plugin.id, e.target.value)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        fontSize: "0.8125rem",
                        cursor: "pointer",
                      }}
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                      <option value="FLAGGED">FLAGGED</option>
                    </select>
                  </td>
                  <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                    <a href={`/plugins/${plugin.slug}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>
                      View
                    </a>
                  </td>
                </tr>
              ))}
              {plugins.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--text-muted)" }}>
                    No plugins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* System Tab */}
      {!loading && tab === "system" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}>
          {[
            { label: "Total Users", value: stats.users, icon: <Users size={20} color="var(--accent-purple)" />, bg: "rgba(139,92,246,0.08)" },
            { label: "Total Plugins", value: stats.plugins, icon: <Package size={20} color="var(--accent-cyan)" />, bg: "rgba(14,165,233,0.08)" },
            { label: "Total Builds", value: stats.builds, icon: <Activity size={20} color="var(--status-success)" />, bg: "rgba(16,185,129,0.08)" },
            { label: "Pending Reviews", value: stats.pendingReviews, icon: <AlertTriangle size={20} color="var(--status-warning)" />, bg: "rgba(245,158,11,0.08)" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: "var(--space-6)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-md)", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  GitBranch, Activity, Search, Settings,
  ToggleLeft, ToggleRight, ExternalLink, Lock, Globe, 
  Code, Loader2
} from "lucide-react";

interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  isPrivate: boolean;
  htmlUrl: string;
  defaultBranch: string;
  stargazersCount: number;
  updatedAt: string;
  ciEnabled: boolean;
  pluginId: string | null;
  pluginSlug: string | null;
  pluginStatus: string | null;
}

export default function DevDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState<number | null>(null);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    fetchRepos();
  }, [sessionStatus]);

  const fetchRepos = async () => {
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = (session?.user as any)?.apiToken;
      const res = await fetch(`${apiUrl}/api/v1/github/repos`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const json = await res.json();
      if (json.success) {
        setRepos(json.data);
      } else {
        setError(json.error || "Failed to fetch repos");
      }
    } catch (err) {
      setError("Failed to connect to API. Make sure you're signed in with GitHub.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCI = async (repo: Repo) => {
    setToggling(repo.id);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const token = (session?.user as any)?.apiToken;

    try {
      if (repo.ciEnabled && repo.pluginId) {
        // Disable CI
        await fetch(`${apiUrl}/api/v1/github/repos/${repo.pluginId}/disable`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
      } else {
        // Enable CI
        await fetch(`${apiUrl}/api/v1/github/repos/${repo.id}/enable`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            name: repo.name, fullName: repo.fullName, htmlUrl: repo.htmlUrl,
            language: repo.language, defaultBranch: repo.defaultBranch, description: repo.description
          })
        });
      }
      // Refresh
      await fetchRepos();
    } catch {
      // noop
    } finally {
      setToggling(null);
    }
  };

  const filteredRepos = repos.filter(r => {
    if (filter === "enabled" && !r.ciEnabled) return false;
    if (filter === "disabled" && r.ciEnabled) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const enabledCount = repos.filter(r => r.ciEnabled).length;
  const disabledCount = repos.filter(r => !r.ciEnabled).length;

  const langColor = (lang: string | null) => {
    switch (lang) {
      case "Python": return "#3572A5";
      case "C++": return "#f34b7d";
      case "TypeScript": return "#3178c6";
      case "JavaScript": return "#f1e05a";
      default: return "#8b949e";
    }
  };

  const statusBadge = (status: string | null) => {
    switch (status) {
      case "APPROVED": return { bg: "rgba(16,185,129,0.1)", color: "var(--status-success)", text: "Approved" };
      case "PENDING_REVIEW": return { bg: "rgba(245,158,11,0.1)", color: "var(--status-warning)", text: "Pending Review" };
      case "REJECTED": return { bg: "rgba(239,68,68,0.1)", color: "var(--status-error)", text: "Rejected" };
      case "DRAFT": return { bg: "rgba(100,116,139,0.1)", color: "var(--text-muted)", text: "Draft" };
      default: return null;
    }
  };

  const timeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  if (sessionStatus === "loading") {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <Loader2 size={32} color="var(--accent-cyan)" style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <h2 className="heading-3">Sign in Required</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "var(--space-2)" }}>Please sign in with GitHub to access the Dev Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "var(--space-8) 0", maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 className="heading-2" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Settings size={28} color="var(--accent-cyan)" /> Dev Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            Manage your GitHub repositories and CI/CD pipelines
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div className="card" style={{ padding: "var(--space-5)" }}>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "4px" }}>Total Repos</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)" }}>{repos.length}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-5)" }}>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "4px" }}>CI Enabled</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--status-success)" }}>{enabledCount}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-5)" }}>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "4px" }}>Disabled</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{disabledCount}</div>
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-5)", alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input type="text" placeholder="Search repositories..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "0.625rem 0.75rem 0.625rem 2.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.875rem", outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: "2px", background: "var(--bg-secondary)", padding: "3px", borderRadius: "var(--radius-md)" }}>
          {(["all", "enabled", "disabled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "0.375rem 0.875rem", borderRadius: "var(--radius-sm)",
              fontSize: "0.8125rem", fontWeight: 500, textTransform: "capitalize",
              background: filter === f ? "var(--bg-card)" : "transparent",
              color: filter === f ? "var(--text-primary)" : "var(--text-muted)",
              boxShadow: filter === f ? "var(--shadow-sm)" : "none",
              border: "none", cursor: "pointer", transition: "all 150ms"
            }}>
              {f} {f === "all" ? `(${repos.length})` : f === "enabled" ? `(${enabledCount})` : `(${disabledCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div style={{ textAlign: "center", padding: "var(--space-12)" }}>
          <Loader2 size={32} color="var(--accent-cyan)" style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <p style={{ color: "var(--text-muted)", marginTop: "var(--space-3)" }}>Fetching your repositories from GitHub...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div className="card" style={{ padding: "var(--space-6)", textAlign: "center", borderLeft: "4px solid var(--status-error)" }}>
          <p style={{ color: "var(--status-error)", fontWeight: 600 }}>{error}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "var(--space-2)" }}>
            Make sure the API server is running and you are signed in with GitHub OAuth.
          </p>
        </div>
      )}

      {/* Repo List */}
      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {filteredRepos.map(repo => {
            const badge = statusBadge(repo.pluginStatus);
            return (
              <div key={repo.id} className="card" style={{
                padding: "var(--space-5)",
                borderLeft: `3px solid ${repo.ciEnabled ? "var(--status-success)" : "var(--border-color)"}`,
                transition: "all 200ms"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flex: 1 }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "var(--radius-md)",
                      background: `${langColor(repo.language)}15`, border: `1px solid ${langColor(repo.language)}30`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      <Code size={18} color={langColor(repo.language)} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary)" }}>{repo.name}</span>
                        {repo.isPrivate ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.6875rem", padding: "1px 6px", borderRadius: "var(--radius-full)", background: "rgba(245,158,11,0.1)", color: "var(--status-warning)", border: "1px solid rgba(245,158,11,0.2)" }}>
                            <Lock size={10} /> Private
                          </span>
                        ) : (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.6875rem", padding: "1px 6px", borderRadius: "var(--radius-full)", background: "rgba(16,185,129,0.08)", color: "var(--text-muted)" }}>
                            <Globe size={10} /> Public
                          </span>
                        )}
                        {repo.language && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.6875rem" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: langColor(repo.language), display: "inline-block" }} />
                            <span style={{ color: "var(--text-muted)" }}>{repo.language}</span>
                          </span>
                        )}
                        {badge && (
                          <span style={{ fontSize: "0.6875rem", padding: "1px 8px", borderRadius: "var(--radius-full)", background: badge.bg, color: badge.color, fontWeight: 600 }}>
                            {badge.text}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "500px" }}>
                        {repo.description || "No description"}
                      </p>
                      <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "4px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <span>⭐ {repo.stargazersCount}</span>
                        <span><GitBranch size={11} style={{ verticalAlign: "-1px" }} /> {repo.defaultBranch}</span>
                        <span>Updated {timeAgo(repo.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexShrink: 0 }}>
                    {repo.ciEnabled && repo.pluginSlug && (
                      <a href={`/plugins/${repo.pluginSlug}/builds`} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.8125rem", color: "var(--accent-cyan)", fontWeight: 500 }}>
                        View Builds <ExternalLink size={12} />
                      </a>
                    )}
                    <button onClick={() => toggleCI(repo)} disabled={toggling === repo.id} style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "0.4375rem 1rem", borderRadius: "var(--radius-md)",
                      fontSize: "0.8125rem", fontWeight: 600, cursor: toggling === repo.id ? "wait" : "pointer",
                      transition: "all 200ms", border: "none",
                      background: repo.ciEnabled ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                      color: repo.ciEnabled ? "var(--status-error)" : "var(--status-success)",
                      opacity: toggling === repo.id ? 0.5 : 1
                    }}>
                      {repo.ciEnabled ? <><ToggleRight size={16} /> Disable CI</> : <><ToggleLeft size={16} /> Enable CI</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRepos.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "1rem" }}>No repositories found</p>
              <p style={{ fontSize: "0.875rem", marginTop: "var(--space-2)" }}>
                {search ? "Try a different search term" : "No GitHub repositories detected"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

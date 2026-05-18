"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  GitBranch,
  Activity,
  Search,
  Settings,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Lock,
  Globe,
  Code,
  Loader2,
  PackagePlus,
  ArrowRight,
  ChevronDown,
  Building2,
} from "lucide-react";

interface OrgSummary {
  id: number;
  login: string;
  description: string | null;
  avatarUrl: string;
  url: string;
}

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
  const [hasAppInstalled, setHasAppInstalled] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalEnabled, setTotalEnabled] = useState(0);
  const [totalDisabled, setTotalDisabled] = useState(0);
  const [quota, setQuota] = useState<{
    used: number;
    limit: number;
    resetsAt: string;
  } | null>(null);
  const [orgs, setOrgs] = useState<OrgSummary[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [orgsError, setOrgsError] = useState("");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    fetchRepos(1, null);
    fetchOrgs();
  }, [sessionStatus]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        orgDropdownRef.current &&
        !orgDropdownRef.current.contains(e.target as Node)
      ) {
        setOrgDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchOrgs = async () => {
    setOrgsLoading(true);
    setOrgsError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = (session?.user as any)?.apiToken;
      const res = await fetch(`${apiUrl}/api/v1/github/orgs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setOrgs(json.data);
      } else {
        setOrgsError(json.error || "Failed to fetch organizations");
      }
    } catch {
      setOrgsError("Failed to load organizations");
    } finally {
      setOrgsLoading(false);
    }
  };

  const fetchRepos = async (
    pageNumber: number = 1,
    org: string | null = selectedOrg,
  ) => {
    if (pageNumber === 1) setLoading(true);
    else setIsFetchingMore(true);

    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = (session?.user as any)?.apiToken;

      if (pageNumber === 1 && hasAppInstalled === null) {
        const statusRes = await fetch(`${apiUrl}/api/v1/dashboard/status`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const statusJson = await statusRes.json();

        if (!statusJson.success) {
          setError(statusJson.error || "Failed to check installation status.");
          setLoading(false);
          setIsFetchingMore(false);
          return;
        }

        if (!statusJson.data.hasAppInstalled) {
          setHasAppInstalled(false);
          setLoading(false);
          setIsFetchingMore(false);
          return;
        }
        setHasAppInstalled(true);
        if (statusJson.data.quota) {
          setQuota(statusJson.data.quota);
        }
      }

      const orgParam = org ? `&org=${encodeURIComponent(org)}` : "";
      const res = await fetch(
        `${apiUrl}/api/v1/github/repos?page=${pageNumber}&per_page=10${orgParam}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      const json = await res.json();
      if (json.success) {
        if (pageNumber === 1) {
          setRepos(json.data);
        } else {
          setRepos((prev) => [...prev, ...json.data]);
        }
        setHasMore(json.pagination?.hasMore || false);
        setPage(pageNumber);
        if (json.pagination?.totalCount !== undefined) {
          setTotalCount(json.pagination.totalCount);
        }
        if (json.pagination?.totalEnabled !== undefined) {
          setTotalEnabled(json.pagination.totalEnabled);
        }
        if (json.pagination?.totalDisabled !== undefined) {
          setTotalDisabled(json.pagination.totalDisabled);
        }
      } else {
        setError(json.error || "Failed to fetch repos");
      }
    } catch (err) {
      setError(
        "Failed to connect to API. Make sure you're signed in with GitHub.",
      );
    } finally {
      if (pageNumber === 1) setLoading(false);
      else setIsFetchingMore(false);
    }
  };

  const handleOrgChange = (orgLogin: string | null) => {
    setSelectedOrg(orgLogin);
    setOrgDropdownOpen(false);
    fetchRepos(1, orgLogin);
  };

  const toggleCI = async (repo: Repo) => {
    setToggling(repo.id);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const token = (session?.user as any)?.apiToken;

    try {
      let res;
      if (repo.ciEnabled && repo.pluginId) {
        // Disable CI
        res = await fetch(
          `${apiUrl}/api/v1/github/repos/${repo.pluginId}/disable`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        // Enable CI
        res = await fetch(`${apiUrl}/api/v1/github/repos/${repo.id}/enable`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: repo.name,
            fullName: repo.fullName,
            htmlUrl: repo.htmlUrl,
            language: repo.language,
            defaultBranch: repo.defaultBranch,
            description: repo.description,
          }),
        });
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        if (
          json.error &&
          json.error.includes(
            "EndGit GitHub App is installed on the organization",
          )
        ) {
          const installUrl =
            process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ||
            "https://github.com/apps/endgit-local-dev/installations/new";
          window.location.href = installUrl;
          return;
        }

        alert(
          `Failed to ${repo.ciEnabled ? "disable" : "enable"} CI:\n${json.error || "Unknown error"}`,
        );
        setToggling(null);
        return;
      }

      // Refresh current repos by reloading page 1
      await fetchRepos(1, selectedOrg);
    } catch (err: any) {
      alert(`An error occurred while toggling CI: ${err.message}`);
    } finally {
      setToggling(null);
    }
  };

  const filteredRepos = repos.filter((r) => {
    if (filter === "enabled" && !r.ciEnabled) return false;
    if (filter === "disabled" && r.ciEnabled) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const enabledCount = repos.filter((r) => r.ciEnabled).length;
  const disabledCount = repos.filter((r) => !r.ciEnabled).length;
  const displayTotal = totalCount || repos.length;
  const displayEnabled = totalEnabled || enabledCount;
  const displayDisabled = totalDisabled || disabledCount;

  const langColor = (lang: string | null) => {
    switch (lang) {
      case "Python":
        return "#3572A5";
      case "C++":
        return "#f34b7d";
      case "TypeScript":
        return "#3178c6";
      case "JavaScript":
        return "#f1e05a";
      default:
        return "#8b949e";
    }
  };

  const statusBadge = (status: string | null) => {
    switch (status) {
      case "APPROVED":
        return {
          bg: "rgba(16,185,129,0.1)",
          color: "var(--status-success)",
          text: "Approved",
        };
      case "PENDING_REVIEW":
        return {
          bg: "rgba(245,158,11,0.1)",
          color: "var(--status-warning)",
          text: "Pending Review",
        };
      case "REJECTED":
        return {
          bg: "rgba(239,68,68,0.1)",
          color: "var(--status-error)",
          text: "Rejected",
        };
      case "DRAFT":
        return {
          bg: "rgba(100,116,139,0.1)",
          color: "var(--text-muted)",
          text: "Draft",
        };
      default:
        return null;
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
      <div
        className="container"
        style={{
          paddingTop: "var(--space-16)",
          paddingBottom: "var(--space-16)",
          textAlign: "center",
        }}
      >
        <Loader2
          size={32}
          color="var(--accent-cyan)"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div
        className="container"
        style={{
          paddingTop: "var(--space-16)",
          paddingBottom: "var(--space-16)",
          textAlign: "center",
        }}
      >
        <h2 className="heading-3">Sign in Required</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "var(--space-2)" }}>
          Please sign in with GitHub to access the Dev Dashboard.
        </p>
      </div>
    );
  }

  if (hasAppInstalled === false) {
    const installUrl =
      process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ||
      "https://github.com/apps/endgit-app/installations/new";
    return (
      <div
        className="container"
        style={{
          paddingTop: "var(--space-12)",
          paddingBottom: "var(--space-12)",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: "600px",
            padding: "var(--space-10)",
            textAlign: "center",
            border: "1px solid var(--border-highlight)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(124, 58, 237, 0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-6)",
            }}
          >
            <PackagePlus size={40} color="var(--accent-purple)" />
          </div>
          <h1 className="heading-2" style={{ marginBottom: "var(--space-4)" }}>
            Welcome to EndGit!
          </h1>
          <p
            className="text-secondary"
            style={{
              fontSize: "1.125rem",
              lineHeight: 1.6,
              marginBottom: "var(--space-8)",
            }}
          >
            To enable CI/CD pipelines, you must install the EndGit GitHub App on
            your repositories. The app will automatically detect your Bedrock
            plugins, build them, and publish them to the marketplace.
          </p>
          <a
            href={installUrl}
            className="btn btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.125rem",
              padding: "0.75rem 2rem",
            }}
          >
            <ExternalLink size={20} /> Install GitHub App{" "}
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-8)",
        paddingBottom: "var(--space-8)",
        maxWidth: "1100px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-6)",
        }}
      >
        <div>
          <h1
            className="heading-2"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <Settings size={28} color="var(--accent-cyan)" /> Dev Dashboard
          </h1>
          <p
            style={{ color: "var(--text-muted)", marginTop: "var(--space-1)" }}
          >
            Manage your GitHub repositories and CI/CD pipelines
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--space-4)",
          marginBottom: "var(--space-6)",
        }}
      >
        <div className="card" style={{ padding: "var(--space-5)" }}>
          <div
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-muted)",
              marginBottom: "4px",
            }}
          >
            Total Repos
          </div>
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {displayTotal}
          </div>
        </div>
        <div className="card" style={{ padding: "var(--space-5)" }}>
          <div
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-muted)",
              marginBottom: "4px",
            }}
          >
            CI Enabled
          </div>
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--status-success)",
            }}
          >
            {displayEnabled}
          </div>
        </div>
        <div className="card" style={{ padding: "var(--space-5)" }}>
          <div
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-muted)",
              marginBottom: "4px",
            }}
          >
            Disabled
          </div>
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--text-muted)",
            }}
          >
            {displayDisabled}
          </div>
        </div>
      </div>

      {/* Build Quota */}
      {quota && (
        <div
          className="card"
          style={{
            padding: "var(--space-4) var(--space-5)",
            marginBottom: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "0 0 auto" }}>
            <div
              style={{
                fontSize: "0.6875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
                marginBottom: "2px",
              }}
            >
              Weekly Builds
            </div>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color:
                  quota.used >= quota.limit
                    ? "var(--status-error)"
                    : "var(--text-primary)",
              }}
            >
              {quota.used}/{quota.limit}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <div
              style={{
                height: "8px",
                background: "var(--bg-secondary)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, (quota.used / quota.limit) * 100)}%`,
                  height: "100%",
                  borderRadius: "4px",
                  background:
                    quota.used >= quota.limit
                      ? "var(--status-error)"
                      : quota.used >= quota.limit * 0.8
                        ? "var(--status-warning)"
                        : "var(--accent-cyan)",
                  transition: "width 300ms",
                }}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            Resets{" "}
            {new Date(quota.resetsAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </div>
          {quota.used >= quota.limit && (
            <div
              style={{
                width: "100%",
                padding: "var(--space-3)",
                background: "rgba(239,68,68,0.06)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8125rem",
                color: "var(--status-error)",
              }}
            >
              ⚠️ Build quota exceeded. New pushes will not trigger builds until
              the quota resets. Contact an admin to increase your limit.
            </div>
          )}
        </div>
      )}

      {/* Org Selector Section */}
      {orgsLoading && (
        <div
          className="card"
          style={{
            padding: "var(--space-4) var(--space-5)",
            marginBottom: "var(--space-5)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <Loader2
            size={16}
            color="var(--accent-cyan)"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Loading organizations...
          </span>
        </div>
      )}
      {orgsError && !orgsLoading && (
        <div
          className="card"
          style={{
            padding: "var(--space-3) var(--space-5)",
            marginBottom: "var(--space-5)",
            borderLeft: "3px solid var(--status-warning)",
            fontSize: "0.8125rem",
            color: "var(--status-warning)",
          }}
        >
          {orgsError}
        </div>
      )}
      {!orgsLoading && !orgsError && orgs.length > 1 && (
        <div
          className="card"
          style={{
            padding: "var(--space-5)",
            marginBottom: "var(--space-5)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-4)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.6875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--text-muted)",
                  marginBottom: "2px",
                }}
              >
                Organization
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                }}
              >
                {selectedOrg
                  ? `Viewing ${selectedOrg}`
                  : "Viewing all organizations"}
              </div>
            </div>
            <div ref={orgDropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  transition: "border-color 150ms",
                }}
              >
                Switch
                <ChevronDown
                  size={14}
                  color="var(--text-muted)"
                  style={{
                    transform: orgDropdownOpen ? "rotate(180deg)" : "none",
                    transition: "transform 150ms",
                  }}
                />
              </button>
              {orgDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "4px",
                    minWidth: "280px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => handleOrgChange(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      width: "100%",
                      padding: "var(--space-3) var(--space-4)",
                      border: "none",
                      background:
                        selectedOrg === null
                          ? "var(--bg-secondary)"
                          : "transparent",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                      textAlign: "left",
                      transition: "background 100ms",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--bg-secondary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        selectedOrg === null
                          ? "var(--bg-secondary)"
                          : "transparent")
                    }
                  >
                    <Building2 size={18} color="var(--text-muted)" />
                    <span>All organizations</span>
                  </button>
                  {orgs.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => handleOrgChange(org.login)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        width: "100%",
                        padding: "var(--space-3) var(--space-4)",
                        border: "none",
                        borderTop: "1px solid var(--border-color)",
                        background:
                          selectedOrg === org.login
                            ? "var(--bg-secondary)"
                            : "transparent",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        color: "var(--text-primary)",
                        textAlign: "left",
                        transition: "background 100ms",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--bg-secondary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          selectedOrg === org.login
                            ? "var(--bg-secondary)"
                            : "transparent")
                      }
                    >
                      <img
                        src={org.avatarUrl}
                        alt=""
                        width={20}
                        height={20}
                        style={{ borderRadius: "var(--radius-full)" }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500 }}>{org.login}</div>
                        {org.description && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {org.description}
                          </div>
                        )}
                      </div>
                      {selectedOrg === org.login && (
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--accent-cyan)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => handleOrgChange(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-full)",
                border: `1px solid ${selectedOrg === null ? "var(--accent-cyan)" : "var(--border-color)"}`,
                background:
                  selectedOrg === null
                    ? "rgba(6,182,212,0.1)"
                    : "var(--bg-secondary)",
                cursor: "pointer",
                fontSize: "0.8125rem",
                fontWeight: selectedOrg === null ? 600 : 400,
                color:
                  selectedOrg === null
                    ? "var(--accent-cyan)"
                    : "var(--text-muted)",
                transition: "all 150ms",
              }}
            >
              <Building2 size={14} />
              All
            </button>
            {orgs.map((org) => (
              <button
                key={org.id}
                onClick={() => handleOrgChange(org.login)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-full)",
                  border: `1px solid ${selectedOrg === org.login ? "var(--accent-cyan)" : "var(--border-color)"}`,
                  background:
                    selectedOrg === org.login
                      ? "rgba(6,182,212,0.1)"
                      : "var(--bg-secondary)",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  fontWeight: selectedOrg === org.login ? 600 : 400,
                  color:
                    selectedOrg === org.login
                      ? "var(--accent-cyan)"
                      : "var(--text-muted)",
                  transition: "all 150ms",
                }}
              >
                <img
                  src={org.avatarUrl}
                  alt=""
                  width={16}
                  height={16}
                  style={{ borderRadius: "var(--radius-full)" }}
                />
                {org.login}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div
        className="dev-search-filter"
        style={{
          display: "flex",
          gap: "var(--space-3)",
          marginBottom: "var(--space-5)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.625rem 0.75rem 0.625rem 2.25rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "2px",
            background: "var(--bg-secondary)",
            padding: "3px",
            borderRadius: "var(--radius-md)",
          }}
        >
          {(["all", "enabled", "disabled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.5rem 0.875rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                textTransform: "capitalize",
                background: filter === f ? "var(--bg-card)" : "transparent",
                color:
                  filter === f ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: filter === f ? "var(--shadow-sm)" : "none",
                border: "none",
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              {f}{" "}
              {f === "all"
                ? `(${displayTotal})`
                : f === "enabled"
                  ? `(${displayEnabled})`
                  : `(${displayDisabled})`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div style={{ textAlign: "center", padding: "var(--space-12)" }}>
          <Loader2
            size={32}
            color="var(--accent-cyan)"
            style={{ animation: "spin 1s linear infinite", margin: "0 auto" }}
          />
          <p
            style={{ color: "var(--text-muted)", marginTop: "var(--space-3)" }}
          >
            Fetching your repositories from GitHub...
          </p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div
          className="card"
          style={{
            padding: "var(--space-6)",
            textAlign: "center",
            borderLeft: "4px solid var(--status-error)",
          }}
        >
          <p style={{ color: "var(--status-error)", fontWeight: 600 }}>
            {error}
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              marginTop: "var(--space-2)",
            }}
          >
            Make sure the API server is running and you are signed in with
            GitHub OAuth.
          </p>
        </div>
      )}

      {/* Repo List */}
      {!loading && !error && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {filteredRepos.map((repo) => {
            const badge = statusBadge(repo.pluginStatus);
            return (
              <div
                key={repo.id}
                className="card"
                style={{
                  padding: "var(--space-5)",
                  borderLeft: `3px solid ${repo.ciEnabled ? "var(--status-success)" : "var(--border-color)"}`,
                  transition: "all 200ms",
                }}
              >
                <div
                  className="dev-repo-card-inner"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--space-4)",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-md)",
                        background: `${langColor(repo.language)}15`,
                        border: `1px solid ${langColor(repo.language)}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Code size={18} color={langColor(repo.language)} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-2)",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          {repo.name}
                        </span>
                        {repo.isPrivate ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "0.6875rem",
                              padding: "1px 6px",
                              borderRadius: "var(--radius-full)",
                              background: "rgba(245,158,11,0.1)",
                              color: "var(--status-warning)",
                              border: "1px solid rgba(245,158,11,0.2)",
                            }}
                          >
                            <Lock size={10} /> Private
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "0.6875rem",
                              padding: "1px 6px",
                              borderRadius: "var(--radius-full)",
                              background: "rgba(16,185,129,0.08)",
                              color: "var(--text-muted)",
                            }}
                          >
                            <Globe size={10} /> Public
                          </span>
                        )}
                        {repo.language && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "0.6875rem",
                            }}
                          >
                            <span
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: langColor(repo.language),
                                display: "inline-block",
                              }}
                            />
                            <span style={{ color: "var(--text-muted)" }}>
                              {repo.language}
                            </span>
                          </span>
                        )}
                        {badge && (
                          <span
                            style={{
                              fontSize: "0.6875rem",
                              padding: "1px 8px",
                              borderRadius: "var(--radius-full)",
                              background: badge.bg,
                              color: badge.color,
                              fontWeight: 600,
                            }}
                          >
                            {badge.text}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                          maxWidth: "100%",
                        }}
                      >
                        {repo.description || "No description"}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-4)",
                          marginTop: "4px",
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        <span>⭐ {repo.stargazersCount}</span>
                        <span>
                          <GitBranch
                            size={11}
                            style={{ verticalAlign: "-1px" }}
                          />{" "}
                          {repo.defaultBranch}
                        </span>
                        <span>Updated {timeAgo(repo.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="dev-repo-actions"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      flexShrink: 0,
                    }}
                  >
                    {repo.ciEnabled && repo.pluginSlug && (
                      <a
                        href={`/plugins/${repo.pluginSlug}/builds`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.8125rem",
                          color: "var(--accent-cyan)",
                          fontWeight: 500,
                        }}
                      >
                        View Builds <ExternalLink size={12} />
                      </a>
                    )}
                    <button
                      onClick={() => toggleCI(repo)}
                      disabled={toggling === repo.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "0.4375rem 1rem",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: toggling === repo.id ? "wait" : "pointer",
                        transition: "all 200ms",
                        border: "none",
                        background: repo.ciEnabled
                          ? "rgba(239,68,68,0.08)"
                          : "rgba(16,185,129,0.08)",
                        color: repo.ciEnabled
                          ? "var(--status-error)"
                          : "var(--status-success)",
                        opacity: toggling === repo.id ? 0.5 : 1,
                      }}
                    >
                      {repo.ciEnabled ? (
                        <>
                          <ToggleRight size={16} /> Disable CI
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={16} /> Enable CI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRepos.length > 0 && hasMore && (
            <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
              <button
                className="btn btn-secondary"
                onClick={() => fetchRepos(page + 1)}
                disabled={isFetchingMore}
                style={{
                  minWidth: "150px",
                  display: "inline-flex",
                  justifyContent: "center",
                }}
              >
                {isFetchingMore ? (
                  <Loader2
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}

          {filteredRepos.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "var(--space-12)",
                color: "var(--text-muted)",
              }}
            >
              <p style={{ fontSize: "1rem" }}>No repositories found</p>
              <p style={{ fontSize: "0.875rem", marginTop: "var(--space-2)" }}>
                {search
                  ? "Try a different search term"
                  : "No GitHub repositories detected"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import {
  PackagePlus,
  Settings,
  Activity,
  Upload,
  AlertCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import PluginImage from "@/components/PluginImage";
import AnimatedNumber from "@/components/AnimatedNumber";

import { fetchApi } from "@/lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Fetch real data from backend
  const [pluginsRes, statsRes, statusRes] = await Promise.all([
    fetchApi("/api/v1/dashboard/plugins"),
    fetchApi("/api/v1/dashboard/stats"),
    fetchApi("/api/v1/dashboard/status"),
  ]);

  const hasAppInstalled = statusRes.data?.data?.hasAppInstalled || false;
  const githubTokenExpired = statusRes.data?.data?.githubTokenExpired || false;
  const installUrl =
    process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ||
    "https://github.com/apps/endgit-app/installations/new";

  if (githubTokenExpired) {
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
              background: "rgba(255, 170, 0, 0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-6)",
            }}
          >
            <AlertCircle size={40} color="var(--accent-orange)" />
          </div>
          <h1 className="heading-2" style={{ marginBottom: "var(--space-4)" }}>
            GitHub Session Expired
          </h1>
          <p
            className="text-secondary"
            style={{
              fontSize: "1.125rem",
              lineHeight: 1.6,
              marginBottom: "var(--space-8)",
            }}
          >
            For security reasons, your connection to GitHub has expired. Please
            re-authenticate to sync your App installation status and continue
            using the Developer Dashboard.
          </p>
          <a
            href="/api/auth/signin?callbackUrl=/dashboard"
            className="btn btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.125rem",
              padding: "0.75rem 2rem",
            }}
          >
            Re-authenticate with GitHub
          </a>
        </div>
      </div>
    );
  }

  if (!hasAppInstalled) {
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
            To get started with the Developer Dashboard, you need to install the
            EndGit GitHub App on your repositories. The app will automatically
            detect your Bedrock plugins, build them using our CI/CD pipeline,
            and publish them to the marketplace.
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

  const stats = statsRes.data?.data || {
    totalPlugins: 0,
    totalDownloads: 0,
    totalVersions: 0,
    pendingReviews: 0,
  };

  const myPlugins: any[] = pluginsRes.data?.data || [];

  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "var(--space-8)",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <h1 className="heading-2">Developer Dashboard</h1>
          <p className="text-muted">
            Manage your plugins and track performance.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <a
            href={installUrl}
            target="_blank"
            className="btn btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Settings size={18} /> Manage App Installation
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
          gap: "var(--space-6)",
          marginBottom: "var(--space-10)",
        }}
      >
        <div
          className="card"
          style={{
            padding: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              background: "rgba(124, 58, 237, 0.1)",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-md)",
              color: "var(--accent-purple)",
            }}
          >
            <PackagePlus size={24} />
          </div>
          <div>
            <div
              className="text-muted"
              style={{
                fontSize: "0.875rem",
                marginBottom: "0.25rem",
              }}
            >
              Total Plugins
            </div>
            <div className="heading-2">
              <AnimatedNumber value={stats.totalPlugins} />
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              background: "rgba(6, 182, 212, 0.1)",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-md)",
              color: "var(--accent-cyan)",
            }}
          >
            <Activity size={24} />
          </div>
          <div>
            <div
              className="text-muted"
              style={{
                fontSize: "0.875rem",
                marginBottom: "0.25rem",
              }}
            >
              Total Downloads
            </div>
            <div className="heading-2">
              <AnimatedNumber value={stats.totalDownloads} />
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-md)",
              color: "var(--status-warning)",
            }}
          >
            <AlertCircle size={24} />
          </div>
          <div>
            <div
              className="text-muted"
              style={{
                fontSize: "0.875rem",
                marginBottom: "0.25rem",
              }}
            >
              Pending Review
            </div>
            <div className="heading-2">
              <AnimatedNumber value={stats.pendingReviews} />
            </div>
          </div>
        </div>
      </div>

      {/* Plugins List */}
      <h2 className="heading-3" style={{ marginBottom: "var(--space-6)" }}>
        My Plugins
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))",
          gap: "var(--space-6)",
        }}
      >
        {myPlugins.map((plugin) => (
          <div
            key={plugin.id}
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Status Bar */}
            <div
              style={{
                height: "4px",
                width: "100%",
                background:
                  plugin.status === "APPROVED"
                    ? "var(--status-success)"
                    : "var(--status-warning)",
              }}
            />

            <div
              style={{
                padding: "var(--space-5)",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: "var(--space-4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-3)",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--border-color)",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    <PluginImage
                      iconUrl={plugin.iconUrl}
                      repoUrl={plugin.repoUrl}
                      alt={`${plugin.displayName} icon`}
                    />
                  </div>
                  <div>
                    <a
                      href={`/plugins/${plugin.slug}`}
                      className="heading-3"
                      style={{
                        fontSize: "1.25rem",
                        color: "var(--text-primary)",
                        display: "block",
                        marginBottom: "var(--space-1)",
                      }}
                    >
                      {plugin.displayName}
                    </a>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      v{plugin.latestVersion || "0.0.0"}
                    </span>
                  </div>
                </div>
                <span
                  className={`badge ${plugin.pluginType === "PYTHON" ? "badge-green" : "badge-purple"}`}
                >
                  {plugin.pluginType}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-4)",
                  padding: "var(--space-4) 0",
                  borderTop: "1px solid var(--border-color)",
                  borderBottom: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.75rem",
                      marginBottom: "0.25rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Downloads
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    <Activity size={14} color="var(--accent-cyan)" />{" "}
                    <AnimatedNumber value={plugin.downloads} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.75rem",
                      marginBottom: "0.25rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Latest Version
                  </div>
                  <div
                    style={{
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {plugin.latestVersion
                      ? `v${plugin.latestVersion}`
                      : "No versions"}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.75rem",
                      marginBottom: "0.25rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Status
                  </div>
                  <div
                    style={{
                      fontWeight: 500,
                      color:
                        plugin.status === "APPROVED"
                          ? "var(--status-success)"
                          : "var(--status-warning)",
                    }}
                  >
                    {plugin.status}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "auto" }}>
                {plugin.status === "PENDING_REVIEW" ? (
                  <div
                    style={{
                      width: "100%",
                      background: "var(--status-warning)",
                      color: "#000",
                      fontWeight: 600,
                      padding: "0.5rem",
                      borderRadius: "var(--radius-sm)",
                      textAlign: "center",
                    }}
                  >
                    Submitted
                  </div>
                ) : (
                  <button
                    className="btn btn-secondary"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      padding: "0.5rem",
                    }}
                  >
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

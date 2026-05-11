import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import {
  Clock,
  GitBranch,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Send,
} from "lucide-react";
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
    SUCCESS: {
      color: "var(--status-success)",
      bg: "rgba(16, 185, 129, 0.1)",
      icon: <CheckCircle size={14} />,
    },
    FAILED: {
      color: "var(--status-error)",
      bg: "rgba(239, 68, 68, 0.1)",
      icon: <XCircle size={14} />,
    },
    RUNNING: {
      color: "var(--accent-cyan)",
      bg: "rgba(14, 165, 233, 0.1)",
      icon: (
        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
      ),
    },
    QUEUED: {
      color: "var(--text-muted)",
      bg: "rgba(100, 116, 139, 0.1)",
      icon: <Clock size={14} />,
    },
  };
  const c = config[status] || config.QUEUED;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "0.25rem 0.75rem",
        borderRadius: "var(--radius-full)",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: c.color,
        background: c.bg,
      }}
    >
      {c.icon} {status}
    </span>
  );
}

export default async function PluginBuildsPage({
  params,
}: {
  params: { slug: string };
}) {
  const [plugin, builds] = await Promise.all([
    getPlugin(params.slug),
    getPluginBuilds(params.slug),
  ]);

  if (!plugin) return notFound();

  // Find the highest build number that has been submitted (has a versionStatus)
  const versionedBuilds = builds.filter((b: any) => b.versionStatus !== null);
  const reviewedBuildNumber =
    versionedBuilds.length > 0
      ? Math.max(...versionedBuilds.map((b: any) => Number(b.buildNumber)))
      : -1;

  // Check if any build is currently pending review
  const hasPendingVersion =
    builds.some((b: any) => b.versionStatus === "PENDING") ||
    plugin.status === "PENDING_REVIEW";

  return (
    <div className="container" style={{ padding: "var(--space-8) 0" }}>
      <Link
        href="/dashboard/dev"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-muted)",
          textDecoration: "none",
          fontSize: "0.875rem",
          fontWeight: 500,
          marginBottom: "var(--space-6)",
        }}
      >
        <ArrowLeft size={16} /> Back to Dev Dashboard
      </Link>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            fontWeight: 700,
            margin: 0,
            wordBreak: "break-word",
          }}
        >
          {plugin.displayName} CI Builds
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
          View build history and logs for this plugin.
        </p>
      </div>

      <div className="card" style={{ padding: "var(--space-6)" }}>
        {builds.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-8)",
              color: "var(--text-muted)",
            }}
          >
            <GitBranch
              size={32}
              style={{ margin: "0 auto var(--space-4)", opacity: 0.5 }}
            />
            <p style={{ fontWeight: 500 }}>No builds found.</p>
            <p style={{ fontSize: "0.875rem", marginTop: "4px" }}>
              Push to your repository to trigger the first build.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
              }}
            >
              <thead style={{ background: "var(--bg-secondary)" }}>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    textAlign: "left",
                  }}
                >
                  <th
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      borderRight: "1px solid var(--border-color)",
                    }}
                  >
                    Build #
                  </th>
                  <th
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      borderRight: "1px solid var(--border-color)",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      borderRight: "1px solid var(--border-color)",
                    }}
                  >
                    Lint
                  </th>
                  <th
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      borderRight: "1px solid var(--border-color)",
                    }}
                  >
                    Commit
                  </th>
                  <th
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      borderRight: "1px solid var(--border-color)",
                    }}
                  >
                    Branch or Pull Request number
                  </th>
                  <th
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {builds.map((build: any) => (
                  <tr
                    key={build.id}
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                      background: "var(--bg-primary)",
                    }}
                  >
                    <td
                      style={{
                        padding: "var(--space-4)",
                        borderRight: "1px solid var(--border-color)",
                        verticalAlign: "top",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <Link
                          href={`/builds/${build.id}`}
                          style={{
                            color: "var(--accent-blue)",
                            textDecoration: "none",
                          }}
                        >
                          Dev #{build.buildNumber}
                        </Link>
                        {build.commitHash && (
                          <span
                            style={{
                              color: "var(--accent-blue)",
                              fontSize: "0.8125rem",
                            }}
                          >
                            (&amp;{build.commitHash.slice(0, 5)})
                          </span>
                        )}
                        {build.triggerType === "WEBHOOK" && (
                          <span
                            className="badge"
                            style={{
                              fontSize: "0.625rem",
                              width: "fit-content",
                              marginTop: "4px",
                            }}
                          >
                            AUTO
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "var(--space-4)",
                        color: "var(--text-secondary)",
                        borderRight: "1px solid var(--border-color)",
                        verticalAlign: "top",
                      }}
                    >
                      {timeAgo(build.createdAt)}
                      {build.duration && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            marginTop: "4px",
                            color: "var(--text-muted)",
                          }}
                        >
                          in {build.duration}s
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-4)",
                        borderRight: "1px solid var(--border-color)",
                        verticalAlign: "top",
                      }}
                    >
                      {build.status === "SUCCESS" ? (
                        <span style={{ color: "var(--status-success)" }}>
                          OK
                        </span>
                      ) : build.status === "FAILED" ? (
                        <span style={{ color: "var(--status-error)" }}>
                          Failed
                        </span>
                      ) : build.status === "RUNNING" ? (
                        <span style={{ color: "var(--accent-cyan)" }}>
                          Running
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>
                          Queued
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-4)",
                        borderRight: "1px solid var(--border-color)",
                        verticalAlign: "top",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            wordBreak: "break-word",
                          }}
                        >
                          {build.commitHash && (
                            <a
                              href={`${plugin.repoUrl}/commit/${build.commitHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "var(--accent-blue)",
                                fontFamily: "var(--font-mono)",
                                textDecoration: "none",
                              }}
                            >
                              {build.commitHash.slice(0, 7)}
                            </a>
                          )}
                          <span style={{ color: "var(--text-primary)" }}>
                            {build.commitMessage || "No commit message"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {build.versionStatus === "PENDING" && (
                            <span
                              className="badge badge-warning"
                              style={{
                                fontSize: "0.625rem",
                                background: "rgba(245, 158, 11, 0.2)",
                                color: "var(--status-warning)",
                              }}
                            >
                              PENDING REVIEW
                            </span>
                          )}
                          {build.versionStatus === "APPROVED" && (
                            <span
                              className="badge badge-success"
                              style={{
                                fontSize: "0.625rem",
                                background: "rgba(16, 185, 129, 0.2)",
                                color: "var(--status-success)",
                              }}
                            >
                              APPROVED
                            </span>
                          )}
                          {build.versionStatus === "REJECTED" && (
                            <span
                              className="badge badge-error"
                              style={{
                                fontSize: "0.625rem",
                                background: "rgba(239, 68, 68, 0.2)",
                                color: "var(--status-error)",
                              }}
                            >
                              REJECTED
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "var(--space-4)",
                        borderRight: "1px solid var(--border-color)",
                        verticalAlign: "top",
                      }}
                    >
                      <a
                        href={`${plugin.repoUrl}/tree/${build.branch || "master"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--accent-blue)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          textDecoration: "none",
                        }}
                      >
                        {build.branch || "master"}
                      </a>
                    </td>
                    <td
                      style={{
                        padding: "var(--space-4)",
                        textAlign: "right",
                        verticalAlign: "top",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-2)",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Link
                          href={`/builds/${build.id}`}
                          className="btn btn-secondary"
                          style={{
                            padding: "0.375rem 0.75rem",
                            fontSize: "0.8125rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Logs
                        </Link>
                        {build.status === "SUCCESS" &&
                          Number(build.buildNumber) >
                            Number(reviewedBuildNumber) &&
                          !hasPendingVersion && (
                            <Link
                              href={`/builds/${build.id}/submit`}
                              className="btn btn-primary"
                              style={{
                                padding: "0.375rem 0.75rem",
                                fontSize: "0.8125rem",
                                gap: "4px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Send size={14} /> Submit
                            </Link>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

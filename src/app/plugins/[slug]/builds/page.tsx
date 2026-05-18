import { fetchApi } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import {
  Clock,
  GitBranch,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getPluginBuilds(
  slug: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const { data } = await fetchApi(
    `/api/v1/builds/plugin/${slug}?page=${page}&pageSize=${pageSize}`,
    { noAuth: true },
  );
  return {
    plugin: data?.data?.plugin || null,
    builds: data?.data?.builds || [],
    pagination: data?.pagination || {
      page: 1,
      totalPages: 1,
      total: 0,
      pageSize,
    },
  };
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
      color: "var(--accent-primary)",
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
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentPage = parseInt(searchParams.page as string) || 1;
  const pageSize = 10;

  const [buildsData, session] = await Promise.all([
    getPluginBuilds(params.slug, currentPage, pageSize),
    getServerSession(authOptions),
  ]);

  const { plugin, builds, pagination } = buildsData;

  if (!plugin) return notFound();
  const isOwner = session?.user?.id === plugin.authorId;

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

  // Build pagination URL helper
  function pageUrl(page: number): string {
    const p = new URLSearchParams();
    p.set("page", page.toString());
    return `/plugins/${params.slug}/builds?${p.toString()}`;
  }

  // Generate page numbers to display
  function getPageNumbers(): (number | "...")[] {
    const totalPages = pagination.totalPages;
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
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
          <>
            <div style={{ overflowX: "auto" }}>
              <table
                className="builds-table"
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
                        {build.duration ? (
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {" "}
                            (in {build.duration}s)
                          </span>
                        ) : null}
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
                          <span style={{ color: "var(--accent-primary)" }}>
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
                            {isOwner && build.versionStatus === "PENDING" && (
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
                            {isOwner && build.versionStatus === "APPROVED" && (
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
                            {isOwner && build.versionStatus === "REJECTED" && (
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
                          {isOwner &&
                            build.canSubmit &&
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

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginTop: "var(--space-8)",
                  flexWrap: "wrap",
                }}
              >
                {/* Previous */}
                {currentPage > 1 ? (
                  <Link
                    href={pageUrl(currentPage - 1)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "all 150ms",
                    }}
                  >
                    <ChevronLeft size={16} /> Prev
                  </Link>
                ) : (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-muted)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      opacity: 0.5,
                      cursor: "not-allowed",
                    }}
                  >
                    <ChevronLeft size={16} /> Prev
                  </span>
                )}

                {/* Page Numbers */}
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`dots-${i}`}
                      style={{
                        padding: "0.5rem 0.25rem",
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                      }}
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={pageUrl(p)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "var(--radius-md)",
                        border:
                          p === currentPage
                            ? "1px solid var(--accent-primary)"
                            : "1px solid var(--border-color)",
                        background:
                          p === currentPage
                            ? "rgba(6, 182, 212, 0.1)"
                            : "var(--bg-card)",
                        color:
                          p === currentPage
                            ? "var(--accent-primary)"
                            : "var(--text-secondary)",
                        fontSize: "0.875rem",
                        fontWeight: p === currentPage ? 700 : 500,
                        textDecoration: "none",
                        transition: "all 150ms",
                        minWidth: "38px",
                        textAlign: "center",
                      }}
                    >
                      {p}
                    </Link>
                  ),
                )}

                {/* Next */}
                {currentPage < pagination.totalPages ? (
                  <Link
                    href={pageUrl(currentPage + 1)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "all 150ms",
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </Link>
                ) : (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-muted)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      opacity: 0.5,
                      cursor: "not-allowed",
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

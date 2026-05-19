"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { GitBranch, Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface BuildsTableClientProps {
  slug: string;
  plugin: any;
  initialBuilds: any[];
  initialPagination: {
    page: number;
    totalPages: number;
    total: number;
    pageSize: number;
  };
  isOwner: boolean;
}

export function BuildsTableClient({
  slug,
  plugin,
  initialBuilds,
  initialPagination,
  isOwner,
}: BuildsTableClientProps) {
  const [builds, setBuilds] = useState<any[]>(initialBuilds);
  const [page, setPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasMore = page < totalPages;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(
        `${baseUrl}/api/v1/builds/plugin/${slug}?page=${nextPage}&pageSize=10`,
      );
      const json = await res.json();
      if (json.success) {
        const newBuilds = json.data?.builds || [];
        setBuilds((prev) => [...prev, ...newBuilds]);
        setPage(nextPage);
        setTotalPages(json.pagination?.totalPages || totalPages);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, slug, totalPages]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function handleScroll() {
      if (!wrapper) return;
      const { scrollTop, scrollHeight, clientHeight } = wrapper;
      if (
        scrollHeight > clientHeight &&
        scrollHeight - scrollTop - clientHeight < 100
      ) {
        loadMore();
      }
    }

    wrapper.addEventListener("scroll", handleScroll);
    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  const versionedBuilds = builds.filter((b: any) => b.versionStatus !== null);
  const reviewedBuildNumber =
    versionedBuilds.length > 0
      ? Math.max(...versionedBuilds.map((b: any) => Number(b.buildNumber)))
      : -1;
  const hasPendingVersion =
    builds.some((b: any) => b.versionStatus === "PENDING") ||
    plugin.status === "PENDING_REVIEW";

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
          <div
            ref={wrapperRef}
            className="builds-table-wrapper"
            style={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "600px",
            }}
          >
            <table
              className="builds-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
              }}
            >
              <thead
                style={{
                  background: "var(--bg-secondary)",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
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

            {isLoading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "var(--space-4)",
                }}
              >
                <Loader2
                  size={20}
                  style={{
                    animation: "spin 1s linear infinite",
                    color: "var(--accent-primary)",
                  }}
                />
              </div>
            )}

            {!hasMore && builds.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "var(--space-4)",
                  color: "var(--text-muted)",
                  fontSize: "0.8125rem",
                }}
              >
                All builds loaded
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

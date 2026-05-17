"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import PluginImage from "@/components/PluginImage";
import AnimatedNumber from "@/components/AnimatedNumber";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import FadeIn from "@/components/FadeIn";

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface Plugin {
  id: string;
  slug: string;
  displayName: string;
  iconUrl?: string;
  repoUrl?: string;
  latestVersion?: string;
  stars?: number;
  downloads?: number;
  createdAt?: string;
  author?: { displayName?: string; username?: string };
}

export default function LatestPluginsSection() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const PAGE_SIZE = 6;

  const fetchPlugins = useCallback(async (page: number) => {
    setLoading(true);
    setError(false);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(
        `${apiUrl}/api/v1/plugins/latest?page=${page}&pageSize=${PAGE_SIZE}`,
      );
      const json = await res.json();
      if (json?.success && json?.data?.plugins) {
        setPlugins(json.data.plugins);
        setPagination(json.pagination || null);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlugins(currentPage);
  }, [currentPage, fetchPlugins]);

  const goToPage = (page: number) => {
    if (page < 1 || (pagination && page > pagination.totalPages)) return;
    setCurrentPage(page);
  };

  if (error && plugins.length === 0) return null;

  return (
    <section className="container" style={{ paddingBottom: "var(--space-16)" }}>
      <FadeIn>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-8)",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <div>
            <h2
              className="heading-2"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Recent Releases
            </h2>
            <p
              className="text-muted"
              style={{ fontSize: "1.0625rem", marginTop: "var(--space-2)" }}
            >
              The latest additions to the Endstone ecosystem.
            </p>
          </div>
          <a
            href="/plugins"
            className="btn"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            View All <ArrowRight size={16} />
          </a>
        </div>
      </FadeIn>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            color: "var(--text-muted)",
            gap: "8px",
          }}
        >
          <Loader2 size={20} className="spin" />
          <span>Loading plugins…</span>
        </div>
      ) : (
        <>
          <StaggerContainer
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
              gap: "var(--space-6)",
              alignContent: "start",
            }}
          >
            {plugins.map((plugin) => {
              const avgRating = plugin.stars
                ? Math.round((plugin.stars / 20) * 10) / 10
                : 0;

              return (
                <StaggerItem key={plugin.id}>
                  <a
                    href={`/plugins/${plugin.slug}`}
                    className="card"
                    style={{
                      padding: "0",
                      display: "flex",
                      flexDirection: "column",
                      textDecoration: "none",
                      background: "var(--bg-card)",
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      height: "100%",
                    }}
                  >
                    <div
                      className="plugin-card-inner"
                      style={{
                        padding: "var(--space-4)",
                        display: "flex",
                        gap: "var(--space-4)",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          flexShrink: 0,
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border-color)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PluginImage
                          iconUrl={plugin.iconUrl}
                          repoUrl={plugin.repoUrl}
                          alt={`${plugin.displayName} icon`}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          className="heading-3"
                          style={{
                            fontSize: "1.125rem",
                            margin: "0 0 4px 0",
                            color: "var(--accent-cyan)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {plugin.displayName}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "var(--space-3)",
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.8125rem",
                              color: "var(--text-muted)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                              minWidth: 0,
                              flex: "1 1 0",
                            }}
                          >
                            <span>v{plugin.latestVersion || "1.0.0"}</span>
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {plugin.repoUrl?.match(
                                /github\.com\/([^/]+)/,
                              )?.[1] ||
                                plugin.author?.displayName ||
                                plugin.author?.username}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              gap: "4px",
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span>
                              {new Date(
                                plugin.createdAt || "",
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span>
                              <AnimatedNumber value={plugin.downloads || 0} />{" "}
                              downloads
                            </span>
                            {avgRating > 0 && (
                              <span
                                style={{
                                  color: "#f59e0b",
                                  fontSize: "0.8125rem",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "3px",
                                }}
                              >
                                {"★".repeat(Math.round(avgRating))}
                                {"☆".repeat(5 - Math.round(avgRating))}
                                <span
                                  style={{
                                    color: "var(--text-muted)",
                                    fontSize: "0.6875rem",
                                    marginLeft: "2px",
                                  }}
                                >
                                  ({avgRating})
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
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
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background:
                    currentPage <= 1 ? "var(--bg-secondary)" : "var(--bg-card)",
                  color:
                    currentPage <= 1
                      ? "var(--text-muted)"
                      : "var(--text-secondary)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                  opacity: currentPage <= 1 ? 0.5 : 1,
                  transition: "all 150ms",
                }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border:
                      p === currentPage
                        ? "1px solid var(--accent-cyan)"
                        : "1px solid var(--border-color)",
                    background:
                      p === currentPage
                        ? "rgba(6, 182, 212, 0.1)"
                        : "var(--bg-card)",
                    color:
                      p === currentPage
                        ? "var(--accent-cyan)"
                        : "var(--text-secondary)",
                    fontSize: "0.875rem",
                    fontWeight: p === currentPage ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 150ms",
                    minWidth: "38px",
                    textAlign: "center",
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background:
                    currentPage >= pagination.totalPages
                      ? "var(--bg-secondary)"
                      : "var(--bg-card)",
                  color:
                    currentPage >= pagination.totalPages
                      ? "var(--text-muted)"
                      : "var(--text-secondary)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor:
                    currentPage >= pagination.totalPages
                      ? "not-allowed"
                      : "pointer",
                  opacity: currentPage >= pagination.totalPages ? 0.5 : 1,
                  transition: "all 150ms",
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

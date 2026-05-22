import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import PluginImage from "@/components/PluginImage";
import FadeIn from "@/components/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

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

export default async function LatestPluginsSection() {
  let plugins: Plugin[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(
      `${apiUrl}/api/v1/plugins/latest?page=1&pageSize=6`,
      { next: { revalidate: 60 } },
    );
    const json = await res.json();
    if (json?.success && json?.data?.plugins) {
      plugins = json.data.plugins;
    }
  } catch {
    return null;
  }

  if (plugins.length === 0) return null;

  const VERIFIED_ORGS = ["EndstoneMC", "two-tech-dev"];

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
          <Link
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
          </Link>
        </div>
      </FadeIn>

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
          const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
          const isVerified = repoOwner
            ? VERIFIED_ORGS.includes(repoOwner)
            : false;

          return (
            <StaggerItem key={plugin.id}>
              <Link
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
                        color: "var(--accent-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {plugin.displayName}
                      {isVerified && (
                        <span
                          title="This plugin is officially supported by EndstoneMC/EndGit"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            color: "var(--accent-primary)",
                            flexShrink: 0,
                          }}
                        >
                          <BadgeCheck size={16} />
                        </span>
                      )}
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
                          {plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1] ||
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
                          {new Date(plugin.createdAt || "").toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span>
                          {plugin.downloads?.toLocaleString() ?? 0} downloads
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
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import PluginImage from "@/components/PluginImage";

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
  isFeatured?: boolean;
  author?: { displayName?: string; username?: string };
}

export default function PluginCardGrid({ plugins }: { plugins: Plugin[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
        gap: "var(--space-6)",
        alignContent: "start",
      }}
    >
      {plugins.map((plugin, i) => {
        const avgRating = plugin.stars
          ? Math.round((plugin.stars / 20) * 10) / 10
          : 0;
        const isFeatured = plugin.isFeatured;

        return (
          <motion.a
            href={`/plugins/${plugin.slug}`}
            key={plugin.id}
            className="card"
            style={{
              padding: "0",
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              background: "var(--bg-card)",
              overflow: "hidden",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: Math.min(i * 0.04, 0.3),
              ease: [0.25, 0.1, 0.25, 1],
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

            {isFeatured && (
              <div
                style={{
                  padding: "0 var(--space-4) var(--space-4)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    padding: "6px 0",
                    textAlign: "center",
                    background: "#008000",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  Featured
                </div>
              </div>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}

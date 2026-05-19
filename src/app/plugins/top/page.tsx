import { ArrowLeft, Trophy, Download } from "lucide-react";
import PluginImage from "@/components/PluginImage";
import AnimatedNumber from "@/components/AnimatedNumber";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export const metadata = {
  title: "Top Plugins - EndGit",
  description: "The most downloaded Endstone plugins on EndGit.",
};

export default async function TopPluginsPage() {
  let plugins: any[] = [];
  try {
    const { data: responseData } = await fetchApi(
      "/api/v1/plugins?sort=downloads&order=desc&pageSize=50",
      { revalidate: 300 },
    );
    plugins = responseData?.data?.plugins || [];
  } catch {
    plugins = [];
  }

  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      <div style={{ marginBottom: "var(--space-8)" }}>
        <Link
          href="/plugins"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--text-muted)",
            marginBottom: "var(--space-4)",
            fontSize: "0.875rem",
          }}
        >
          <ArrowLeft size={16} /> Back to Plugins
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <Trophy size={32} color="#fbbf24" />
          <h1 className="heading-2">Top Plugins</h1>
        </div>
        <p className="text-muted" style={{ marginTop: "var(--space-2)" }}>
          The most downloaded Endstone plugins of all time.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
          gap: "var(--space-6)",
        }}
      >
        {plugins.map((plugin: any, index: number) => {
          const avgRating = plugin.stars
            ? Math.round((plugin.stars / 20) * 10) / 10
            : 0;

          return (
            <a
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
                transition: "transform 0.2s, box-shadow 0.2s",
                position: "relative",
              }}
            >
              {/* Rank Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background:
                    index === 0
                      ? "#fbbf24"
                      : index === 1
                        ? "#94a3b8"
                        : index === 2
                          ? "#b45309"
                          : "rgba(255,255,255,0.1)",
                  color: index < 3 ? "#000" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  zIndex: 10,
                }}
              >
                #{index + 1}
              </div>

              <div
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
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      marginBottom: "4px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.125rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {plugin.displayName}
                    </h3>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      color: "var(--text-muted)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {plugin.description}
                  </p>
                </div>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  borderTop: "1px solid var(--border-color)",
                  padding: "var(--space-3) var(--space-4)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--bg-secondary)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ display: "flex", gap: "var(--space-4)" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Download size={14} />{" "}
                    <AnimatedNumber value={plugin.downloads} />
                  </span>
                </div>
                <span>
                  By{" "}
                  {(() => {
                    const repoOwner =
                      plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
                    return (
                      repoOwner ||
                      plugin.author?.displayName ||
                      plugin.author?.username ||
                      "Unknown"
                    );
                  })()}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

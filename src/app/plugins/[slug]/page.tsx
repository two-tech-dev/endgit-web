import {
  Download,
  ShieldCheck,
  Star,
  CheckCircle,
  Tag,
  GitBranch,
  Terminal,
  Activity,
  Copy,
  Shield,
  Zap,
  Pencil,
} from "lucide-react";
import dynamic from "next/dynamic";
import PluginImage from "@/components/PluginImage";
import VersionSelector from "@/components/VersionSelector";
import NewVersionForm from "@/components/NewVersionForm";
import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

const MarkdownTabs = dynamic(() => import("@/components/MarkdownTabs"), {
  loading: () => (
    <div
      style={{
        padding: "var(--space-6)",
        color: "var(--text-muted)",
        fontSize: "0.875rem",
      }}
    >
      Loading description...
    </div>
  ),
});
const PluginAnalyticsChart = dynamic(
  () => import("@/components/PluginAnalyticsChart"),
  {
    loading: () => (
      <div
        className="card"
        style={{
          padding: "var(--space-6)",
          height: "280px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Loading analytics...
        </p>
      </div>
    ),
  },
);
const DependencyGraph = dynamic(() => import("@/components/DependencyGraph"), {
  ssr: false,
});
const PluginRatings = dynamic(() => import("@/components/PluginRatings"), {
  ssr: false,
});

async function getPlugin(slug: string) {
  const { data } = await fetchApi(`/api/v1/plugins/${slug}`, {
    revalidate: 30,
  });
  return data?.data || null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const plugin = await getPlugin(params.slug);
  if (!plugin) {
    return { title: "Plugin Not Found - EndGit" };
  }

  const title = `${plugin.displayName} - Endstone Plugin | EndGit`;
  const description =
    plugin.description || `Download ${plugin.displayName} for Endstone.`;
  const keywords =
    plugin.keywords && plugin.keywords.length > 0
      ? plugin.keywords.join(", ")
      : `${plugin.name}, endstone plugin, minecraft bedrock`;

  const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
  const authorName =
    repoOwner || plugin.author?.displayName || plugin.author?.username;
  const authorUrl = repoOwner
    ? `https://github.com/${repoOwner}`
    : plugin.author?.username
      ? `https://github.com/${plugin.author.username}`
      : undefined;

  let ogImage = "/logo.png";
  if (plugin.iconUrl) {
    try {
      const res = await fetch(plugin.iconUrl, { method: "HEAD" });
      if (res.ok) ogImage = plugin.iconUrl;
    } catch {
      // fetch failed, keep fallback
    }
  }

  return {
    title,
    description,
    keywords,
    authors: authorName ? [{ name: authorName, url: authorUrl }] : undefined,
    alternates: {
      canonical: `/plugins/${params.slug}`,
    },

    openGraph: {
      title,
      description,
      images: [ogImage],
      type: "website",
      authors: authorName || undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PluginDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { v?: string };
}) {
  const session = await getServerSession(authOptions);
  const plugin = await getPlugin(params.slug);

  if (!plugin) return notFound();

  const safeScore = plugin.trustScore || 0;
  const scoreClass =
    safeScore >= 90
      ? "var(--status-success)"
      : safeScore >= 60
        ? "var(--status-warning)"
        : "var(--status-error)";

  // Determine active version from URL param or default to latest
  const activeVersion = searchParams.v
    ? plugin.versions?.find((v: any) => v.version === searchParams.v) ||
      plugin.versions?.[0]
    : plugin.versions?.[0];

  const isAuthor = session?.user?.id === plugin.authorId;

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "COLLABORATOR":
        return {
          background: "rgba(16, 185, 129, 0.1)",
          color: "var(--status-success)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
        };
      case "CONTRIBUTOR":
        return {
          background: "rgba(14, 165, 233, 0.1)",
          color: "var(--accent-primary)",
          border: "1px solid rgba(14, 165, 233, 0.2)",
        };
      case "TRANSLATOR":
        return {
          background: "rgba(168, 85, 247, 0.1)",
          color: "var(--accent-primary)",
          border: "1px solid rgba(168, 85, 247, 0.2)",
        };
      case "REQUESTER":
        return {
          background: "rgba(245, 158, 11, 0.1)",
          color: "var(--status-warning)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
        };
      default:
        return {
          background: "var(--bg-secondary)",
          color: "var(--text-muted)",
          border: "1px solid var(--border-color)",
        };
    }
  };

  // Use version-specific longDescription if available, fallback to plugin's
  const displayDescription =
    activeVersion?.longDescription ||
    plugin.longDescription ||
    plugin.description;

  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      {/* Header Section */}
      <div
        className="card"
        style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <div
            className="plugin-header-inner"
            style={{
              display: "flex",
              gap: "var(--space-4)",
              minWidth: 0,
              flex: "1 1 auto",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "var(--radius-lg)",
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  flexWrap: "wrap",
                }}
              >
                <h1
                  className="heading-2"
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {plugin.displayName}
                  {plugin.repoUrl && (
                    <a
                      href={
                        activeVersion?.fileHash
                          ? `${plugin.repoUrl}/tree/${activeVersion.fileHash}`
                          : plugin.repoUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        verticalAlign: "super",
                        opacity: 0.6,
                        marginLeft: "-4px",
                      }}
                      title={
                        activeVersion?.fileHash
                          ? `View source for v${activeVersion.version} on GitHub`
                          : "View repository on GitHub"
                      }
                    >
                      <img
                        className="github-icon"
                        src="/github-svgrepo-com.svg"
                        alt="GitHub"
                        width={18}
                        height={18}
                      />
                    </a>
                  )}
                </h1>
                {plugin.qualityBadge === "VERIFIED" && (
                  <span
                    className="badge badge-cyan"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <ShieldCheck size={14} /> VERIFIED
                  </span>
                )}

                {isAuthor && (
                  <Link
                    href={`/plugins/${plugin.slug}/edit`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      background: "rgba(139, 92, 246, 0.08)",
                      color: "var(--accent-primary)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      transition: "all 200ms",
                    }}
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                )}
              </div>
              <p
                style={{
                  color: "var(--text-muted)",
                  marginTop: "var(--space-1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                by{" "}
                {(() => {
                  // Extract owner from repoUrl (e.g., github.com/OrgName/Repo → OrgName)
                  const repoOwner =
                    plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
                  if (repoOwner) {
                    return (
                      <>
                        <Link
                          href={`/plugins/by/${repoOwner}`}
                          style={{
                            color: "var(--accent-primary)",
                            textDecoration: "none",
                          }}
                        >
                          {repoOwner}
                        </Link>
                        <a
                          href={`https://github.com/${repoOwner}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            opacity: 0.6,
                          }}
                          title={`View ${repoOwner} on GitHub`}
                        >
                          <img
                            className="github-icon"
                            src="/github-svgrepo-com.svg"
                            alt="GitHub"
                            width={16}
                            height={16}
                          />
                        </a>
                      </>
                    );
                  }
                  return plugin.author ? (
                    <>
                      <Link
                        href={`/plugins/by/${plugin.author.username}`}
                        style={{
                          color: "var(--accent-primary)",
                          textDecoration: "none",
                        }}
                      >
                        {plugin.author.displayName || plugin.author.username}
                      </Link>
                      <a
                        href={`https://github.com/${plugin.author.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          opacity: 0.6,
                        }}
                        title={`View ${plugin.author.username} on GitHub`}
                      >
                        <img
                          className="github-icon"
                          src="/github-svgrepo-com.svg"
                          alt="GitHub"
                          width={16}
                          height={16}
                        />
                      </a>
                    </>
                  ) : (
                    "Unknown"
                  );
                })()}
              </p>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginTop: "var(--space-2)",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                {plugin.description}
              </p>
            </div>
          </div>

          {/* Download Button & Version Selector */}
          <div
            className="plugin-header-actions"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            <VersionSelector
              slug={plugin.slug}
              pluginType={plugin.pluginType}
              versions={plugin.versions}
            />
            <div
              style={{
                display: "flex",
                gap: "var(--space-6)",
                marginTop: "var(--space-2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontWeight: 600,
                }}
              >
                <Star size={16} color="var(--status-warning)" />{" "}
                {(plugin.averageRating || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontWeight: 600,
                }}
                title="Total Downloads"
              >
                <Download size={16} color="var(--text-muted)" />{" "}
                {(plugin.downloads || 0).toLocaleString()}
                {activeVersion && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginLeft: "4px",
                      fontWeight: 400,
                    }}
                  >
                    ({(activeVersion.downloads || 0).toLocaleString()} this
                    version)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div
        className="plugin-layout"
        style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}
      >
        {/* Main Content */}
        <div
          className="plugin-main-content"
          style={{
            flex: "1 1 min(400px, 100%)",
            minWidth: "0",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          {/* Quick Install */}
          <div className="card" style={{ padding: "var(--space-5)" }}>
            <h3
              style={{
                fontWeight: 600,
                marginBottom: "var(--space-3)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <Terminal size={18} color="var(--accent-primary)" /> Quick Install
              (CLI)
            </h3>
            <div
              style={{
                background: "#0f172a",
                color: "#e2e8f0",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.875rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <code>endgit install {plugin.slug}</code>
              <button
                className="touch-target"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Copy size={16} color="var(--text-muted)" />
              </button>
            </div>
          </div>

          {/* What's New — based on active version */}
          {activeVersion && activeVersion.changelog && (
            <div className="card" style={{ padding: "var(--space-5)" }}>
              <h3
                style={{
                  fontWeight: 600,
                  marginBottom: "var(--space-3)",
                  fontSize: "1rem",
                }}
              >
                What's New in v{activeVersion.version}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {activeVersion.changelog}
              </p>
            </div>
          )}

          {/* About — Plugin Description Panel */}
          <div
            className="plugin-description-panel"
            style={{
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-secondary)",
              overflow: "hidden",
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            {/* Header */}
            <div
              className="plugin-description-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}
                >
                  Plugin Description
                </span>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--status-success)",
                  }}
                ></div>
              </div>
              <a
                href={plugin.repoUrl ? `${plugin.repoUrl}/issues` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  padding: "4px 16px",
                  fontSize: "0.8125rem",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Bugs
              </a>
            </div>

            {/* Body */}
            <div style={{ padding: "0 12px 12px 12px" }}>
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <MarkdownTabs
                  markdown={displayDescription}
                  repoUrl={plugin.repoUrl}
                  commitHash={activeVersion?.fileHash}
                />
              </div>
            </div>
          </div>

          {/* Analytics Chart */}
          <PluginAnalyticsChart slug={plugin.slug} />

          {/* Ratings & Reviews */}
          <div className="plugin-ratings" style={{ width: "100%" }}>
            <PluginRatings slug={plugin.slug} authorId={plugin.authorId} />
          </div>
        </div>

        {/* Right Sidebar */}
        <aside
          className="plugin-sidebar"
          style={{
            flex: "0 0 100%",
            maxWidth: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          {/* Safe Score Card */}
          <div
            className="card"
            style={{
              padding: "var(--space-5)",
              background: "var(--bg-secondary)",
              borderColor: "var(--border-highlight)",
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
              <h3
                style={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                }}
              >
                <Shield size={18} color={scoreClass} /> Safe Score
              </h3>
              <div
                style={{
                  background: "var(--bg-card)",
                  border: `2px solid ${scoreClass}`,
                  color: scoreClass,
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 15px rgba(16, 185, 129, 0.1)`,
                }}
              >
                {safeScore.toLocaleString()}
              </div>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Based on automated CI tests and static analysis.
            </p>
          </div>

          {/* Producers — based on active version */}
          {activeVersion &&
            activeVersion.producers &&
            activeVersion.producers.length > 0 && (
              <div className="card" style={{ padding: "var(--space-5)" }}>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "var(--space-3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Producers{" "}
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--text-muted)",
                      fontWeight: 400,
                    }}
                  >
                    (v{activeVersion.version})
                  </span>
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
                  {activeVersion.producers.map((producer: any) => (
                    <div
                      key={producer.githubUser}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={`https://github.com/${producer.githubUser}.png?size=40`}
                        alt={producer.githubUser}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          background: "var(--bg-secondary)",
                        }}
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <a
                          href={`https://github.com/${producer.githubUser}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "var(--text-primary)",
                            textDecoration: "none",
                          }}
                        >
                          @{producer.githubUser}
                        </a>
                        <span
                          style={{
                            fontSize: "0.625rem",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            display: "inline-block",
                            marginTop: "2px",
                            width: "fit-content",
                            ...getRoleStyle(producer.role),
                          }}
                        >
                          {producer.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Details */}
          <div className="card" style={{ padding: "var(--space-5)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "var(--space-4)" }}>
              Details
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>Type</span>
                <span style={{ fontWeight: 600, textTransform: "uppercase" }}>
                  {plugin.pluginType}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>License</span>
                <span style={{ fontWeight: 600 }}>{plugin.license || "—"}</span>
              </div>
              {activeVersion &&
                activeVersion.supportedApis &&
                activeVersion.supportedApis.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>
                      Endstone API
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {activeVersion.supportedApis.join(", ")}
                    </span>
                  </div>
                )}
              {plugin.repoUrl && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>Repository</span>
                  <a
                    href={plugin.repoUrl}
                    style={{
                      color: "var(--accent-primary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontWeight: 500,
                    }}
                  >
                    <GitBranch size={14} /> GitHub
                  </a>
                </div>
              )}
            </div>

            {/* Tags */}
            {plugin.tags && plugin.tags.length > 0 && (
              <div
                style={{
                  marginTop: "var(--space-4)",
                  paddingTop: "var(--space-4)",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Tags
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-2)",
                  }}
                >
                  {plugin.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="badge badge-outline"
                      style={{
                        fontSize: "0.75rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Badges for Markdown */}
          {isAuthor && (
            <div className="card" style={{ padding: "var(--space-5)" }}>
              <h3
                style={{
                  fontWeight: 600,
                  marginBottom: "var(--space-4)",
                  fontSize: "0.875rem",
                }}
              >
                Markdown Badges
              </h3>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Show off your plugin stats in your README.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <img
                    src={`https://endgit.dev/shield.dl.total/${plugin.slug}`}
                    alt="Downloads Badge"
                  />
                </div>
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "var(--space-2)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  [![Downloads](https://endgit.dev/shield.dl.total/{plugin.slug}
                  )](https://endgit.dev/plugins/{plugin.slug})
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                  marginTop: "var(--space-4)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <img
                    src={`https://endgit.dev/shield.state/${plugin.slug}`}
                    alt="Status Badge"
                  />
                </div>
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "var(--space-2)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  [![Status](https://endgit.dev/shield.state/{plugin.slug}
                  )](https://endgit.dev/plugins/{plugin.slug})
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                  marginTop: "var(--space-4)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <img
                    src={`https://endgit.dev/shield.version/${plugin.slug}`}
                    alt="Version Badge"
                  />
                </div>
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "var(--space-2)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  [![Version](https://endgit.dev/shield.version/{plugin.slug}
                  )](https://endgit.dev/plugins/{plugin.slug})
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                  marginTop: "var(--space-4)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <img
                    src={`https://endgit.dev/shield.rating/${plugin.slug}`}
                    alt="Rating Badge"
                  />
                </div>
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "var(--space-2)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  [![Rating](https://endgit.dev/shield.rating/{plugin.slug}
                  )](https://endgit.dev/plugins/{plugin.slug})
                </div>
              </div>
            </div>
          )}

          {/* Dependency Graph */}
          <DependencyGraph slug={plugin.slug} />
        </aside>
      </div>
    </div>
  );
}

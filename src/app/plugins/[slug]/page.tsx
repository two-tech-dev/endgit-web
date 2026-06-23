import {
  Download,
  ShieldCheck,
  CheckCircle,
  Tag,
  GitBranch,
  Terminal,
  Activity,
  Zap,
  Pencil,
  FlaskConical,
  BadgeCheck,
  Heart,
  Bookmark,
  MoreVertical,
  Flame,
} from "lucide-react";
import nextDynamic from "next/dynamic";
import Image from "next/image";
import PluginImage from "@/components/PluginImage";
import VersionSelector from "@/components/VersionSelector";
import NewVersionForm from "@/components/NewVersionForm";
import { fetchGraphQL } from "@/lib/api";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import MarkdownInline from "@/components/MarkdownInline";
import { VERIFIED_ORGS } from "@/lib/constants";
import CopyCommand from "@/components/CopyCommand";

import VersionDescription from "@/components/VersionDescription";
const PluginAnalyticsChart = nextDynamic(
  () => import("@/components/PluginAnalyticsChart"),
  {
    loading: () => (
      <div className="card p-6 h-[280px] grid place-items-center">
        <p className="text-text-muted text-sm">Loading analytics...</p>
      </div>
    ),
  },
);
const DependencyGraph = nextDynamic(
  () => import("@/components/DependencyGraph"),
  {
    ssr: false,
    loading: () => (
      <div className="card p-6 h-[200px] grid place-items-center">
        <p className="text-text-muted text-sm">Loading dependency graph...</p>
      </div>
    ),
  },
);
const PluginDiscussion = nextDynamic(
  () => import("@/components/PluginDiscussion"),
  {
    ssr: false,
    loading: () => (
      <div className="card p-6 h-[200px] grid place-items-center">
        <p className="text-text-muted text-sm">Loading discussion...</p>
      </div>
    ),
  },
);

export const dynamic = "force-dynamic";

const GET_PLUGIN = `
 query GetPlugin($slug: String!) {
 plugin(slug: $slug) {
 id name slug displayName description longDescription iconUrl repoUrl license tags keywords pluginType downloads commentCount heatScore status qualityBadge isVerified isFeatured createdAt updatedAt 
 author { id username displayName avatarUrl bio } 
 versions { id version changelog longDescription fileName fileSize fileHash minApiVersion supportedApis downloads isLatest isPreRelease status statusReason createdAt producers { githubUser role } }
 }
 }
`;

async function getPlugin(slug: string) {
  try {
    const { data } = await fetchGraphQL(GET_PLUGIN, { slug });
    return data?.plugin || null;
  } catch (err) {
    return null;
  }
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

  const sessionUsername = (session?.user as any)?.username;
  const isAdmin = (session?.user as any)?.trustLevel === "ADMIN";
  const pluginAuthorUsername = plugin.author?.username;
  const isAuthor =
    !!sessionUsername &&
    !!pluginAuthorUsername &&
    sessionUsername === pluginAuthorUsername;
  const canEdit = isAuthor || isAdmin;
  const repoOwnerDetail = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];

  const displayVersions =
    plugin.versions?.filter((v: any) => canEdit || v.status === "APPROVED") ||
    [];

  // Determine active version from URL param or default to latest
  const activeVersion = searchParams.v
    ? displayVersions.find((v: any) => v.version === searchParams.v) ||
      displayVersions[0]
    : displayVersions[0];

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "COLLABORATOR":
        return "bg-success/10 text-success border-success/20";
      case "CONTRIBUTOR":
        return "bg-accent/10 text-accent border-accent/20";
      case "TRANSLATOR":
        return "bg-[#1890ff]/10 text-[#1890ff] border-[#1890ff]/25";
      case "REQUESTER":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-surface-secondary text-text-muted border-border";
    }
  };

  // Use version-specific longDescription if available, fallback to plugin's
  const displayDescription =
    activeVersion?.longDescription ||
    plugin.longDescription ||
    plugin.description;

  return (
    <div className="container pt-8! lg:pt-12! pb-8! lg:pb-10!">
      {/* Header Section */}
      <div className="mb-8 lg:mb-10 pb-6 border-b border-border/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 lg:gap-5 w-full min-w-0">
            <div className="w-16 h-16 lg:w-[100px] lg:h-[100px] shrink-0 rounded-2xl overflow-hidden bg-surface-secondary flex items-center justify-center border border-border/30 shadow-xs">
              <PluginImage
                iconUrl={plugin.iconUrl}
                repoUrl={plugin.repoUrl}
                alt={`${plugin.displayName} icon`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                <h1 className="text-2xl lg:text-[2rem] font-bold text-text-primary m-0 tracking-tight">
                  {plugin.displayName}
                </h1>
                {VERIFIED_ORGS.includes(repoOwnerDetail || "") && (
                  <span
                    title="This plugin is officially supported by EndstoneMC/EndGit"
                    className="text-[#1890ff]"
                  >
                    <BadgeCheck size={24} />
                  </span>
                )}
                {plugin.qualityBadge === "VERIFIED" && (
                  <span className="badge badge-cyan grid grid-flow-col auto-cols-max items-center gap-1">
                    <ShieldCheck size={14} /> VERIFIED
                  </span>
                )}
                {canEdit && (
                  <Link
                    href={`/plugins/${plugin.slug}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1890ff]/25 bg-[#1890ff]/10 px-3 py-1 text-[13px] font-medium text-[#1890ff] no-underline transition-all duration-200 hover:bg-[#1890ff]/20 ml-2"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                )}
              </div>

              <p className="text-text-secondary mt-1.5 text-sm lg:text-[1.0625rem] leading-relaxed max-w-3xl line-clamp-2">
                {plugin.description}
              </p>

              <div className="flex items-center gap-4 mt-3 text-sm font-medium text-text-muted">
                <span
                  className="flex items-center gap-1.5 text-text-secondary"
                  title="Total Downloads"
                >
                  <Download size={18} />
                  {(plugin.downloads || 0).toLocaleString()}
                </span>
                <span
                  className="flex items-center gap-1.5 text-text-secondary"
                  title="Heat Score"
                >
                  <Flame size={18} />
                  {(plugin.heatScore || 0).toLocaleString()}
                </span>
                {plugin.pluginType && (
                  <span className="px-3 py-1 rounded-full bg-surface-secondary text-text-muted text-[11px] font-semibold tracking-wide border border-border/50 uppercase">
                    {plugin.pluginType === "PYTHON"
                      ? "Python"
                      : plugin.pluginType === "CPP"
                        ? "C++"
                        : plugin.pluginType}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 justify-start lg:justify-end mt-4 lg:mt-0">
            <VersionSelector
              slug={plugin.slug}
              pluginType={plugin.pluginType}
              versions={displayVersions}
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="plugin-layout grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 xl:gap-6 items-start">
        {/* Main Content */}
        <div className="plugin-main-content min-w-0 grid gap-6">
          {/* Quick Install */}
          <div className="card p-4 lg:p-5">
            <h3 className="font-semibold mb-3 grid grid-flow-col auto-cols-max items-center gap-2">
              <Terminal size={18} className="text-[#1890ff]" /> Quick Install
              (CLI)
            </h3>
            <CopyCommand command={`endgit install ${plugin.slug}`} />
          </div>

          {/* What's New — based on active version */}
          {activeVersion && activeVersion.changelog && (
            <div className="card p-4 lg:p-5">
              <h3 className="font-semibold mb-3 text-base">
                What's New in v{activeVersion.version}
              </h3>
              <p className="text-sm text-text-secondary whitespace-pre-wrap m-0 font-mono">
                {activeVersion.changelog}
              </p>
            </div>
          )}

          {/* About — Plugin Description Panel */}
          <div className="plugin-description-panel min-w-0 max-w-full overflow-hidden rounded-sm border border-border bg-surface-secondary plugin-description-container">
            {/* Header */}
            <div className="plugin-description-header grid grid-cols-[1fr_auto] items-center px-4 py-[10px]">
              <div className="grid grid-flow-col auto-cols-max items-center gap-2">
                <span className="text-sm text-text-primary">
                  Plugin Description
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
              </div>
              <a
                href={plugin.repoUrl ? `${plugin.repoUrl}/issues` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-card border border-border rounded-sm px-4 py-1 text-[13px] text-text-primary no-underline font-medium hover:bg-surface-secondary transition-all"
              >
                Bugs
              </a>
            </div>

            {/* Body */}
            <div className="px-3 pb-3">
              <div className="bg-surface-card border border-border rounded-sm overflow-hidden">
                <VersionDescription
                  slug={plugin.slug}
                  version={activeVersion?.version || null}
                  fallbackDescription={displayDescription}
                  repoUrl={plugin.repoUrl}
                  commitHash={activeVersion?.fileHash}
                />
              </div>
            </div>
          </div>

          {/* Shield Markdown / HTML */}
          {canEdit && (
            <div className="card overflow-hidden">
              <div className="bg-surface-secondary border-b border-border px-4 py-2 text-sm font-medium text-text-secondary">
                Shield Markdown / HTML
              </div>
              <div className="p-4 grid gap-4">
                <div className="grid gap-2">
                  <div>
                    <img
                      src={`/shield.state/${plugin.slug}`}
                      alt="State"
                      className="h-5"
                    />
                  </div>
                  <div className="text-[12px] font-mono text-error">
                    {`[![State](https://endgit.dev/shield.state/${plugin.slug})](https://endgit.dev/plugins/${plugin.slug})`}
                  </div>
                  <div className="text-[12px] font-mono text-error">
                    {`<a href="https://endgit.dev/plugins/${plugin.slug}"><img src="https://endgit.dev/shield.state/${plugin.slug}" alt="State"></a>`}
                  </div>
                </div>
                <hr className="border-border" />
                <div className="grid gap-2">
                  <div>
                    <img
                      src={`/shield.api/${plugin.slug}`}
                      alt="API"
                      className="h-5"
                    />
                  </div>
                  <div className="text-[12px] font-mono text-error">
                    {`[![API](https://endgit.dev/shield.api/${plugin.slug})](https://endgit.dev/plugins/${plugin.slug})`}
                  </div>
                  <div className="text-[12px] font-mono text-error">
                    {`<a href="https://endgit.dev/plugins/${plugin.slug}"><img src="https://endgit.dev/shield.api/${plugin.slug}" alt="API"></a>`}
                  </div>
                </div>
                <hr className="border-border" />
                <div className="grid gap-2">
                  <div>
                    <img
                      src={`/shield.dl.total/${plugin.slug}`}
                      alt="Downloads total"
                      className="h-5"
                    />
                  </div>
                  <div className="text-[12px] font-mono text-error">
                    {`[![Downloads total](https://endgit.dev/shield.dl.total/${plugin.slug})](https://endgit.dev/plugins/${plugin.slug})`}
                  </div>
                  <div className="text-[12px] font-mono text-error">
                    {`<a href="https://endgit.dev/plugins/${plugin.slug}"><img src="https://endgit.dev/shield.dl.total/${plugin.slug}" alt="Downloads total"></a>`}
                  </div>
                </div>
                <hr className="border-border" />
                <div className="grid gap-2">
                  <div>
                    <img
                      src={`/shield.dl/${plugin.slug}`}
                      alt="Downloads"
                      className="h-5"
                    />
                  </div>
                  <div className="text-[12px] font-mono text-error">
                    {`[![Downloads](https://endgit.dev/shield.dl/${plugin.slug})](https://endgit.dev/plugins/${plugin.slug})`}
                  </div>
                  <div className="text-[12px] font-mono text-error">
                    {`<a href="https://endgit.dev/plugins/${plugin.slug}"><img src="https://endgit.dev/shield.dl/${plugin.slug}" alt="Downloads"></a>`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Chart */}
          <PluginAnalyticsChart slug={plugin.slug} />

          {/* Ratings & Reviews */}
          <div className="plugin-ratings w-full">
            <PluginDiscussion slug={plugin.slug} />
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="plugin-sidebar grid w-full min-w-0 gap-5 xl:max-w-[280px]">
          {/* Producers — based on active version */}
          {activeVersion &&
            activeVersion.producers &&
            activeVersion.producers.length > 0 && (
              <div className="card p-4 lg:p-5 overflow-hidden">
                <h3 className="text-sm font-semibold mb-3 grid grid-flow-col auto-cols-max items-center gap-1.5">
                  Producers{" "}
                  <span className="text-[11px] text-text-muted font-normal">
                    (v{activeVersion.version})
                  </span>
                </h3>
                <div className="grid gap-3">
                  {activeVersion.producers.map((producer: any) => (
                    <div
                      key={producer.githubUser}
                      className="grid grid-cols-[auto_1fr] items-center gap-3"
                    >
                      <Image
                        src={`https://github.com/${producer.githubUser}.png?size=40`}
                        alt={producer.githubUser}
                        width={32}
                        height={32}
                        className="rounded-full object-cover bg-surface-secondary"
                      />
                      <div className="grid gap-0.5">
                        <a
                          href={`https://github.com/${producer.githubUser}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-text-primary no-underline hover:text-[#1890ff]"
                        >
                          @{producer.githubUser}
                        </a>
                        <span
                          className={`text-xs uppercase font-semibold px-1.5 py-0.5 rounded-xs mt-0.5 w-fit border ${getRoleStyle(
                            producer.role,
                          )}`}
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
          <div className="card p-4 lg:p-5 overflow-hidden">
            <h3 className="font-semibold mb-4">Details</h3>
            <div className="grid gap-3">
              <div className="grid grid-cols-[1fr_auto] text-sm">
                <span className="text-text-muted">Type</span>
                <span className="font-semibold uppercase">
                  {plugin.pluginType}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] text-sm">
                <span className="text-text-muted">License</span>
                <span className="font-semibold">{plugin.license || "—"}</span>
              </div>
              {activeVersion &&
                activeVersion.supportedApis &&
                activeVersion.supportedApis.length > 0 && (
                  <div className="grid grid-cols-[1fr_auto] text-sm">
                    <span className="text-text-muted">Endstone API</span>
                    <span className="font-semibold">
                      {activeVersion.supportedApis.join(", ")}
                    </span>
                  </div>
                )}
              {plugin.repoUrl && (
                <div className="grid grid-cols-[1fr_auto] text-sm">
                  <span className="text-text-muted">Repository</span>
                  <a
                    href={plugin.repoUrl}
                    className="grid grid-flow-col auto-cols-max items-center gap-1 font-medium text-[#1890ff] hover:underline"
                  >
                    <GitBranch size={14} /> GitHub
                  </a>
                </div>
              )}
            </div>

            {/* Tags */}
            {plugin.tags && plugin.tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {plugin.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="badge badge-outline text-xs inline-grid grid-cols-[auto_1fr] items-center gap-1"
                    >
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dependency Graph */}
          <DependencyGraph slug={plugin.slug} />
        </aside>
      </div>
    </div>
  );
}

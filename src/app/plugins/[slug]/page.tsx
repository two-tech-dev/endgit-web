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
const DependencyGraph = nextDynamic(() => import("@/components/DependencyGraph"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 h-[200px] grid place-items-center">
      <p className="text-text-muted text-sm">Loading dependency graph...</p>
    </div>
  ),
});
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
const VirusTotalCard = nextDynamic(() => import("@/components/VirusTotalCard"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 h-[200px] grid place-items-center">
      <p className="text-text-muted text-sm">Loading security scan...</p>
    </div>
  ),
});

export const dynamic = "force-dynamic";

const GET_PLUGIN = `
  query GetPlugin($slug: String!) {
    plugin(slug: $slug) {
      id name slug displayName description longDescription iconUrl repoUrl license tags keywords pluginType downloads stars commentCount heatScore status qualityBadge isVerified isFeatured createdAt updatedAt 
      author { id username displayName avatarUrl bio } 
      versions { id version changelog longDescription fileName fileSize fileHash minApiVersion supportedApis downloads isLatest isPreRelease status statusReason createdAt producers { githubUser role } virustotal { scanId status malicious suspicious undetected total permalink scanDate } }
    }
  }
`;

async function getPlugin(slug: string) {
  try {
    const { data } = await fetchGraphQL(GET_PLUGIN, { slug }, { revalidate: 60, noAuth: true });
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
  const pluginAuthorUsername = plugin.author?.username;
  const isAuthor = !!sessionUsername && !!pluginAuthorUsername && sessionUsername === pluginAuthorUsername;
  const canEdit = isAuthor;
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
        return "bg-[#7c3aed]/10 text-[#7c3aed] dark:text-[#c4b5fd] border-[#7c3aed]/25";
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
    <div className="container py-4! lg:py-6!">
      {/* Header Section */}
      <div className="card mb-5 overflow-visible border-border-highlight p-4 transition-colors lg:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] justify-between items-start gap-4 lg:flex-nowrap">
          <div className="plugin-header-inner grid grid-cols-[auto_1fr] gap-4 min-w-0 flex-1">
            <div className="w-[72px] h-[72px] rounded-sm bg-surface-secondary grid place-items-center border border-border shrink-0 overflow-hidden">
              <PluginImage
                iconUrl={plugin.iconUrl}
                repoUrl={plugin.repoUrl}
                alt={`${plugin.displayName} icon`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="heading-2 m-0 flex flex-wrap items-center gap-3">
                  {plugin.displayName}
                  {VERIFIED_ORGS.includes(repoOwnerDetail || "") && (
                    <span
                      title="This plugin is officially supported by EndstoneMC/EndGit"
                      className="inline-grid grid-cols-[auto_1fr] items-center text-accent"
                    >
                      <BadgeCheck size={20} />
                    </span>
                  )}
                  {plugin.versions?.[0]?.isPreRelease && (
                    <span
                      title="This is a pre-release"
                      className="inline-grid grid-cols-[auto_1fr] items-center text-error"
                    >
                      <FlaskConical size={20} />
                    </span>
                  )}
                  {plugin.repoUrl && (
                    <a
                      href={
                        activeVersion?.fileHash
                          ? `${plugin.repoUrl}/tree/${activeVersion.fileHash}`
                          : plugin.repoUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-grid items-center align-super opacity-60 hover:opacity-100 -ml-1"
                      title={
                        activeVersion?.fileHash
                          ? `View source for v${activeVersion.version} on GitHub`
                          : "View repository on GitHub"
                      }
                    >
                      <Image
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
                  <span className="badge badge-cyan grid grid-flow-col auto-cols-max items-center gap-1">
                    <ShieldCheck size={14} /> VERIFIED
                  </span>
                )}

                {canEdit && (
                  <Link
                    href={`/plugins/${plugin.slug}/edit`}
                    className="inline-grid grid-cols-[auto_1fr] items-center gap-1.5 rounded-sm border border-[#7c3aed]/25 bg-[#7c3aed]/10 px-3 py-1 text-[13px] font-medium text-[#7c3aed] no-underline transition-all duration-200 hover:bg-[#7c3aed]/20 dark:text-[#c4b5fd]"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                )}
                {/* Temp Debug Panel */}
                <span className="hidden" data-debug-auth={JSON.stringify({
                  sessionUserId: session?.user?.id || null,
                  pluginAuthorId: plugin.author?.id || null,
                  match: session?.user?.id === plugin.author?.id
                })} />
              </div>
              <p className="text-text-muted mt-1 grid grid-flow-col auto-cols-max items-center gap-1.5">
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
                          className="text-brand no-underline hover:underline"
                        >
                          {repoOwner}
                        </Link>
                        <a
                          href={`https://github.com/${repoOwner}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grid grid-flow-col auto-cols-max items-center opacity-60 hover:opacity-100"
                          title={`View ${repoOwner} on GitHub`}
                        >
                          <Image
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
                        className="text-brand no-underline hover:underline"
                      >
                        {plugin.author.displayName || plugin.author.username}
                      </Link>
                      <a
                        href={`https://github.com/${plugin.author.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid grid-flow-col auto-cols-max items-center opacity-60 hover:opacity-100"
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
              <MarkdownInline className="text-text-secondary mt-2 max-w-[600px] leading-relaxed">
                {plugin.description}
              </MarkdownInline>
            </div>
          </div>

          {/* Download Button & Version Selector */}
          <div className="plugin-header-actions grid gap-2 shrink-0 justify-items-end">
            <VersionSelector
              slug={plugin.slug}
              pluginType={plugin.pluginType}
              versions={displayVersions}
            />
            <div className="flex flex-wrap justify-end gap-4 lg:gap-6 mt-2">
              <div
                className="grid grid-flow-col auto-cols-max items-center gap-1 font-semibold"
                title="Total Downloads"
              >
                <Download size={16} className="text-text-muted" />{" "}
                {(plugin.downloads || 0).toLocaleString()}
                {activeVersion && (
                  <span className="text-xs text-text-muted ml-1 font-normal">
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
      <div className="plugin-layout grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 xl:gap-6 items-start">
        {/* Main Content */}
        <div className="plugin-main-content min-w-0 grid gap-6">
          {/* Quick Install */}
          <div className="card p-4 lg:p-5">
            <h3 className="font-semibold mb-3 grid grid-flow-col auto-cols-max items-center gap-2">
              <Terminal size={18} className="text-[#7c3aed]" /> Quick Install
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

          {/* Analytics Chart */}
          <PluginAnalyticsChart slug={plugin.slug} />

          {/* Ratings & Reviews */}
          <div className="plugin-ratings w-full">
            <PluginDiscussion slug={plugin.slug} />
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="plugin-sidebar grid w-full min-w-0 gap-5 xl:max-w-[280px]">
          {/* VirusTotal Scan */}
          <VirusTotalCard version={activeVersion} />

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
                          className="text-sm font-medium text-text-primary no-underline hover:text-brand"
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
                    className="grid grid-flow-col auto-cols-max items-center gap-1 font-medium text-brand hover:underline"
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

          {/* Badges for Markdown */}
          {canEdit && (
            <div className="card p-4 lg:p-5 overflow-hidden">
              <h3 className="font-semibold mb-4 text-sm">Markdown Badges</h3>
              <p className="text-xs text-text-muted mb-3">
                Show off your plugin stats in your README.
              </p>
              <div className="grid gap-2">
                <div className="grid grid-flow-col auto-cols-max items-center gap-2">
                  <Image
                    src={`https://endgit.dev/shield.dl.total/${plugin.slug}`}
                    alt="Downloads Badge"
                    width={120}
                    height={20}
                    unoptimized
                  />
                </div>
                <div className="bg-surface-secondary p-2 rounded-sm text-[11px] font-mono text-text-muted overflow-x-auto whitespace-nowrap">
                  [![Downloads](https://endgit.dev/shield.dl.total/{plugin.slug}
                  )](https://endgit.dev/plugins/{plugin.slug})
                </div>
              </div>

              <div className="grid gap-2 mt-4">
                <div className="grid grid-flow-col auto-cols-max items-center gap-2">
                  <Image
                    src={`https://endgit.dev/shield.state/${plugin.slug}`}
                    alt="Status Badge"
                    width={120}
                    height={20}
                    unoptimized
                  />
                </div>
                <div className="bg-surface-secondary p-2 rounded-sm text-[11px] font-mono text-text-muted overflow-x-auto whitespace-nowrap">
                  [![Status](https://endgit.dev/shield.state/{plugin.slug}
                  )](https://endgit.dev/plugins/{plugin.slug})
                </div>
              </div>

              <div className="grid gap-2 mt-4">
                <div className="grid grid-flow-col auto-cols-max items-center gap-2">
                  <Image
                    src={`https://endgit.dev/shield.version/${plugin.slug}`}
                    alt="Version Badge"
                    width={120}
                    height={20}
                    unoptimized
                  />
                </div>
                <div className="bg-surface-secondary p-2 rounded-sm text-[11px] font-mono text-text-muted overflow-x-auto whitespace-nowrap">
                  [![Version](https://endgit.dev/shield.version/{plugin.slug}
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

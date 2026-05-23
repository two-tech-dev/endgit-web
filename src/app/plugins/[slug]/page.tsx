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
  Zap,
  Pencil,
  FlaskConical,
  BadgeCheck,
} from "lucide-react";
import dynamic from "next/dynamic";
import { cache } from "react";
import Image from "next/image";
import PluginImage from "@/components/PluginImage";
import VersionSelector from "@/components/VersionSelector";
import NewVersionForm from "@/components/NewVersionForm";
import ChangelogViewer from "@/components/ChangelogViewer";
import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

const MarkdownTabs = dynamic(() => import("@/components/MarkdownTabs"), {
  loading: () => (
    <div className="p-6 text-text-muted text-sm">Loading description...</div>
  ),
});
const PluginAnalyticsChart = dynamic(
  () => import("@/components/PluginAnalyticsChart"),
  {
    loading: () => (
      <div className="card p-6 h-[280px] grid place-items-center">
        <p className="text-text-muted text-sm">Loading analytics...</p>
      </div>
    ),
  },
);
const DependencyGraph = dynamic(() => import("@/components/DependencyGraph"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 h-[200px] grid place-items-center">
      <p className="text-text-muted text-sm">Loading dependency graph...</p>
    </div>
  ),
});
const PluginRatings = dynamic(() => import("@/components/PluginRatings"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 h-[200px] grid place-items-center">
      <p className="text-text-muted text-sm">Loading ratings...</p>
    </div>
  ),
});
const VirusTotalCard = dynamic(() => import("@/components/VirusTotalCard"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 h-[200px] grid place-items-center">
      <p className="text-text-muted text-sm">Loading security scan...</p>
    </div>
  ),
});

const getPlugin = cache(async function getPlugin(slug: string) {
  const { data } = await fetchApi(`/api/v1/plugins/${slug}`, {
    revalidate: 30,
  });
  return data?.data || null;
});

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

  const isAuthor = session?.user?.id === plugin.authorId;
  const repoOwnerDetail = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];

  const displayVersions =
    plugin.versions?.filter((v: any) => isAuthor || v.status === "APPROVED") ||
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
        return "bg-purple-500/10 text-accent border-purple-500/20";
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
    <div className="container !py-6 lg:!py-8">
      {/* Header Section */}
      <div className="card p-4 lg:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] justify-between items-start gap-4 lg:flex-nowrap">
          <div className="plugin-header-inner grid grid-cols-[auto_1fr] gap-4 min-w-0 flex-1">
            <div className="w-[72px] h-[72px] rounded-lg bg-surface-secondary grid place-items-center border border-border shrink-0 overflow-hidden">
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
                  {["EndstoneMC", "two-tech-dev"].includes(
                    repoOwnerDetail || "",
                  ) && (
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
                  <span className="badge badge-cyan flex items-center gap-1">
                    <ShieldCheck size={14} /> VERIFIED
                  </span>
                )}

                {isAuthor && (
                  <Link
                    href={`/plugins/${plugin.slug}/edit`}
                    className="inline-grid grid-cols-[auto_1fr] items-center gap-1.5 px-3 py-1 rounded-md text-[13px] font-medium no-underline bg-purple-500/10 text-accent border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-200"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                )}
              </div>
              <p className="text-text-muted mt-1 flex flex-wrap items-center gap-1.5">
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
                          className="text-accent no-underline hover:underline"
                        >
                          {repoOwner}
                        </Link>
                        <a
                          href={`https://github.com/${repoOwner}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center opacity-60 hover:opacity-100"
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
                        className="text-accent no-underline hover:underline"
                      >
                        {plugin.author.displayName || plugin.author.username}
                      </Link>
                      <a
                        href={`https://github.com/${plugin.author.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center opacity-60 hover:opacity-100"
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
              <p className="text-text-secondary mt-2 max-w-[600px] leading-relaxed">
                {plugin.description}
              </p>
            </div>
          </div>

          {/* Download Button & Version Selector */}
          <div className="plugin-header-actions grid gap-2 shrink-0">
            <VersionSelector
              slug={plugin.slug}
              pluginType={plugin.pluginType}
              versions={displayVersions}
              averageRating={plugin.averageRating}
              downloads={plugin.downloads}
              activeVersionDownloads={activeVersion?.downloads}
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
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Terminal size={18} className="text-accent" /> Quick Install (CLI)
            </h3>
            <div className="bg-[#0f172a] text-[#e2e8f0] px-3 lg:px-4 py-1.5 rounded-md font-mono text-xs lg:text-sm flex items-center justify-between gap-2 overflow-x-auto w-full">
              <code className="whitespace-nowrap">
                endgit install {plugin.slug}
              </code>
              <button className="touch-target bg-transparent border-none cursor-pointer p-3 grid place-items-center shrink-0">
                <Copy size={16} className="text-text-muted" />
              </button>
            </div>
          </div>

          {/* What's New — based on active version */}
          {activeVersion && activeVersion.changelog && (
            <ChangelogViewer
              changelog={activeVersion.changelog}
              version={activeVersion.version}
            />
          )}

          {/* About — Plugin Description */}
          <div className="card p-4 lg:p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-base flex items-center gap-2 m-0">
                Description
              </h3>
              {plugin.repoUrl && (
                <a
                  href={`${plugin.repoUrl}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-1 rounded-md text-[13px] font-medium no-underline bg-surface-secondary text-text-primary border border-border hover:bg-surface-card transition-all"
                >
                  Report Bugs
                </a>
              )}
            </div>

            {/* Body */}
            <MarkdownTabs
              markdown={displayDescription}
              repoUrl={plugin.repoUrl}
              commitHash={activeVersion?.fileHash}
            />
          </div>

          {/* Analytics Chart */}
          <PluginAnalyticsChart slug={plugin.slug} />

          {/* Ratings & Reviews */}
          <div className="plugin-ratings w-full">
            <PluginRatings slug={plugin.slug} authorId={plugin.authorId} />
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="plugin-sidebar w-full xl:max-w-[280px] min-w-0 grid gap-6">
          {/* VirusTotal Scan */}
          <VirusTotalCard version={activeVersion} />

          {/* Producers — based on active version */}
          {activeVersion &&
            activeVersion.producers &&
            activeVersion.producers.length > 0 && (
              <div className="card p-4 lg:p-5 overflow-hidden">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  Producers{" "}
                  <span className="text-[11px] text-text-muted font-normal">
                    (v{activeVersion.version})
                  </span>
                </h3>
                <div className="grid gap-3">
                  {activeVersion.producers.map((producer: any) => (
                    <div
                      key={producer.githubUser}
                      className="flex items-center gap-3"
                    >
                      <Image
                        src={`https://github.com/${producer.githubUser}.png?size=40`}
                        alt={producer.githubUser}
                        width={32}
                        height={32}
                        className="rounded-full object-cover bg-surface-secondary"
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <a
                          href={`https://github.com/${producer.githubUser}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-text-primary no-underline hover:text-accent"
                        >
                          @{producer.githubUser}
                        </a>
                        <span
                          className={`text-xs uppercase font-semibold px-1.5 py-0.5 rounded mt-0.5 w-fit border ${getRoleStyle(
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
                    className="text-accent flex items-center gap-1 font-medium hover:underline"
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
                      className="badge badge-outline text-xs inline-flex items-center gap-1 max-w-full truncate"
                    >
                      <Tag size={10} className="shrink-0" /> <span className="truncate">{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Badges for Markdown */}
          {isAuthor && (
            <div className="card p-4 lg:p-5 overflow-hidden">
              <h3 className="font-semibold mb-4 text-sm">Markdown Badges</h3>
              <p className="text-xs text-text-muted mb-3">
                Show off your plugin stats in your README.
              </p>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-2">
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

              <div className="grid gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://endgit.dev/shield.rating/${plugin.slug}`}
                    alt="Rating Badge"
                  />
                </div>
                <div className="bg-surface-secondary p-2 rounded-sm text-[11px] font-mono text-text-muted overflow-x-auto whitespace-nowrap">
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

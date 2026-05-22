import { Star, Download, Terminal, Copy, GitBranch, Tag, Pencil, FlaskConical, BadgeCheck, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchApi } from "@/lib/api";
import PluginImage from "@/components/PluginImage";
import VersionSelector from "@/components/VersionSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MarkdownTabs = dynamic(() => import("@/components/MarkdownTabs"), {
  loading: () => (
    <div className="p-6 text-sm text-muted-foreground">Loading description...</div>
  ),
});
const PluginAnalyticsChart = dynamic(() => import("@/components/PluginAnalyticsChart"), {
  loading: () => (
    <Card className="border border-border/70 bg-card/80">
      <CardContent className="flex h-[280px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      </CardContent>
    </Card>
  ),
});
const DependencyGraph = dynamic(() => import("@/components/DependencyGraph"), { ssr: false });
const PluginRatings = dynamic(() => import("@/components/PluginRatings"), { ssr: false });
const VirusTotalCard = dynamic(() => import("@/components/VirusTotalCard"), { ssr: false });

async function getPlugin(slug: string) {
  const { data } = await fetchApi(`/api/v1/plugins/${slug}`, { revalidate: 30 });
  return data?.data || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const plugin = await getPlugin(params.slug);
  if (!plugin) return { title: "Plugin Not Found - EndGit" };

  const title = `${plugin.displayName} - Endstone Plugin | EndGit`;
  const description = plugin.description || `Download ${plugin.displayName} for Endstone.`;
  const keywords = plugin.keywords?.length > 0
    ? plugin.keywords.join(", ")
    : `${plugin.name}, endstone plugin, minecraft bedrock`;

  const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
  const authorName = repoOwner || plugin.author?.displayName || plugin.author?.username;
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
    } catch {}
  }

  return {
    title,
    description,
    keywords,
    authors: authorName ? [{ name: authorName, url: authorUrl }] : undefined,
    alternates: { canonical: `/plugins/${params.slug}` },
    openGraph: { title, description, images: [ogImage], type: "website", authors: authorName || undefined },
    twitter: { card: "summary", title, description, images: [ogImage] },
  };
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "COLLABORATOR": return "default";
    case "CONTRIBUTOR": return "secondary";
    case "TRANSLATOR": return "outline";
    case "REQUESTER": return "outline";
    default: return "secondary";
  }
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
    plugin.versions?.filter((v: any) => isAuthor || v.status === "APPROVED") || [];

  const activeVersion = searchParams.v
    ? displayVersions.find((v: any) => v.version === searchParams.v) || displayVersions[0]
    : displayVersions[0];

  const displayDescription =
    activeVersion?.longDescription || plugin.longDescription || plugin.description;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Back */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/plugins">← Back to Plugins</Link>
        </Button>
      </div>

      {/* Header */}
      <header className="mb-6 rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                <PluginImage
                  iconUrl={plugin.iconUrl}
                  repoUrl={plugin.repoUrl}
                  alt={`${plugin.displayName} icon`}
                />
              </div>
              <h1 className="wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl">
                {plugin.displayName}
              </h1>
              {["EndstoneMC", "two-tech-dev"].includes(repoOwnerDetail || "") && (
                <Badge variant="secondary" title="Officially supported">
                  <BadgeCheck className="size-3" />
                  Verified
                </Badge>
              )}
              {plugin.versions?.[0]?.isPreRelease && (
                <Badge variant="destructive">
                  <FlaskConical className="size-3" />
                  Pre-release
                </Badge>
              )}
              {plugin.qualityBadge === "VERIFIED" && (
                <Badge variant="secondary">
                  <ShieldCheck className="size-3" />
                  Verified
                </Badge>
              )}
              {isAuthor && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/plugins/${plugin.slug}/edit`}>
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              by{" "}
              {(() => {
                const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
                if (repoOwner) {
                  return (
                    <>
                      <Link href={`/plugins/by/${repoOwner}`} className="font-medium text-primary underline-offset-4 hover:underline">
                        {repoOwner}
                      </Link>
                    </>
                  );
                }
                return plugin.author ? (
                  <>
                    <Link href={`/plugins/by/${plugin.author.username}`} className="font-medium text-primary underline-offset-4 hover:underline">
                      {plugin.author.displayName || plugin.author.username}
                    </Link>
                  </>
                ) : "Unknown";
              })()}
            </p>

            {plugin.description && (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {plugin.description}
              </p>
            )}
          </div>

          {/* Stats + Version Selector */}
          <div className="flex shrink-0 flex-col items-end gap-3">
            <VersionSelector slug={plugin.slug} pluginType={plugin.pluginType} versions={displayVersions} />
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1 font-semibold">
                <Star className="size-4 text-yellow-500" />
                {(plugin.averageRating || 0).toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold" title="Total Downloads">
                <Download className="size-4 text-muted-foreground" />
                {(plugin.downloads || 0).toLocaleString()}
                {activeVersion && (
                  <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                    ({(activeVersion.downloads || 0).toLocaleString()} this ver)
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main Content */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Quick Install */}
          <Card className="rounded-2xl border border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Terminal className="size-4 text-primary" />
                Quick Install (CLI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg bg-[#0f172a] px-4 py-2.5 font-mono text-sm text-[#e2e8f0]">
                <code>endgit install {plugin.slug}</code>
                <button className="touch-target p-3 text-muted-foreground transition-colors hover:text-foreground">
                  <Copy className="size-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* What's New */}
          {activeVersion?.changelog && (
            <Card className="rounded-2xl border border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-sm">What&apos;s New in v{activeVersion.version}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
                  {activeVersion.changelog}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Plugin Description */}
          <Card className="overflow-hidden rounded-2xl border border-border/70 bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm">Plugin Description</CardTitle>
                <div className="size-1.5 rounded-full bg-green-500" />
              </div>
              <a
                href={plugin.repoUrl ? `${plugin.repoUrl}/issues` : "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="xs">Bugs</Button>
              </a>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <MarkdownTabs
                  markdown={displayDescription}
                  repoUrl={plugin.repoUrl}
                  commitHash={activeVersion?.fileHash}
                />
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <PluginAnalyticsChart slug={plugin.slug} />

          {/* Ratings & Reviews */}
          <PluginRatings slug={plugin.slug} authorId={plugin.authorId} />
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          {/* VirusTotal */}
          <VirusTotalCard version={activeVersion} />

          {/* Producers */}
          {activeVersion?.producers?.length > 0 && (
            <Card className="rounded-2xl border border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-sm">
                  Producers{" "}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (v{activeVersion.version})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeVersion.producers.map((producer: any) => (
                  <div key={producer.githubUser} className="flex items-center gap-3">
                    <Image
                      src={`https://github.com/${producer.githubUser}.png?size=40`}
                      alt={producer.githubUser}
                      width={32}
                      height={32}
                      className="rounded-full object-cover bg-muted"
                    />
                    <div>
                      <a
                        href={`https://github.com/${producer.githubUser}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:underline"
                      >
                        @{producer.githubUser}
                      </a>
                      <div className="mt-0.5">
                        <Badge variant={getRoleBadgeVariant(producer.role)} className="text-[0.6rem] uppercase">
                          {producer.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Details */}
          <Card className="rounded-2xl border border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-semibold uppercase">{plugin.pluginType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">License</span>
                <span className="font-semibold">{plugin.license || "—"}</span>
              </div>
              {activeVersion?.supportedApis?.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Endstone API</span>
                  <span className="font-semibold">{activeVersion.supportedApis.join(", ")}</span>
                </div>
              )}
              {plugin.repoUrl && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Repository</span>
                  <a href={plugin.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary">
                    <GitBranch className="size-3.5" /> GitHub
                  </a>
                </div>
              )}

              {/* Tags */}
              {plugin.tags?.length > 0 && (
                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {plugin.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="gap-0.5">
                        <Tag className="size-2.5" /> {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Markdown Badges (author only) */}
          {isAuthor && (
            <Card className="rounded-2xl border border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-sm">Markdown Badges</CardTitle>
                <CardDescription>Show off your plugin stats in your README.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Downloads", path: "shield.dl.total" },
                  { label: "Status", path: "shield.state" },
                  { label: "Version", path: "shield.version" },
                  { label: "Rating", path: "shield.rating" },
                ].map((badge) => (
                  <div key={badge.label} className="space-y-1.5">
                    <Image
                      src={`https://endgit.dev/${badge.path}/${plugin.slug}`}
                      alt={`${badge.label} Badge`}
                      width={120}
                      height={20}
                      unoptimized
                    />
                    <div className="overflow-x-auto whitespace-nowrap rounded-md bg-muted px-3 py-1.5 font-mono text-[0.65rem] text-muted-foreground">
                      [![{badge.label}](https://endgit.dev/{badge.path}/{plugin.slug})](https://endgit.dev/plugins/{plugin.slug})
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Dependency Graph */}
          <DependencyGraph slug={plugin.slug} />
        </aside>
      </div>
    </main>
  );
}

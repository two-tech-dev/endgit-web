"use client";

import Link from "next/link";
import PluginImage from "@/components/PluginImage";
import { type ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { VERIFIED_ORGS } from "@/lib/constants";
import useSWR from "swr";

interface Plugin {
  id: string;
  slug: string;
  displayName: string;
  description?: string;
  iconUrl?: string;
  repoUrl?: string;
  latestVersion?: string;
  downloads?: number;
  commentCount?: number;
  heatScore?: number;
  createdAt?: string;
  pluginType?: string;
  isFeatured?: boolean;
  isPreRelease?: boolean;
  author?: { displayName?: string; username?: string };
}

interface HomeContentProps {
  hotPlugins: Plugin[];
  newPlugins: Plugin[];
  topPlugins: Plugin[];
  featuredPlugins: Plugin[];
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function SectionLabel({
  marker,
  children,
}: {
  marker: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 border-b border-border pb-2 font-bold text-text-primary">
      <span className="mr-2 text-text-muted">[{marker}]</span>
      {children}
    </div>
  );
}

function PluginRow({
  plugin,
  metric,
}: {
  plugin: Plugin;
  metric: "heat" | "time";
}) {
  const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
  const isVerified = repoOwner ? VERIFIED_ORGS.includes(repoOwner) : false;
  const typeLabel =
    plugin.pluginType === "PYTHON"
      ? "py"
      : plugin.pluginType === "CPP"
        ? "cpp"
        : plugin.pluginType?.toLowerCase();

  return (
    <Link
      href={`/plugins/${plugin.slug}`}
      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border px-0 py-3 text-text-secondary transition-colors last:border-b-0 hover:bg-surface-secondary hover:text-text-primary sm:gap-4 sm:px-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-secondary sm:h-12 sm:w-12">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={plugin.displayName}
        />
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2 text-text-primary">
          <span className="truncate font-semibold">{plugin.displayName}</span>
          {isVerified && (
            <span className="shrink-0 text-xs text-text-muted">[x]</span>
          )}
          {plugin.isPreRelease && (
            <span className="shrink-0 rounded-sm border border-border px-1 py-0.5 text-[10px] text-text-muted">
              pre
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-text-muted">
          {plugin.description || "No description"}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
          {typeLabel && <span>[{typeLabel}]</span>}
          <span>dl {plugin.downloads?.toLocaleString() ?? 0}</span>
          {(plugin.commentCount || 0) > 0 && (
            <span>cm {plugin.commentCount}</span>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right text-xs text-text-muted">
        {metric === "heat"
          ? `heat ${plugin.heatScore || 0}`
          : plugin.createdAt
            ? timeAgo(plugin.createdAt)
            : ""}
      </div>
    </Link>
  );
}

function SidebarFeaturedCard({ plugin }: { plugin: Plugin }) {
  const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
  const isVerified = repoOwner ? VERIFIED_ORGS.includes(repoOwner) : false;

  return (
    <Link
      href={`/plugins/${plugin.slug}`}
      className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-border p-3 transition-colors last:border-b-0 hover:bg-surface-secondary"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-secondary">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={plugin.displayName}
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
          <span className="truncate">{plugin.displayName}</span>
          {isVerified && (
            <span className="shrink-0 text-[10px] text-text-muted">[x]</span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-text-muted">
          {plugin.description || "No description"}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-text-muted">
          <span>dl {plugin.downloads?.toLocaleString() ?? 0}</span>
          {(plugin.commentCount || 0) > 0 && (
            <span>cm {plugin.commentCount}</span>
          )}
        </div>
      </div>
      {(plugin.heatScore || 0) > 0 && (
        <div className="text-xs font-medium text-text-muted">
          {plugin.heatScore}
        </div>
      )}
    </Link>
  );
}

function SidebarTopItem({ plugin, rank }: { plugin: Plugin; rank: number }) {
  return (
    <Link
      href={`/plugins/${plugin.slug}`}
      className="grid grid-cols-[2rem_auto_1fr_auto] items-center gap-2 px-2 py-2 text-sm transition-colors hover:bg-surface-secondary"
    >
      <span className="text-text-muted">{String(rank).padStart(2, "0")}</span>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-secondary">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={plugin.displayName}
        />
      </div>
      <span className="truncate font-medium text-text-primary">
        {plugin.displayName}
      </span>
      <span className="text-xs text-text-muted">
        {plugin.downloads?.toLocaleString() ?? 0}
      </span>
    </Link>
  );
}

export default function HomeContent({
  hotPlugins,
  newPlugins,
  topPlugins,
  featuredPlugins,
}: HomeContentProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/plugins?q=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <div className="container py-12 lg:py-20">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex rounded-sm bg-text-primary px-2 py-1 text-sm text-surface">
            News
          </div>
          <h1 className="mb-5 max-w-3xl text-[28px] font-bold leading-[1.5] text-text-primary sm:text-[34px] lg:text-[38px]">
            The terminal-native registry for Endstone plugins.
          </h1>
          <p className="mb-8 max-w-2xl text-base leading-7 text-text-secondary">
            Discover, build, publish and audit Endstone plugins from GitHub.
            EndGit keeps the marketplace close to the workflow developers
            already live in: commits, builds, releases and command lines.
          </p>

          <form
            onSubmit={handleSearch}
            className="grid max-w-2xl gap-3 sm:grid-cols-[1fr_auto]"
          >
            <label className="relative block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                [?]
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search plugins..."
                className="input h-10 pl-10 text-sm"
              />
            </label>
            <button type="submit" className="btn btn-primary h-10 text-sm">
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dashboard/dev" className="btn btn-secondary text-sm">
              [+] Start Publishing
            </Link>
            <a
              href="https://github.com/two-tech-dev/endgit-cli#installation"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary text-sm"
            >
              [$] Install CLI
            </a>
          </div>
        </div>

        <div className="border bg-[var(--color-text-primary)] p-5 text-[13px] leading-6 text-[var(--color-surface)] sm:p-8">
          <pre className="overflow-hidden whitespace-pre-wrap font-mono">{`ENDGIT\n\n$ endgit plugins search worldedit\n[+] found 12 packages\n[x] verified source repository\n[+] latest build: green\n\n$ endgit publish --from github\n[+] queued build\n[+] release draft created\n\ntab switch panel    ctrl-p commands`}</pre>
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-10 lg:mt-24 lg:pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-12">
            {hotPlugins.length > 0 && (
              <section>
                <SectionLabel marker="+">Hot Today</SectionLabel>
                <div className="border border-border bg-surface-card">
                  {hotPlugins.map((plugin) => (
                    <PluginRow key={plugin.id} plugin={plugin} metric="heat" />
                  ))}
                </div>
                <Link
                  href="/plugins?sort=hot"
                  className="mt-3 inline-flex text-sm text-text-muted hover:text-text-primary hover:underline"
                >
                  See all hot plugins →
                </Link>
              </section>
            )}

            {newPlugins.length > 0 && (
              <section>
                <SectionLabel marker="+">New Releases</SectionLabel>
                <div className="border border-border bg-surface-card">
                  {newPlugins.map((plugin) => (
                    <PluginRow key={plugin.id} plugin={plugin} metric="time" />
                  ))}
                </div>
                <Link
                  href="/plugins?sort=date"
                  className="mt-3 inline-flex text-sm text-text-muted hover:text-text-primary hover:underline"
                >
                  See all new plugins →
                </Link>
              </section>
            )}
          </div>

          <aside className="space-y-10">
            {featuredPlugins.length > 0 && (
              <section>
                <SectionLabel marker="x">Featured</SectionLabel>
                <div className="border border-border bg-surface-card">
                  {featuredPlugins.map((plugin) => (
                    <SidebarFeaturedCard key={plugin.id} plugin={plugin} />
                  ))}
                </div>
              </section>
            )}

            {topPlugins.length > 0 && (
              <section>
                <SectionLabel marker="+">Top This Week</SectionLabel>
                <div className="border border-border bg-surface-card py-1">
                  {topPlugins.map((plugin, i) => (
                    <SidebarTopItem
                      key={plugin.id}
                      plugin={plugin}
                      rank={i + 1}
                    />
                  ))}
                </div>
                <Link
                  href="/plugins/top"
                  className="mt-3 inline-flex text-sm text-text-muted hover:text-text-primary hover:underline"
                >
                  See full leaderboard →
                </Link>
              </section>
            )}

            <YourPlugins />
          </aside>
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-10 lg:mt-24">
        <SectionLabel marker="+">Trusted EndGit Partners</SectionLabel>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://sparkedhost.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center rounded-sm border border-border bg-surface px-8 py-3 transition-colors hover:border-border-highlight hover:bg-surface-secondary"
          >
            <img
              src="/partners/SparkedHost.svg"
              alt="Sparked Host"
              className="h-7 object-contain opacity-80"
            />
          </a>
          <a
            href="mailto:partners@endgit.dev"
            className="flex min-h-12 items-center justify-center rounded-sm border border-dashed border-border px-6 py-3 text-sm text-text-muted transition-colors hover:border-border-highlight hover:text-text-primary hover:underline"
          >
            [+] Become a Partner
          </a>
        </div>
      </section>
    </div>
  );
}

function YourPlugins() {
  const { data: session } = useSession();
  const username = (session?.user as any)?.username;
  const token = (session?.user as any)?.apiToken;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const { data, isLoading } = useSWR(
    username ? `${apiUrl}/api/v1/plugins?author=${username}&pageSize=5` : null,
    (url: string) =>
      fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).then((r) => r.json()),
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  );

  const plugins: Plugin[] = data?.data?.plugins || [];

  if (!session?.user) return null;
  if (isLoading) return null;
  if (plugins.length === 0) return null;

  return (
    <section>
      <SectionLabel marker="+">Your Plugins</SectionLabel>
      <div className="border border-border bg-surface-card py-1">
        {plugins.map((plugin) => (
          <Link
            key={plugin.id}
            href={`/plugins/${plugin.slug}`}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-2 py-2 text-sm transition-colors hover:bg-surface-secondary"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-secondary">
              <PluginImage
                iconUrl={plugin.iconUrl}
                repoUrl={plugin.repoUrl}
                alt={plugin.displayName}
              />
            </div>
            <span className="truncate font-medium text-text-primary">
              {plugin.displayName}
            </span>
            <span className="text-xs text-text-muted">
              {plugin.downloads?.toLocaleString() ?? 0}
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/dashboard/dev"
        className="mt-3 inline-flex text-sm text-text-muted hover:text-text-primary hover:underline"
      >
        Manage your plugins →
      </Link>
    </section>
  );
}

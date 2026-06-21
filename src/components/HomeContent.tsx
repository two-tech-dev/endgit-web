"use client";

import Link from "next/link";
import {
  Flame,
  Sparkles,
  TrendingUp,
  Clock,
  MessageCircle,
  Download,
  BadgeCheck,
  Package,
  Terminal,
} from "lucide-react";
import PluginImage from "@/components/PluginImage";
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

function PluginRow({
  plugin,
  metric,
}: {
  plugin: Plugin;
  metric: "heat" | "time";
}) {
  const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
  const isVerified = repoOwner ? VERIFIED_ORGS.includes(repoOwner) : false;

  return (
    <Link
      href={`/plugins/${plugin.slug}`}
      className="flex items-center gap-4 p-4 rounded-sm border border-transparent hover:border-border hover:bg-surface-secondary transition-all group"
    >
      <div className="w-12 h-12 shrink-0 rounded-sm overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={plugin.displayName}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary group-hover:text-text-primary transition-colors truncate">
            {plugin.displayName}
          </span>
          {isVerified && (
            <BadgeCheck size={14} className="text-brand shrink-0" />
          )}
          {plugin.isPreRelease && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-error bg-error/10 border border-error/20 rounded-xs px-1 py-0.5 shrink-0">
              Pre
            </span>
          )}
        </div>
        <p className="text-sm text-text-muted truncate mt-0.5">
          {plugin.description || "No description"}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {plugin.pluginType && (
            <span className="text-[10px] font-medium text-text-muted bg-surface-secondary border border-border rounded-xs px-1.5 py-0.5">
              {plugin.pluginType === "PYTHON"
                ? "Python"
                : plugin.pluginType === "CPP"
                  ? "C++"
                  : plugin.pluginType}
            </span>
          )}
          <span className="text-[11px] text-text-muted flex items-center gap-0.5">
            <Download size={10} />
            {plugin.downloads?.toLocaleString() ?? 0}
          </span>
          {(plugin.commentCount || 0) > 0 && (
            <span className="text-[11px] text-text-muted flex items-center gap-0.5">
              <MessageCircle size={10} />
              {plugin.commentCount}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        {metric === "heat" ? (
          <div className="flex items-center gap-1 text-warning font-bold text-sm">
            <Flame size={14} />
            {plugin.heatScore || 0}
          </div>
        ) : (
          <span className="text-xs text-text-muted">
            {plugin.createdAt ? timeAgo(plugin.createdAt) : ""}
          </span>
        )}
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
      className="flex items-start gap-3 p-3 rounded-sm hover:bg-surface-secondary transition-colors group"
    >
      <div className="w-10 h-10 shrink-0 rounded-sm overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={plugin.displayName}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-text-primary group-hover:text-text-primary transition-colors truncate">
            {plugin.displayName}
          </span>
          {isVerified && (
            <BadgeCheck size={12} className="text-brand shrink-0" />
          )}
        </div>
        <p className="text-xs text-text-muted truncate mt-0.5">
          {plugin.description || "No description"}
        </p>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted">
          {(plugin.commentCount || 0) > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageCircle size={10} />
              {plugin.commentCount}
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <Download size={10} />
            {plugin.downloads?.toLocaleString() ?? 0}
          </span>
        </div>
      </div>
      {(plugin.heatScore || 0) > 0 && (
        <div className="flex items-center gap-0.5 text-warning font-bold text-xs shrink-0">
          <Flame size={12} />
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
      className="flex items-center gap-3 p-2 rounded-sm hover:bg-surface-secondary transition-colors group"
    >
      <span className="text-sm font-black text-text-muted w-5 text-center shrink-0">
        {rank}
      </span>
      <div className="w-8 h-8 shrink-0 rounded-sm overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={plugin.displayName}
        />
      </div>
      <span className="flex-1 font-medium text-sm text-text-primary group-hover:text-text-primary transition-colors truncate">
        {plugin.displayName}
      </span>
      <span className="text-xs text-text-muted flex items-center gap-0.5 shrink-0">
        <Download size={11} />
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
  return (
    <div className="container py-10 lg:py-14">
      <div className="mb-12 lg:mb-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 max-w-2xl w-full">
          <h1 className="text-3xl lg:text-5xl lg:leading-tight font-extrabold tracking-tight text-text-primary mb-4">
            Discover, build and distribute plugins for Endstone.
          </h1>
          <p className="text-text-secondary text-base lg:text-lg mb-8">
            The official registry for Endstone plugins. Find what you need, or
            publish your own with automated CI/CD.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/dev" className="btn btn-primary px-6 py-2.5">
              Start Publishing
            </Link>
            <a
              href="https://github.com/two-tech-dev/endgit-cli#installation"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary px-6 py-2.5"
            >
              <Terminal size={18} />
              Install CLI
            </a>
          </div>
        </div>

        <div className="w-full lg:w-[480px] shrink-0 hidden md:block">
          <div className="bg-surface-secondary border border-border rounded-lg overflow-hidden shadow-2xl shadow-[#7c3aed]/5">
            <div className="bg-surface border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <div className="flex-1 text-center pr-8 text-[11px] text-text-muted font-mono opacity-60">
                endgit-cli
              </div>
            </div>
            <div className="p-5 font-mono text-[13px] leading-relaxed space-y-2">
              <div>
                <span className="text-[#7c3aed] font-bold">~</span>
                <span className="text-text-muted ml-2">$</span>
                <span className="text-text-primary ml-2">endgit install AutoBroadcast</span>
              </div>
              <div className="text-text-muted opacity-80">Fetching package data from registry...</div>
              <div className="text-success flex items-center gap-2">
                <span>✔</span> Installed AutoBroadcast v1.2.0
              </div>
              
              <div className="pt-2">
                <span className="text-[#7c3aed] font-bold">~/my-plugin</span>
                <span className="text-text-muted ml-2">$</span>
                <span className="text-text-primary ml-2">endgit publish</span>
              </div>
              <div className="text-text-muted opacity-80">Packaging source code...</div>
              <div className="text-text-muted opacity-80">Triggering remote CI build...</div>
              <div className="text-success flex items-center gap-2">
                <span>✔</span> Plugin built and submitted for review!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-12">
        <div className="min-w-0">
          {hotPlugins.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={18} className="text-warning" />
                <h2 className="text-lg font-bold text-text-primary">
                  Hot Today
                </h2>
              </div>
              <div className="divide-y divide-border border border-border rounded-sm overflow-hidden bg-surface-card">
                {hotPlugins.map((plugin) => (
                  <PluginRow key={plugin.id} plugin={plugin} metric="heat" />
                ))}
              </div>
              <Link
                href="/plugins?sort=hot"
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mt-3 transition-colors"
              >
                See all hot plugins →
              </Link>
            </section>
          )}

          {newPlugins.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-brand" />
                <h2 className="text-lg font-bold text-text-primary">
                  New Releases
                </h2>
              </div>
              <div className="divide-y divide-border border border-border rounded-sm overflow-hidden bg-surface-card">
                {newPlugins.map((plugin) => (
                  <PluginRow key={plugin.id} plugin={plugin} metric="time" />
                ))}
              </div>
              <Link
                href="/plugins?sort=date"
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mt-3 transition-colors"
              >
                See all new plugins →
              </Link>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          {featuredPlugins.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-warning" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
                  Featured
                </h3>
              </div>
              <div className="border border-border rounded-sm overflow-hidden bg-surface-card divide-y divide-border">
                {featuredPlugins.map((plugin) => (
                  <SidebarFeaturedCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            </section>
          )}

          {topPlugins.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-success" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
                  Top This Week
                </h3>
              </div>
              <div className="border border-border rounded-sm overflow-hidden bg-surface-card p-2 space-y-0.5">
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
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mt-3 transition-colors"
              >
                See full leaderboard →
              </Link>
            </section>
          )}

          <YourPlugins />
        </aside>
      </div>

      <div className="mt-16 lg:mt-20 pt-10 border-t border-border">
        <p className="text-center text-base font-semibold text-text-primary mb-6">
          Trusted EndGit Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <a
            href="https://sparkedhost.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-8 py-3 rounded-sm border border-border bg-surface-card hover:border-border-highlight transition-all"
          >
            <img
              src="/partners/SparkedHost.svg"
              alt="Sparked Host"
              className="h-7 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </a>
          <a
            href="mailto:partners@endgit.dev"
            className="flex items-center justify-center px-6 py-4 rounded-sm border border-dashed border-border hover:border-border-highlight transition-all text-sm text-text-muted hover:text-text-primary font-medium"
          >
            Become a Partner →
          </a>
        </div>
      </div>
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
      <div className="flex items-center gap-2 mb-3">
        <Package size={16} className="text-brand" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
          Your Plugins
        </h3>
      </div>
      <div className="border border-border rounded-sm overflow-hidden bg-surface-card p-2 space-y-0.5">
        {plugins.map((plugin) => (
          <Link
            key={plugin.id}
            href={`/plugins/${plugin.slug}`}
            className="flex items-center gap-3 p-2 rounded-sm hover:bg-surface-secondary transition-colors group"
          >
            <div className="w-8 h-8 shrink-0 rounded-sm overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
              <PluginImage
                iconUrl={plugin.iconUrl}
                repoUrl={plugin.repoUrl}
                alt={plugin.displayName}
              />
            </div>
            <span className="flex-1 font-medium text-sm text-text-primary group-hover:text-text-primary transition-colors truncate">
              {plugin.displayName}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-0.5 shrink-0">
              <Download size={11} />
              {plugin.downloads?.toLocaleString() ?? 0}
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/dashboard/dev"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mt-3 transition-colors"
      >
        Manage your plugins →
      </Link>
    </section>
  );
}

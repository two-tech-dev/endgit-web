"use client";

import Link from "next/link";
import {
  Search,
  Flame,
  Sparkles,
  TrendingUp,
  Clock,
  MessageCircle,
  Download,
  BadgeCheck,
  Package,
} from "lucide-react";
import PluginImage from "@/components/PluginImage";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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

const VERIFIED_ORGS = ["EndstoneMC", "two-tech-dev"];

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
      className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-border hover:bg-surface-card transition-all group"
    >
      <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={plugin.displayName}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary group-hover:text-brand transition-colors truncate">
            {plugin.displayName}
          </span>
          {isVerified && (
            <BadgeCheck size={14} className="text-brand shrink-0" />
          )}
          {plugin.isPreRelease && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-error bg-error/10 border border-error/20 rounded px-1 py-0.5 shrink-0">
              Pre
            </span>
          )}
        </div>
        <p className="text-sm text-text-muted truncate mt-0.5">
          {plugin.description || "No description"}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {plugin.pluginType && (
            <span className="text-[10px] font-medium text-text-muted bg-surface-secondary border border-border rounded px-1.5 py-0.5">
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
          <div className="flex items-center gap-1 text-orange-400 font-bold text-sm">
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
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors group"
    >
      <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={plugin.displayName}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-text-primary group-hover:text-brand transition-colors truncate">
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
        <div className="flex items-center gap-0.5 text-orange-400 font-bold text-xs shrink-0">
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
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-secondary transition-colors group"
    >
      <span className="text-sm font-black text-text-muted w-5 text-center shrink-0">
        {rank}
      </span>
      <div className="w-8 h-8 shrink-0 rounded-md overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={plugin.displayName}
        />
      </div>
      <span className="flex-1 font-medium text-sm text-text-primary group-hover:text-brand transition-colors truncate">
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
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/plugins?q=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <div className="container py-10 lg:py-14">
      {/* Header */}
      <div className="mb-10 lg:mb-14 max-w-2xl">
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
          Discover, build and distribute plugins for Endstone.
        </h1>
        <p className="text-text-secondary text-base lg:text-lg mb-6">
          The official registry for Endstone plugins. Find what you need, or
          publish your own.
        </p>
        <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plugins..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-surface-secondary text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors"
            />
          </div>
          <Link
            href="/dashboard/dev"
            className="btn btn-primary shrink-0 text-sm px-4"
          >
            Start Publishing
          </Link>
        </form>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-12">
        {/* Main Feed */}
        <div className="min-w-0">
          {/* Hot Today */}
          {hotPlugins.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={18} className="text-orange-400" />
                <h2 className="text-lg font-bold text-text-primary">
                  Hot Today
                </h2>
              </div>
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-surface-card">
                {hotPlugins.map((plugin) => (
                  <PluginRow key={plugin.id} plugin={plugin} metric="heat" />
                ))}
              </div>
              <Link
                href="/plugins?sort=hot"
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand mt-3 transition-colors"
              >
                See all hot plugins →
              </Link>
            </section>
          )}

          {/* New Releases */}
          {newPlugins.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-brand" />
                <h2 className="text-lg font-bold text-text-primary">
                  New Releases
                </h2>
              </div>
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-surface-card">
                {newPlugins.map((plugin) => (
                  <PluginRow key={plugin.id} plugin={plugin} metric="time" />
                ))}
              </div>
              <Link
                href="/plugins?sort=date"
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand mt-3 transition-colors"
              >
                See all new plugins →
              </Link>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Featured */}
          {featuredPlugins.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-yellow-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
                  Featured
                </h3>
              </div>
              <div className="border border-border rounded-xl overflow-hidden bg-surface-card divide-y divide-border">
                {featuredPlugins.map((plugin) => (
                  <SidebarFeaturedCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            </section>
          )}

          {/* Top This Week */}
          {topPlugins.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
                  Top This Week
                </h3>
              </div>
              <div className="border border-border rounded-xl overflow-hidden bg-surface-card p-2 space-y-0.5">
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
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand mt-3 transition-colors"
              >
                See full leaderboard →
              </Link>
            </section>
          )}

          {/* Your Plugins */}
          <YourPlugins />
        </aside>
      </div>
    </div>
  );
}

function YourPlugins() {
  const { data: session } = useSession();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    const token = (session.user as any)?.apiToken;
    const username = (session.user as any)?.username;
    if (!username) return;

    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${apiUrl}/api/v1/plugins?author=${username}&pageSize=5`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.plugins) setPlugins(json.data.plugins);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  if (!session?.user) return null;
  if (loading) return null;
  if (plugins.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Package size={16} className="text-brand" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
          Your Plugins
        </h3>
      </div>
      <div className="border border-border rounded-xl overflow-hidden bg-surface-card p-2 space-y-0.5">
        {plugins.map((plugin) => (
          <Link
            key={plugin.id}
            href={`/plugins/${plugin.slug}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-secondary transition-colors group"
          >
            <div className="w-8 h-8 shrink-0 rounded-md overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
              <PluginImage
                iconUrl={plugin.iconUrl}
                repoUrl={plugin.repoUrl}
                alt={plugin.displayName}
              />
            </div>
            <span className="flex-1 font-medium text-sm text-text-primary group-hover:text-brand transition-colors truncate">
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
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand mt-3 transition-colors"
      >
        Manage your plugins →
      </Link>
    </section>
  );
}

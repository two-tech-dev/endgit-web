import {
  ArrowLeft,
  Trophy,
  Download,
  BadgeCheck,
  MessageCircle,
  Flame,
} from "lucide-react";
import PluginImage from "@/components/PluginImage";
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
      "/api/v1/plugins?sort=downloads&order=desc&pageSize=12",
      { revalidate: 300 },
    );
    plugins = responseData?.data?.plugins || [];
  } catch {
    plugins = [];
  }

  const top3 = [plugins[1], plugins[0], plugins[2]].filter(Boolean); // Order: 2nd, 1st, 3rd for podium
  const rest = plugins.slice(3);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "rank-1-card";
      case 2:
        return "rank-2-card";
      case 3:
        return "rank-3-card";
      default:
        return "border-border bg-surface-card hover:border-brand/30 shadow-lg hover:shadow-brand/10";
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="flex items-center gap-2 text-yellow-500 font-black bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-sm text-xl lg:text-2xl shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <Trophy size={20} className="mb-0.5" /> #1
          </span>
        );
      case 2:
        return (
          <span className="flex items-center gap-1.5 text-slate-300 font-black bg-slate-300/10 border border-slate-300/20 px-3 py-1.5 rounded-sm text-lg lg:text-xl shadow-[0_0_15px_rgba(203,213,225,0.1)]">
            #2
          </span>
        );
      case 3:
        return (
          <span className="flex items-center gap-1.5 text-amber-600 font-black bg-amber-700/10 border border-amber-700/20 px-3 py-1.5 rounded-sm text-lg lg:text-xl shadow-[0_0_15px_rgba(180,83,9,0.1)]">
            #3
          </span>
        );
      default:
        return (
          <span className="text-text-muted font-black text-lg lg:text-xl px-2">
            #{rank}
          </span>
        );
    }
  };

  const renderCard = (plugin: any, rank: number, isPodium: boolean = false) => {
    const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
    const isVerified = repoOwner
      ? ["EndstoneMC", "two-tech-dev"].includes(repoOwner)
      : false;

    // Adjust sizes for podium
    let padding = "p-5";
    let iconSize = "w-14 h-14";
    let titleSize = "text-base";
    let heightClass = "h-full";

    if (isPodium) {
      if (rank === 1) {
        padding = "p-8 lg:p-10";
        iconSize = "w-24 h-24";
        titleSize = "text-2xl lg:text-3xl";
        heightClass = "h-full lg:min-h-[380px]";
      } else {
        padding = "p-6 lg:p-8";
        iconSize = "w-16 h-16";
        titleSize = "text-lg lg:text-xl";
        heightClass = "h-full lg:min-h-[320px]";
      }
    }

    return (
      <Link
        href={`/plugins/${plugin.slug}`}
        key={plugin.id}
        className={`group relative flex flex-col no-underline overflow-hidden rounded-sm border transition-all duration-500 hover:-translate-y-2 ${getRankStyle(
          rank,
        )} ${heightClass}`}
      >
        <div className={`relative z-10 flex flex-col h-full ${padding}`}>
          <div className="flex justify-between items-start mb-6">
            <div
              className={`${iconSize} shrink-0 rounded-sm overflow-hidden bg-surface-secondary border border-border flex items-center justify-center group-hover:border-brand/50 transition-colors shadow-inner`}
            >
              <PluginImage
                iconUrl={plugin.iconUrl}
                repoUrl={plugin.repoUrl}
                alt={`${plugin.displayName} icon`}
              />
            </div>

            {/* Minimal Stat Badge */}
            <div className="flex flex-col items-end gap-1.5 backdrop-blur-sm bg-surface-secondary/50 p-2 rounded-sm border border-border">
              <span className="flex items-center gap-1.5 font-bold text-text-primary text-sm tracking-wide">
                <Download size={14} className="text-brand" />
                {plugin.downloads?.toLocaleString() ?? 0}
              </span>
              {(plugin.heatScore || 0) > 0 && (
                <span className="text-orange-400 text-xs flex items-center gap-1 font-semibold">
                  <Flame size={12} />
                  <span>{plugin.heatScore}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end mt-6 pr-16 lg:pr-20">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">
                {repoOwner ||
                  plugin.author?.displayName ||
                  plugin.author?.username ||
                  "Community"}
              </span>
              {isVerified && (
                <span className="text-brand shrink-0">
                  <BadgeCheck size={12} />
                </span>
              )}
            </div>
            <h3
              className={`${titleSize} font-extrabold m-0 text-text-primary group-hover:text-brand transition-colors tracking-tight line-clamp-1`}
            >
              {plugin.displayName}
            </h3>

            <div className="mt-4 flex items-center">
              <span className="font-mono bg-surface-secondary border border-border px-2 py-1 rounded-xs text-xs text-text-secondary">
                v{plugin.latestVersion || "1.0.0"}
              </span>
            </div>
          </div>

          {/* Enlarged Bottom-Right Rank Badge */}
          <div className="absolute bottom-5 right-5 lg:bottom-8 lg:right-8 shrink-0">
            {getRankBadge(rank)}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="container py-10 lg:py-16 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-500/5 blur-[120px] rounded-sm pointer-events-none z-0" />

      <div className="mb-16 relative z-10 text-center flex flex-col items-center">
        <Link
          href="/plugins"
          className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-6 text-sm no-underline font-semibold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Registry
        </Link>
        <Trophy
          size={48}
          className="text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
        />
        <h1 className="heading-1 m-0 mb-4">Top Plugins</h1>
        <p className="text-text-secondary text-lg max-w-lg font-medium">
          The most downloaded Endstone plugins of all time.
        </p>
      </div>

      {/* The Podium (Top 3) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end mb-12 relative z-10 lg:px-12">
          <div className="order-2 lg:order-1">
            {top3[0] && renderCard(top3[0], 2, true)}
          </div>
          <div className="order-1 lg:order-2 z-10 -translate-y-4 lg:-translate-y-8">
            {top3[1] && renderCard(top3[1], 1, true)}
          </div>
          <div className="order-3 lg:order-3">
            {top3[2] && renderCard(top3[2], 3, true)}
          </div>
        </div>
      )}

      {/* Perfect Grid (Ranks 4-12) */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {rest.map((plugin, index) => renderCard(plugin, index + 4))}
        </div>
      )}
    </div>
  );
}

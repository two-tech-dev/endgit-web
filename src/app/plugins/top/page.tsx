import { Download, BadgeCheck, Flame } from "lucide-react";
import PluginImage from "@/components/PluginImage";
import { fetchApi } from "@/lib/api";
import { VERIFIED_ORGS } from "@/lib/constants";
import Link from "next/link";

export const metadata = {
  title: "Top Plugins - EndGit",
  description: "The most downloaded Endstone plugins on EndGit.",
};

export default async function TopPluginsPage() {
  let plugins: any[] = [];
  try {
    const { data: responseData } = await fetchApi(
      "/api/v1/plugins?sort=downloads&order=desc&pageSize=25",
      { revalidate: 300 },
    );
    plugins = responseData?.data?.plugins || [];
  } catch {
    plugins = [];
  }

  const topDownloads = plugins[0]?.downloads || 0;

  const rankAccent = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-amber-300";
      case 2:
        return "text-slate-300";
      case 3:
        return "text-amber-600";
      default:
        return "text-text-muted";
    }
  };

  return (
    <div className="container py-6 lg:py-10">
      <div className="mb-6 flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-wider text-text-muted">
            Leaderboard
          </p>
          <h1 className="heading-2 m-0">Top Plugins</h1>
          <p className="mt-1 text-sm text-text-muted">
            Ranked by total downloads across the registry.
          </p>
        </div>
        <Link
          href="/plugins"
          className="text-sm text-text-muted hover:text-text-primary hover:underline"
        >
          ← Back to registry
        </Link>
      </div>

      {plugins.length === 0 ? (
        <div className="card grid place-items-center p-12 text-center text-sm text-text-muted">
          No plugins available yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-border bg-surface-card">
          {/* Header row (desktop) */}
          <div className="hidden grid-cols-[3rem_minmax(0,1fr)_8rem_6rem_5rem] items-center gap-4 border-b border-border bg-surface-secondary px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-text-muted lg:grid">
            <span className="text-center">#</span>
            <span>Plugin</span>
            <span className="text-right">Downloads</span>
            <span className="text-right">Heat</span>
            <span className="text-right">Version</span>
          </div>

          {plugins.map((plugin, index) => {
            const rank = index + 1;
            const repoOwner =
              plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
            const isVerified = repoOwner
              ? VERIFIED_ORGS.includes(repoOwner)
              : false;
            const author =
              repoOwner ||
              plugin.author?.displayName ||
              plugin.author?.username ||
              "Community";
            const share = topDownloads
              ? Math.max(
                  4,
                  Math.round(((plugin.downloads || 0) / topDownloads) * 100),
                )
              : 0;

            return (
              <Link
                key={plugin.id}
                href={`/plugins/${plugin.slug}`}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-3 py-3 no-underline transition-colors last:border-b-0 hover:bg-surface-secondary lg:grid-cols-[3rem_minmax(0,1fr)_8rem_6rem_5rem] lg:gap-4 lg:px-4"
              >
                {/* Rank */}
                <span
                  className={`text-center font-mono text-base font-bold ${rankAccent(rank)}`}
                >
                  {String(rank).padStart(2, "0")}
                </span>

                {/* Plugin identity */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-secondary">
                    <PluginImage
                      iconUrl={plugin.iconUrl}
                      repoUrl={plugin.repoUrl}
                      alt={`${plugin.displayName} icon`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-bold text-text-primary group-hover:text-[#1890ff]">
                        {plugin.displayName}
                      </span>
                      {isVerified && (
                        <BadgeCheck
                          size={13}
                          className="shrink-0 text-[#1890ff]"
                        />
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
                      <span className="truncate">{author}</span>
                      {/* mobile-only stats */}
                      <span className="flex items-center gap-1 lg:hidden">
                        <Download size={11} />
                        {plugin.downloads?.toLocaleString() ?? 0}
                      </span>
                    </div>
                    {/* progress bar */}
                    <div className="mt-1.5 hidden h-1 w-full overflow-hidden rounded-full bg-surface-secondary lg:block">
                      <div
                        className="h-full rounded-full bg-[#1890ff]/70"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Downloads (desktop) */}
                <span className="hidden text-right font-mono text-sm font-semibold text-text-primary lg:block">
                  {plugin.downloads?.toLocaleString() ?? 0}
                </span>

                {/* Heat (desktop) */}
                <span className="hidden items-center justify-end gap-1 text-right font-mono text-sm text-warning lg:flex">
                  {(plugin.heatScore || 0) > 0 ? (
                    <>
                      <Flame size={12} />
                      {plugin.heatScore}
                    </>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </span>

                {/* Version (desktop) + mobile compact column */}
                <span className="text-right font-mono text-xs text-text-muted">
                  v{plugin.latestVersion || "1.0.0"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

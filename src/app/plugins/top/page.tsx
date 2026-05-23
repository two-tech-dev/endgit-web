import { ArrowLeft, Trophy, Download, BadgeCheck, Star } from "lucide-react";
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
      "/api/v1/plugins?sort=downloads&order=desc&pageSize=10",
      { revalidate: 300 },
    );
    plugins = responseData?.data?.plugins || [];
  } catch {
    plugins = [];
  }

  return (
    <div className="container py-6 lg:py-8">
      <div className="mb-8">
        <Link
          href="/plugins"
          className="inline-flex items-center gap-2 text-text-muted hover:text-brand transition-colors mb-4 text-sm no-underline"
        >
          <ArrowLeft size={16} /> Back to Plugins
        </Link>
        <div className="flex items-center gap-3">
          <Trophy size={32} className="text-warning shrink-0" />
          <h1 className="heading-2 m-0">Top Plugins</h1>
        </div>
        <p className="text-text-muted mt-2 text-sm">
          The most downloaded Endstone plugins of all time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-6 align-content-start">
        {plugins.map((plugin: any, index: number) => {
          const avgRating = plugin.stars
            ? Math.round((plugin.stars / 20) * 10) / 10
            : 0;
          const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
          const isVerified = repoOwner
            ? ["EndstoneMC", "two-tech-dev"].includes(repoOwner)
            : false;

          return (
            <Link
              href={`/plugins/${plugin.slug}`}
              key={plugin.id}
              className="card p-0 flex flex-col no-underline bg-surface-card overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all relative"
            >
              {/* Rank Badge */}
              <div
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 shadow-sm ${
                  index === 0
                    ? "bg-warning text-black"
                    : index === 1
                      ? "bg-slate-300 text-black dark:bg-slate-400"
                      : index === 2
                        ? "bg-amber-700 text-white"
                        : "bg-surface-secondary text-text-secondary border border-border"
                }`}
              >
                #{index + 1}
              </div>

              <div className="plugin-card-inner p-4 flex gap-4 items-center pr-14">
                {/* Left: Icon */}
                <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
                  <PluginImage
                    iconUrl={plugin.iconUrl}
                    repoUrl={plugin.repoUrl}
                    alt={`${plugin.displayName} icon`}
                  />
                </div>

                {/* Middle: Title, Version, Author */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold m-0 text-brand overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-1.5">
                    {plugin.displayName}
                    {isVerified && (
                      <span
                        title="This plugin is officially supported by EndstoneMC/EndGit"
                        className="inline-flex items-center text-brand shrink-0"
                      >
                        <BadgeCheck size={15} />
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                    <span className="font-mono bg-surface-secondary px-1.5 py-0.5 rounded text-[11px]">
                      v{plugin.latestVersion || "1.0.0"}
                    </span>
                    <span>•</span>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {repoOwner ||
                        plugin.author?.displayName ||
                        plugin.author?.username ||
                        "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Right: Date & Stats */}
                <div className="flex flex-col items-end gap-1.5 text-xs text-text-muted shrink-0">
                  <span className="flex items-center gap-1 font-semibold text-text-secondary">
                    <Download size={13} className="text-text-muted" />
                    {plugin.downloads?.toLocaleString() ?? 0}
                  </span>
                  {avgRating > 0 ? (
                    <span className="text-warning text-xs flex items-center gap-0.5 font-medium">
                      <Star size={13} className="fill-current" />
                      <span>{avgRating.toFixed(1)}</span>
                    </span>
                  ) : (
                    <span className="text-[11px]">
                      {new Date(plugin.createdAt || "").toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                        },
                      )}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

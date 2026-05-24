import {
  Search,
  BadgeCheck,
  Download,
  MessageCircle,
  Flame,
} from "lucide-react";
import PluginImage from "@/components/PluginImage";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `Plugins by ${params.username} - EndGit`,
    description: `Browse all Endstone plugins published by ${params.username}.`,
  };
}

export default async function AuthorPluginsPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  // Fetch plugins by this author
  const { data: responseData } = await fetchApi(
    `/api/v1/plugins?author=${username}`,
    { revalidate: 120 },
  );
  const realPlugins = responseData?.data?.plugins || [];

  return (
    <div className="container py-6 lg:py-8">
      <div className="mb-8">
        <h1 className="heading-2 grid grid-flow-col auto-cols-max items-center gap-2">
          Plugins by <span className="text-brand">{username}</span>
        </h1>
        <p className="text-text-muted mt-1.5 text-sm">
          Viewing all {realPlugins.length} plugins created by this author.
        </p>
      </div>

      {realPlugins.length === 0 ? (
        <div className="card p-8 text-center">
          <Search
            size={32}
            className="text-text-muted mx-auto mb-4 opacity-50"
          />
          <h3 className="text-lg font-semibold text-text-primary">
            No plugins found
          </h3>
          <p className="text-text-muted mt-1 text-sm">
            This author has not published any plugins yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 align-content-start">
          {realPlugins.map((plugin: any) => {
            const isFeatured = plugin.isFeatured;
            const repoOwner =
              plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
            const isVerified = repoOwner
              ? ["EndstoneMC", "two-tech-dev"].includes(repoOwner)
              : false;

            return (
              <Link
                href={`/plugins/${plugin.slug}`}
                key={plugin.id}
                className="card p-0 grid no-underline bg-surface-card overflow-hidden transition-all"
              >
                <div className="plugin-card-inner p-4 grid grid-flow-col auto-cols-max gap-4 items-center">
                  {/* Left: Icon */}
                  <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-surface-secondary border border-border grid place-items-center">
                    <PluginImage
                      iconUrl={plugin.iconUrl}
                      repoUrl={plugin.repoUrl}
                      alt={`${plugin.displayName} icon`}
                    />
                  </div>

                  {/* Middle: Title, Version, Author */}
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold m-0 text-brand overflow-hidden text-ellipsis whitespace-nowrap grid grid-flow-col auto-cols-max items-center gap-1.5">
                      {plugin.displayName}
                      {isVerified && (
                        <span
                          title="This plugin is officially supported by EndstoneMC/EndGit"
                          className="inline-grid grid-cols-[auto_1fr] items-center text-brand shrink-0"
                        >
                          <BadgeCheck size={15} />
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-flow-col auto-cols-max items-center gap-2 text-xs text-text-muted mt-1">
                      <span className="font-mono bg-surface-secondary px-1.5 py-0.5 rounded text-[11px]">
                        v{plugin.latestVersion || "1.0.0"}
                      </span>
                      <span>•</span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1] ||
                          plugin.author?.displayName ||
                          plugin.author?.username}
                      </span>
                    </div>
                  </div>

                  {/* Right: Date & Stats */}
                  <div className="grid gap-1.5 items-end text-xs text-text-muted shrink-0">
                    <span className="grid grid-flow-col auto-cols-max items-center gap-1 font-semibold text-text-secondary">
                      <Download size={13} className="text-text-muted" />
                      {plugin.downloads?.toLocaleString() ?? 0}
                    </span>
                    {(plugin.heatScore || 0) > 0 ? (
                      <span className="text-orange-400 text-xs grid grid-flow-col auto-cols-max items-center gap-0.5 font-medium">
                        <Flame size={13} />
                        <span>{plugin.heatScore}</span>
                      </span>
                    ) : (plugin.commentCount || 0) > 0 ? (
                      <span className="text-text-muted text-xs grid grid-flow-col auto-cols-max items-center gap-0.5 font-medium">
                        <MessageCircle size={13} />
                        <span>{plugin.commentCount}</span>
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

                {/* Bottom: Featured Banner */}
                {isFeatured && (
                  <div className="px-3 pb-3 grid justify-items-center">
                    <div className="w-full py-1 text-center bg-emerald-500/10 text-emerald-500 text-xs font-semibold rounded border border-emerald-500/20">
                      Featured
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

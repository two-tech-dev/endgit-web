import { ArrowRight, BadgeCheck, Download, Star } from "lucide-react";
import Link from "next/link";
import PluginImage from "@/components/PluginImage";
import FadeIn from "@/components/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

interface Plugin {
  id: string;
  slug: string;
  displayName: string;
  iconUrl?: string;
  repoUrl?: string;
  latestVersion?: string;
  stars?: number;
  downloads?: number;
  createdAt?: string;
  author?: { displayName?: string; username?: string };
}

export default async function LatestPluginsSection() {
  let plugins: Plugin[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(
      `${apiUrl}/api/v1/plugins/latest?page=1&pageSize=6`,
      { next: { revalidate: 60 } },
    );
    const json = await res.json();
    if (json?.success && json?.data?.plugins) {
      plugins = json.data.plugins;
    }
  } catch {
    return null;
  }

  if (plugins.length === 0) return null;

  const VERIFIED_ORGS = ["EndstoneMC", "two-tech-dev"];

  return (
    <section className="container pb-10 lg:pb-16">
      <FadeIn>
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-text-primary m-0">
              Recent Releases
            </h2>
            <p className="text-text-secondary text-[17px] mt-2">
              The latest additions to the Endstone ecosystem.
            </p>
          </div>
          <Link
            href="/plugins"
            className="btn btn-secondary inline-flex items-center gap-1.5 no-underline text-sm"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
        {plugins.map((plugin) => {
          const avgRating = plugin.stars
            ? Math.round((plugin.stars / 20) * 10) / 10
            : 0;
          const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
          const isVerified = repoOwner
            ? VERIFIED_ORGS.includes(repoOwner)
            : false;

          return (
            <StaggerItem key={plugin.id}>
              <Link
                href={`/plugins/${plugin.slug}`}
                className="card p-0 flex flex-col no-underline bg-surface-card overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all h-full"
              >
                <div className="p-4 flex gap-4 items-center">
                  <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-surface-secondary border border-border flex items-center justify-center">
                    <PluginImage
                      iconUrl={plugin.iconUrl}
                      repoUrl={plugin.repoUrl}
                      alt={`${plugin.displayName} icon`}
                    />
                  </div>

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
                        {plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1] ||
                          plugin.author?.displayName ||
                          plugin.author?.username}
                      </span>
                    </div>
                  </div>

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
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}

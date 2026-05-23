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
    <section className="container pb-10 lg:pb-24 relative">
      {/* Premium Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <FadeIn>
        <div className="flex justify-between items-end mb-12 flex-wrap gap-6 relative z-10">
          <div>
            <span className="text-muted mb-3 block">Selected Works</span>
            <h2 className="heading-2 m-0">
              Recent <span className="text-brand">Releases</span>
            </h2>
          </div>
          <Link
            href="/plugins"
            className="btn btn-secondary !bg-white/5 !border-white/10 hover:!bg-white/10 inline-flex items-center gap-2 no-underline text-xs uppercase tracking-widest font-bold px-6"
          >
            View Archive <ArrowRight size={14} />
          </Link>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {plugins.map((plugin, i) => {
          const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
          const isVerified = repoOwner
            ? VERIFIED_ORGS.includes(repoOwner)
            : false;

          // Featured / Large Card (First item)
          const isLarge = i === 0;

          return (
            <div
              key={plugin.id}
              className={`${isLarge ? "lg:col-span-8" : "lg:col-span-4"}`}
            >
              <StaggerItem className="h-full">
                <Link
                  href={`/plugins/${plugin.slug}`}
                  className={`group flex flex-col no-underline transition-all duration-500 h-full ${
                    isLarge
                      ? "glass-panel p-8 lg:p-12 !rounded-xl border-brand/20 bg-brand/5 dark:bg-brand/5 hover:bg-brand/10 hover:border-brand/40"
                      : "card p-6 bg-surface-card border-border hover:border-brand/30"
                  }`}
                  style={isLarge ? { background: 'var(--is-light, rgba(0, 242, 255, 0.02))' } : {}}
                >
                  <div
                    className={`flex gap-6 ${isLarge ? "flex-col md:flex-row items-start md:items-center" : "flex-col"}`}
                  >
                    <div
                      className={`${isLarge ? "w-24 h-24" : "w-14 h-14"} shrink-0 rounded-lg overflow-hidden bg-surface-secondary border border-border flex items-center justify-center group-hover:border-brand/50 transition-colors`}
                    >
                      <PluginImage
                        iconUrl={plugin.iconUrl}
                        repoUrl={plugin.repoUrl}
                        alt={`${plugin.displayName} icon`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand/70">
                          {plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1] ||
                            "Community"}
                        </span>
                        {isVerified && (
                          <span className="text-brand shrink-0">
                            <BadgeCheck size={14} />
                          </span>
                        )}
                      </div>
                      <h3
                        className={`${isLarge ? "text-3xl lg:text-4xl" : "text-xl"} font-extrabold m-0 text-text-primary group-hover:text-brand transition-colors tracking-tight`}
                      >
                        {plugin.displayName}
                      </h3>
                      {isLarge && (
                        <p className="text-text-secondary mt-4 text-lg leading-relaxed max-w-md">
                          Experience the next generation of Endstone plugins
                          with {plugin.displayName}. Seamlessly integrated and
                          highly optimized.
                        </p>
                      )}
                    </div>

                    <div
                      className={`flex ${isLarge ? "md:flex-col items-end" : "items-center mt-4"} gap-4 text-sm text-text-muted`}
                    >
                      <span className="flex items-center gap-2 font-mono text-xs bg-surface-secondary px-2 py-1 rounded text-text-secondary">
                        v{plugin.latestVersion || "1.0.0"}
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-text-primary">
                        <Download size={14} className="text-brand" />
                        {plugin.downloads?.toLocaleString() ?? 0}
                      </span>
                    </div>
                  </div>

                  {isLarge && (
                    <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((n) => (
                            <div
                              key={n}
                              className="w-8 h-8 rounded-full border-2 border-surface bg-surface-secondary"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                          Trusted by developers
                        </span>
                      </div>
                      <div className="btn !bg-brand !text-black font-black uppercase tracking-tighter px-8 group-hover:scale-105 transition-transform">
                        Explore <ArrowRight size={18} />
                      </div>
                    </div>
                  )}
                </Link>
              </StaggerItem>
            </div>
          );
        })}
      </div>
    </section>
  );
}

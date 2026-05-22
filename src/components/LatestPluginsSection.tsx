"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Download, Star, BadgeCheck } from "lucide-react";
import Link from "next/link";
import PluginImage from "@/components/PluginImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Plugin {
  id: string;
  slug: string;
  displayName: string;
  description?: string;
  iconUrl?: string;
  repoUrl?: string;
  latestVersion?: string;
  stars?: number;
  downloads?: number;
  createdAt?: string;
  type?: string;
  isFeatured?: boolean;
  isPreRelease?: boolean;
  author?: { displayName?: string; username?: string };
}

function formatDownloads(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function LatestPluginsSection() {
  const VERIFIED_ORGS = ["EndstoneMC", "two-tech-dev"];
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPlugins() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/api/v1/plugins/latest?page=1&pageSize=6`);
        const json = await res.json();
        if (json?.success && json?.data?.plugins) {
          setPlugins(json.data.plugins);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPlugins();
  }, []);

  if (error && plugins.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            Recent Releases
          </span>
          <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
            Latest Plugins
          </h2>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/plugins">
            View All <ArrowRight size={14} />
          </Link>
        </Button>
      </div>

      {!loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plugins.map((plugin) => {
            const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
            const isVerified = repoOwner ? VERIFIED_ORGS.includes(repoOwner) : false;

            return (
              <Link
                key={plugin.id}
                href={`/plugins/${plugin.slug}`}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="cursor-pointer rounded-xl border border-border/70 bg-card/80 py-0 transition-all hover:-translate-y-0.5 hover:border-primary/35">
                  <CardContent className="flex items-center gap-3 px-4 py-3">
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                      <PluginImage
                        iconUrl={plugin.iconUrl}
                        repoUrl={plugin.repoUrl}
                        alt={`${plugin.displayName} icon`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {plugin.displayName}
                        </span>
                        {isVerified && (
                          <BadgeCheck size={13} className="shrink-0 text-primary" />
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[0.7rem] text-muted-foreground">
                        <span className="truncate">
                          {plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1] ||
                            plugin.author?.displayName ||
                            plugin.author?.username}
                        </span>
                        <span>·</span>
                        <span>v{plugin.latestVersion || "1.0.0"}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-[0.7rem] text-muted-foreground">
                      {plugin.stars !== undefined && plugin.stars > 0 && (
                        <span className="inline-flex items-center gap-0.5">
                          <Star className="size-3" />
                          {plugin.stars}
                        </span>
                      )}
                      {plugin.downloads !== undefined && (
                        <span className="inline-flex items-center gap-0.5">
                          <Download className="size-3" />
                          {formatDownloads(plugin.downloads)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/80 px-4 py-3"
            >
              <div className="size-9 shrink-0 animate-pulse rounded-lg bg-muted" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-8 animate-pulse rounded bg-muted" />
                <div className="h-3 w-10 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

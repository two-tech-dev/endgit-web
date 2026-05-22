"use client";

import Link from "next/link";
import { Star, Download, BadgeCheck, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PluginImage from "@/components/PluginImage";

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

export default function PluginCardGrid({ plugins }: { plugins: Plugin[] }) {
  const VERIFIED_ORGS = ["EndstoneMC", "two-tech-dev"];

  if (plugins.length === 0) {
    return (
      <Card className="border border-border/70 bg-card/85">
        <CardHeader>
          <CardTitle>No plugins found</CardTitle>
          <CardDescription>
            Try adjusting your search or filters.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid min-w-0 auto-rows-min content-start gap-4">
      {plugins.map((plugin) => {
        const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
        const isVerified = repoOwner
          ? VERIFIED_ORGS.includes(repoOwner)
          : false;

        return (
          <Link
            key={plugin.id}
            href={`/plugins/${plugin.slug}`}
            className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="flex h-full cursor-pointer flex-col rounded-2xl border border-border/70 bg-card/85 transition-all hover:-translate-y-0.5 hover:border-primary/35">
              <CardHeader className="gap-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="flex items-center gap-2">
                    {plugin.iconUrl ? (
                      <div className="size-7 shrink-0 overflow-hidden rounded-md border border-border">
                        <PluginImage
                          iconUrl={plugin.iconUrl}
                          repoUrl={plugin.repoUrl}
                          alt={`${plugin.displayName} icon`}
                        />
                      </div>
                    ) : null}
                    <CardTitle className="wrap-break-word text-balance text-base sm:text-lg">
                      {plugin.displayName}
                    </CardTitle>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {plugin.latestVersion && (
                      <Badge variant="outline">
                        v{plugin.latestVersion}
                      </Badge>
                    )}
                    {isVerified && (
                      <Badge
                        variant="secondary"
                        title="Officially supported"
                      >
                        <BadgeCheck className="size-3" />
                        Verified
                      </Badge>
                    )}
                    {plugin.isPreRelease && (
                      <Badge variant="destructive">
                        <FlaskConical className="size-3" />
                        Pre-release
                      </Badge>
                    )}
                    {plugin.isFeatured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                  <span>
                    By{" "}
                    {plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1] ||
                      plugin.author?.displayName ||
                      plugin.author?.username}
                  </span>
                  <span>
                    {plugin.createdAt
                      ? new Date(plugin.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : ""}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5" />
                    {plugin.stars ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Download className="size-3.5" />
                    {formatDownloads(plugin.downloads ?? 0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-primary">
                  Open
                </span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

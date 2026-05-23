"use client";

import Link from "next/link";
import { FlaskConical, BadgeCheck, Download, Star } from "lucide-react";
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

export default function PluginCardGrid({ plugins }: { plugins: Plugin[] }) {
  const VERIFIED_ORGS = ["EndstoneMC", "two-tech-dev"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 align-content-start">
      {plugins.map((plugin, i) => {
        const avgRating = plugin.stars
          ? Math.round((plugin.stars / 20) * 10) / 10
          : 0;
        const isFeatured = plugin.isFeatured;
        const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
        const isVerified = repoOwner
          ? VERIFIED_ORGS.includes(repoOwner)
          : false;

        return (
          <Link
            href={`/plugins/${plugin.slug}`}
            key={plugin.id}
            className="card p-0 flex flex-col no-underline bg-surface-card overflow-hidden transition-all"
            style={{
              animation: `fadeSlideUp 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${Math.min(i * 0.04, 0.3)}s both`,
            }}
          >
            <div className="plugin-card-inner p-4 flex gap-4 items-center">
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
                  {plugin.isPreRelease && (
                    <span
                      title="This is a pre-release"
                      className="inline-flex items-center text-error shrink-0"
                    >
                      <FlaskConical size={15} />
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

            {isFeatured && (
              <div className="px-3 pb-3 flex justify-center">
                <div className="w-full py-1 text-center bg-emerald-500/10 text-emerald-500 text-xs font-semibold rounded border border-emerald-500/20">
                  Featured
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}

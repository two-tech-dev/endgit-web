"use client";

import Link from "next/link";
import { BadgeCheck, Download, MessageCircle, Flame } from "lucide-react";
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
  commentCount?: number;
  heatScore?: number;
  createdAt?: string;
  isFeatured?: boolean;
  isPreRelease?: boolean;
  author?: { displayName?: string; username?: string };
}

export default function PluginCardGrid({ plugins }: { plugins: Plugin[] }) {
  const VERIFIED_ORGS = ["EndstoneMC", "two-tech-dev"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 align-content-start">
      {plugins.map((plugin, i) => {
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
                <h3 className="text-base font-semibold m-0 text-brand overflow-hidden text-ellipsis whitespace-nowrap">
                  {plugin.displayName}
                </h3>
                <div className="flex items-center gap-2 min-w-0 flex-wrap mt-1">
                  {plugin.isPreRelease && (
                    <span
                      title="This is a pre-release"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-error bg-error/10 border border-error/20 rounded px-1.5 py-0.5 shrink-0"
                    >
                      Pre-release
                    </span>
                  )}
                  {isVerified && (
                    <span
                      title="Officially supported by EndstoneMC/EndGit"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand bg-brand/10 border border-brand/20 rounded px-1.5 py-0.5 shrink-0"
                    >
                      <BadgeCheck size={11} />
                      Verified
                    </span>
                  )}
                  {isFeatured && (
                    <span
                      title="Featured plugin"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5 shrink-0"
                    >
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-muted mt-1">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1] ||
                      plugin.author?.displayName ||
                      plugin.author?.username}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1 font-semibold text-text-secondary">
                    <Download size={13} className="text-text-muted" />
                    {plugin.downloads?.toLocaleString() ?? 0}
                  </span>
                  <div className="flex items-center gap-2">
                    {(plugin.heatScore || 0) > 0 && (
                      <span className="flex items-center gap-0.5 font-medium text-orange-400">
                        <Flame size={12} />
                        {plugin.heatScore}
                      </span>
                    )}
                    {(plugin.commentCount || 0) > 0 && (
                      <span className="flex items-center gap-0.5 font-medium text-text-muted">
                        <MessageCircle size={12} />
                        {plugin.commentCount}
                      </span>
                    )}
                    <span className="text-text-muted">
                      v{plugin.latestVersion || "1.0.0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

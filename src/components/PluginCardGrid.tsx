"use client";

import Link from "next/link";
import { BadgeCheck, Download, MessageCircle, Flame } from "lucide-react";
import PluginImage from "@/components/PluginImage";
import { VERIFIED_ORGS } from "@/lib/constants";

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
  return (
    <div className="grid grid-cols-1 gap-4 align-content-start lg:grid-cols-2 xl:grid-cols-3">
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
            className="card flex flex-col overflow-hidden bg-surface-card p-0 no-underline transition-colors"
            style={{
              animation: `fadeSlideUp 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${Math.min(i * 0.04, 0.3)}s both`,
            }}
          >
            <div className="plugin-card-inner flex items-center gap-4 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-secondary">
                <PluginImage
                  iconUrl={plugin.iconUrl}
                  repoUrl={plugin.repoUrl}
                  alt={`${plugin.displayName} icon`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold text-text-primary">
                  {plugin.displayName}
                </h3>
                <div className="flex items-center gap-2 min-w-0 flex-wrap mt-1">
                  {plugin.isPreRelease && (
                    <span
                      title="This is a pre-release"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-error bg-error/10 border border-error/20 rounded-xs px-1.5 py-0.5 shrink-0"
                    >
                      Pre-release
                    </span>
                  )}
                  {isVerified && (
                    <span
                      title="Officially supported by EndstoneMC/EndGit"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand bg-brand/10 border border-brand/20 rounded-xs px-1.5 py-0.5 shrink-0"
                    >
                      <BadgeCheck size={11} />
                      Verified
                    </span>
                  )}
                  {isFeatured && (
                    <span
                      title="Featured plugin"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 border border-success/20 rounded-xs px-1.5 py-0.5 shrink-0"
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
                      <span className="flex items-center gap-0.5 font-medium text-warning">
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

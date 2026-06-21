"use client";

import { useMemo, useState } from "react";
import {
  GitBranch,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Package,
  Search,
} from "lucide-react";
import Link from "next/link";

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "SUCCESS":
      return <CheckCircle size={16} className="text-success" />;

    case "FAILED":
      return <XCircle size={16} className="text-error" />;

    case "RUNNING":
      return <Loader2 size={16} className="animate-spin text-[#7c3aed]" />;

    default:
      return <Clock size={16} className="text-text-muted" />;
  }
}

function statusBgClass(status: string) {
  switch (status) {
    case "SUCCESS":
      return "bg-success";
    case "FAILED":
      return "bg-error";
    case "RUNNING":
      return "bg-[#7c3aed]";
    default:
      return "bg-text-muted";
  }
}

function statusTextClass(status: string) {
  switch (status) {
    case "SUCCESS":
      return "text-success";
    case "FAILED":
      return "text-error";
    case "RUNNING":
      return "text-[#7c3aed] dark:text-[#c4b5fd]";
    default:
      return "text-text-muted";
  }
}

function statusBorderClass(status: string) {
  switch (status) {
    case "SUCCESS":
      return "border-l-success";
    case "FAILED":
      return "border-l-error";
    case "RUNNING":
      return "border-l-[#7c3aed]";
    default:
      return "border-l-text-muted";
  }
}

export default function BuildsList({
  builds,
  today,
  filterByToday = true,
  hideHeader = false,
  showPluginName = true,
  scrollableWrapper = false,
  hideWarning = false,
  linkToBuildDetail = false,
}: {
  builds: any[];
  today: string;
  filterByToday?: boolean;
  hideHeader?: boolean;
  showPluginName?: boolean;
  scrollableWrapper?: boolean;
  hideWarning?: boolean;
  linkToBuildDetail?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filteredBuilds = useMemo(() => {
    const q = query.toLowerCase();

    return builds.filter((build) => {
      const plugin = build.plugin?.displayName || build.plugin?.name || "";
      const author = build.plugin?.author?.username || "";
      const commitMsg = build.commitMessage || "";

      const matchesSearch =
        plugin.toLowerCase().includes(q) ||
        author.toLowerCase().includes(q) ||
        commitMsg.toLowerCase().includes(q) ||
        build.branch?.toLowerCase().includes(q) ||
        build.status?.toLowerCase().includes(q) ||
        String(build.buildNumber).includes(q);

      if (!q && filterByToday) {
        // If no search query and filtering by today, only show today's builds
        const isToday =
          new Date(build.createdAt).toISOString().slice(0, 10) === today;
        return isToday && matchesSearch;
      }

      // If there is a search query or filterByToday is false, show matching builds
      return matchesSearch;
    });
  }, [builds, query, today]);

  return (
    <>
      {/* Header */}
      {!hideHeader && (
        <div className="mb-5">
          <div className="mb-2 grid grid-flow-col auto-cols-max items-center gap-3">
            <h1 className="heading-2">Dev Builds</h1>

            <span className="rounded-sm border border-[#7c3aed]/25 bg-[#7c3aed]/10 px-2.5 py-0.5 text-xs font-semibold text-[#7c3aed] dark:text-[#c4b5fd]">
              Today ({today})
            </span>
          </div>

          <p className="text-text-muted max-w-[600px]">
            CI builds from developer pushes today (UTC).
          </p>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <div className="card grid grid-flow-col auto-cols-max items-center gap-3 rounded-sm px-3 py-0 transition-colors focus-within:border-[#7c3aed]/45 lg:px-4">
          <Search size={18} className="text-text-muted shrink-0" />

          <input
            type="text"
            placeholder="Search builds..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 border-none outline-none bg-transparent text-text-primary text-[0.95rem]"
          />
        </div>
      </div>

      {/* Warning */}
      {!hideWarning && (
        <div className="card mb-5 grid grid-flow-col auto-cols-max items-center gap-3 rounded-sm border-l-4 border-warning bg-warning/8 p-3 lg:px-5 lg:py-4">
          <AlertTriangle size={20} className="text-warning shrink-0" />

          <div>
            <span className="font-semibold">Caution:</span> Development builds
            may be unstable.
          </div>
        </div>
      )}

      {/* Builds */}
      {filteredBuilds.length === 0 ? (
        <div className="card rounded-sm p-12 text-center">
          <Package size={48} className="text-text-muted mx-auto mb-4" />

          <p>No matching builds</p>
        </div>
      ) : (
        <div
          className={
            scrollableWrapper
              ? "max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
              : ""
          }
        >
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredBuilds.map((build: any, i: number) => (
              <Link
                key={build.id}
                href={
                  linkToBuildDetail
                    ? `/builds/${build.id}`
                    : `/plugins/${build.plugin?.slug}/builds`
                }
                className={`card flex flex-col overflow-hidden border-l-4 bg-surface-card p-0 no-underline transition-all hover:border-[#7c3aed]/45 hover:bg-surface-secondary hover:shadow-[0_0_24px_rgba(124,58,237,0.14)] ${statusBorderClass(build.status)}`}
                style={{
                  animation: `fadeSlideUp 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${Math.min(i * 0.04, 0.3)}s both`,
                }}
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-text-primary">
                      {showPluginName
                        ? build.plugin?.displayName || build.plugin?.name
                        : build.commitMessage || "Manual/Webhook Build"}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {build.plugin?.author?.username || "unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch size={11} />
                        {build.branch}
                      </span>
                      <span>#{build.buildNumber}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 text-xs">
                    <StatusIcon status={build.status} />
                    <span
                      className={`font-medium ${statusTextClass(build.status)}`}
                    >
                      {build.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

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
  User,
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
      return <Loader2 size={16} className="text-accent animate-spin" />;

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
      return "bg-accent";
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
      return "text-accent";
    default:
      return "text-text-muted";
  }
}

export default function BuildsList({
  builds,
  today,
}: {
  builds: any[];
  today: string;
}) {
  const [query, setQuery] = useState("");

  const filteredBuilds = useMemo(() => {
    const q = query.toLowerCase();

    return builds.filter((build) => {
      const plugin = build.plugin?.displayName || build.plugin?.name || "";
      const author = build.plugin?.author?.username || "";

      const matchesSearch =
        plugin.toLowerCase().includes(q) ||
        author.toLowerCase().includes(q) ||
        build.branch?.toLowerCase().includes(q) ||
        build.status?.toLowerCase().includes(q);

      if (!q) {
        // If no search query, only show today's builds
        const isToday =
          new Date(build.createdAt).toISOString().slice(0, 10) === today;
        return isToday && matchesSearch;
      }

      // If there is a search query, show any matching build regardless of date
      return matchesSearch;
    });
  }, [builds, query, today]);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="grid grid-flow-col auto-cols-max items-center gap-3 mb-2">
          <h1 className="heading-2">Dev Builds</h1>

          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
            Today ({today})
          </span>
        </div>

        <p className="text-text-muted max-w-[600px]">
          CI builds from developer pushes today (UTC).
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="card grid grid-flow-col auto-cols-max items-center gap-3 px-3 lg:px-4 py-0">
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
      <div className="card p-3 lg:p-4 lg:px-5 mb-8 grid grid-flow-col auto-cols-max items-center gap-3 border-l-4 border-warning bg-warning/5">
        <AlertTriangle size={20} className="text-warning shrink-0" />

        <div>
          <span className="font-semibold">Caution:</span> Development builds may
          be unstable.
        </div>
      </div>

      {/* Builds */}
      {filteredBuilds.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={48} className="text-text-muted mx-auto mb-4" />

          <p>No matching builds</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4">
          {filteredBuilds.map((build: any) => (
            <Link
              key={build.id}
              href={`/plugins/${build.plugin?.slug}/builds`}
              className="card p-3 lg:p-4 lg:px-5 grid grid-flow-col auto-cols-max items-center gap-3 lg:gap-4 no-underline hover:border-border-highlight transition-colors duration-200"
            >
              <div
                className={`w-1 h-10 rounded-xs shrink-0 ${statusBgClass(build.status)}`}
              />

              <div className="min-w-0">
                <div className="font-semibold text-text-primary truncate">
                  {build.plugin?.displayName || build.plugin?.name}
                </div>

                <div className="grid grid-flow-col auto-cols-max gap-3 text-[0.8125rem] text-text-muted">
                  <span className="grid grid-flow-col auto-cols-max items-center gap-[3px]">
                    <User size={12} />
                    {build.plugin?.author?.username || "unknown"}
                  </span>

                  <span className="grid grid-flow-col auto-cols-max items-center gap-[3px]">
                    <GitBranch size={12} />
                    {build.branch}
                  </span>

                  <span>#{build.buildNumber}</span>
                </div>
              </div>

              <div className="grid gap-0.5 justify-items-end shrink-0">
                <div className="grid grid-flow-col auto-cols-max items-center gap-2">
                  <StatusIcon status={build.status} />

                  <span
                    className={`text-[0.8125rem] font-medium ${statusTextClass(build.status)}`}
                  >
                    {build.status}
                  </span>
                </div>

                <span className="text-xs text-text-muted">
                  {timeAgo(build.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

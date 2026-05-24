"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { GitBranch, Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface BuildsTableClientProps {
  slug: string;
  plugin: any;
  initialBuilds: any[];
  initialPagination: {
    page: number;
    totalPages: number;
    total: number;
    pageSize: number;
  };
  isOwner: boolean;
}

export function BuildsTableClient({
  slug,
  plugin,
  initialBuilds,
  initialPagination,
  isOwner,
}: BuildsTableClientProps) {
  const [builds, setBuilds] = useState<any[]>(initialBuilds);
  const [page, setPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasMore = page < totalPages;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(
        `${baseUrl}/api/v1/builds/plugin/${slug}?page=${nextPage}&pageSize=10`,
      );
      const json = await res.json();
      if (json.success) {
        const newBuilds = json.data?.builds || [];
        setBuilds((prev) => [...prev, ...newBuilds]);
        setPage(nextPage);
        setTotalPages(json.pagination?.totalPages || totalPages);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, slug, totalPages]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function handleScroll() {
      if (!wrapper) return;
      const { scrollTop, scrollHeight, clientHeight } = wrapper;
      if (
        scrollHeight > clientHeight &&
        scrollHeight - scrollTop - clientHeight < 100
      ) {
        loadMore();
      }
    }

    wrapper.addEventListener("scroll", handleScroll);
    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  const versionedBuilds = builds.filter((b: any) => b.versionStatus !== null);
  const reviewedBuildNumber =
    versionedBuilds.length > 0
      ? Math.max(...versionedBuilds.map((b: any) => Number(b.buildNumber)))
      : -1;
  const hasPendingVersion =
    builds.some((b: any) => b.versionStatus === "PENDING") ||
    plugin.status === "PENDING_REVIEW";

  return (
    <div className="container py-6 lg:py-8">
      <Link
        href="/dashboard/dev"
        className="inline-grid grid-cols-[auto_1fr] items-center gap-1.5 text-text-muted no-underline text-sm font-medium mb-6 hover:text-brand transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dev Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="heading-2 m-0 break-words">
          {plugin.displayName} CI Builds
        </h1>
        <p className="text-text-muted mt-1">
          View build history and logs for this plugin.
        </p>
      </div>

      <div className="card p-4 lg:p-6">
        {builds.length === 0 ? (
          <div className="text-center p-8 text-text-muted">
            <GitBranch size={32} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium text-text-primary">No builds found.</p>
            <p className="text-sm mt-1 text-text-muted">
              Push to your repository to trigger the first build.
            </p>
          </div>
        ) : (
          <div ref={wrapperRef} className="max-h-[600px] overflow-y-auto">
            <table className="w-full border-collapse text-sm table-fixed">
              <colgroup>
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[7%]" />
                <col className="w-[43%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead className="bg-surface-secondary sticky top-0 z-10">
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-3 text-text-primary font-semibold">
                    Build #
                  </th>
                  <th className="px-3 py-3 text-text-primary font-semibold">
                    Date
                  </th>
                  <th className="px-3 py-3 text-text-primary font-semibold">
                    Lint
                  </th>
                  <th className="px-3 py-3 text-text-primary font-semibold">
                    Commit
                  </th>
                  <th className="px-3 py-3 text-text-primary font-semibold">
                    Branch / PR
                  </th>
                  <th className="px-3 py-3 text-text-primary font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {builds.map((build: any) => (
                  <tr
                    key={build.id}
                    className="border-b border-border bg-surface-card hover:bg-surface-secondary/30 transition-colors"
                  >
                    <td className="p-3 align-top">
                      <div className="grid gap-[2px]">
                        <Link
                          href={`/builds/${build.id}`}
                          className="text-accent no-underline font-medium hover:underline"
                        >
                          Dev #{build.buildNumber}
                        </Link>
                        {build.commitHash && (
                          <span className="text-accent text-[13px]">
                            (&amp;{build.commitHash.slice(0, 5)})
                          </span>
                        )}
                        {build.triggerType === "WEBHOOK" && (
                          <span className="badge text-xs w-fit mt-1">AUTO</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 align-top text-text-secondary whitespace-nowrap">
                      {timeAgo(build.createdAt)}
                      {build.duration ? (
                        <span className="text-[13px] text-text-muted">
                          {" "}
                          (in {build.duration}s)
                        </span>
                      ) : null}
                    </td>
                    <td className="p-3 align-top">
                      {build.status === "SUCCESS" ? (
                        <span className="text-success font-medium">OK</span>
                      ) : build.status === "FAILED" ? (
                        <span className="text-error font-medium">Failed</span>
                      ) : build.status === "RUNNING" ? (
                        <span className="text-brand font-medium">Running</span>
                      ) : (
                        <span className="text-text-muted">Queued</span>
                      )}
                    </td>
                    <td className="p-3 align-top">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {build.commitHash && (
                            <a
                              href={`${plugin.repoUrl}/commit/${build.commitHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent font-mono no-underline hover:underline shrink-0"
                            >
                              {build.commitHash.slice(0, 7)}
                            </a>
                          )}
                          <span className="text-text-primary break-words">
                            {build.commitMessage || "No commit message"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {isOwner && build.versionStatus === "PENDING" && (
                            <span className="badge bg-warning/10 text-warning border border-warning/20 text-xs font-semibold">
                              PENDING REVIEW
                            </span>
                          )}
                          {isOwner && build.versionStatus === "APPROVED" && (
                            <span className="badge bg-success/10 text-success border border-success/20 text-xs font-semibold">
                              APPROVED
                            </span>
                          )}
                          {isOwner && build.versionStatus === "REJECTED" && (
                            <span className="badge bg-error/10 text-error border border-error/20 text-xs font-semibold">
                              REJECTED
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 align-top">
                      <a
                        href={`${plugin.repoUrl}/tree/${build.branch || "master"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent inline-flex items-center gap-1 no-underline hover:underline font-mono break-all"
                      >
                        {build.branch || "master"}
                      </a>
                    </td>
                    <td className="p-3 text-right align-top">
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Link
                          href={`/builds/${build.id}`}
                          className="btn btn-secondary py-1.5 px-3 text-[13px] whitespace-nowrap"
                        >
                          Logs
                        </Link>
                        {isOwner &&
                          build.canSubmit &&
                          Number(build.buildNumber) >
                            Number(reviewedBuildNumber) &&
                          !hasPendingVersion && (
                            <Link
                              href={`/builds/${build.id}/submit`}
                              className="btn btn-primary py-1.5 px-3 text-[13px] inline-flex items-center gap-1 whitespace-nowrap"
                            >
                              <Send size={14} /> Submit
                            </Link>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isLoading && (
              <div className="grid justify-items-center p-4">
                <Loader2 size={20} className="animate-spin text-brand" />
              </div>
            )}

            {!hasMore && builds.length > 0 && (
              <div className="text-center p-4 text-text-muted text-[13px]">
                All builds loaded
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

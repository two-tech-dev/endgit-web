import {
  ArrowLeft,
  GitBranch,
  Clock,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import LiveBuildLog from "@/components/LiveBuildLog";
import SubmitForReview from "@/components/SubmitForReview";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `Build ${params.id} - EndGit`,
    description: `View build details and logs for build ${params.id}.`,
  };
}

async function getBuild(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/builds/${id}`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { badgeClass: string; icon: any }> = {
    SUCCESS: {
      badgeClass: "bg-success/10 text-success border-success/20",
      icon: <CheckCircle size={14} />,
    },
    FAILED: {
      badgeClass: "bg-error/10 text-error border-error/20",
      icon: <XCircle size={14} />,
    },
    RUNNING: {
      badgeClass: "bg-brand/10 text-brand border-brand/20",
      icon: <Loader2 size={14} className="animate-spin" />,
    },
    QUEUED: {
      badgeClass: "bg-surface-secondary text-text-muted border-border",
      icon: <Clock size={14} />,
    },
  };
  const c = config[status] || config.QUEUED;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.8125rem] font-semibold border ${c.badgeClass}`}
    >
      {c.icon} {status}
    </span>
  );
}

export default async function BuildDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const build = await getBuild(params.id);

  if (!build) {
    return (
      <div className="container pt-16 text-center">
        <h1 className="heading-2">Build not found</h1>
        <p className="text-text-muted mt-2">
          This build may have been deleted or doesn't exist.
        </p>
        <Link href="/builds" className="btn btn-secondary mt-6">
          <ArrowLeft size={16} /> Back to Live Builds
        </Link>
      </div>
    );
  }

  let canSubmit = build.plugin?.status !== "PENDING_REVIEW";
  if (canSubmit && build.plugin?.reviewBuildId) {
    const reviewBuild = await getBuild(build.plugin.reviewBuildId);
    if (reviewBuild && build.buildNumber <= reviewBuild.buildNumber) {
      canSubmit = false;
    }
  }

  return (
    <div className="container pt-6 md:pt-8 pb-16 max-w-[960px]">
      {/* Breadcrumb */}
      <Link
        href="/builds"
        className="inline-flex items-center gap-2 text-text-muted text-sm mb-6 hover:text-text-primary transition-colors no-underline"
      >
        <ArrowLeft size={14} /> Back to Live Builds
      </Link>

      {/* Header Card */}
      <div className="card p-4 md:p-6 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="build-title-row flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="heading-3 m-0">
                {build.plugin?.displayName} — Build #{build.buildNumber}
              </h1>
              <StatusBadge status={build.status} />
              {!build.isRelease && (
                <span className="text-[0.6875rem] px-2 py-0.5 rounded-sm bg-warning/10 text-warning font-bold uppercase tracking-wider">
                  ⚠️ Unstable
                </span>
              )}
            </div>
            <p className="text-text-muted text-sm">
              by {build.plugin?.author?.username || "unknown"}
            </p>
          </div>

          {build.status === "SUCCESS" && (
            <div className="flex flex-col gap-2 items-end">
              {/* Python or fallback single artifact */}
              {build.artifactUrl &&
                !build.artifactUrlLinux &&
                !build.artifactUrlWin && (
                  <a
                    href={build.artifactUrl}
                    className="btn btn-primary px-5 py-2 text-sm flex items-center gap-2 no-underline"
                  >
                    <Download size={16} /> Download Artifact
                  </a>
                )}
              {/* C++ multi-platform downloads */}
              {build.artifactUrlLinux && (
                <a
                  href={build.artifactUrlLinux}
                  className="btn btn-primary px-5 py-2 text-sm flex items-center gap-2 no-underline"
                >
                  <Download size={16} /> 🐧 Linux (.so)
                </a>
              )}
              {build.artifactUrlWin && (
                <a
                  href={build.artifactUrlWin}
                  className="btn btn-secondary px-5 py-2 text-sm flex items-center gap-2 no-underline"
                >
                  <Download size={16} /> 🪟 Windows (.dll)
                </a>
              )}
            </div>
          )}
          {/* C++ build in progress indicators */}
          {build.status === "RUNNING" &&
            (build.winBuildStatus || build.linuxBuildStatus) && (
              <div className="flex flex-col gap-1 items-end text-xs">
                {build.linuxBuildStatus && (
                  <span
                    className={
                      build.linuxBuildStatus === "SUCCESS"
                        ? "text-success"
                        : build.linuxBuildStatus === "FAILED"
                          ? "text-error"
                          : "text-brand"
                    }
                  >
                    🐧 Linux:{" "}
                    {build.linuxBuildStatus === "PENDING"
                      ? "⏳ Pending"
                      : build.linuxBuildStatus === "RUNNING"
                        ? "🔄 Building..."
                        : build.linuxBuildStatus}
                  </span>
                )}
                {build.winBuildStatus && (
                  <span
                    className={
                      build.winBuildStatus === "SUCCESS"
                        ? "text-success"
                        : build.winBuildStatus === "FAILED"
                          ? "text-error"
                          : "text-brand"
                    }
                  >
                    🪟 Windows:{" "}
                    {build.winBuildStatus === "PENDING"
                      ? "⏳ Pending"
                      : build.winBuildStatus === "RUNNING"
                        ? "🔄 Building..."
                        : build.winBuildStatus}
                  </span>
                )}
              </div>
            )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mt-5 pt-5 border-t border-border">
          <div>
            <div className="text-[0.6875rem] text-text-muted uppercase tracking-wider mb-1">
              Branch
            </div>
            <div className="flex items-center gap-1 font-medium text-text-primary text-sm">
              <GitBranch size={14} className="text-brand" /> {build.branch}
            </div>
          </div>
          <div>
            <div className="text-[0.6875rem] text-text-muted uppercase tracking-wider mb-1">
              Commit
            </div>
            <div className="font-mono text-sm font-medium text-text-primary">
              {build.commitHash ? build.commitHash.slice(0, 7) : "—"}
            </div>
          </div>
          <div>
            <div className="text-[0.6875rem] text-text-muted uppercase tracking-wider mb-1">
              Duration
            </div>
            <div className="flex items-center gap-1 font-medium text-text-primary text-sm">
              <Clock size={14} className="text-brand" />{" "}
              {build.duration ? `${build.duration}s` : "—"}
            </div>
          </div>
          <div>
            <div className="text-[0.6875rem] text-text-muted uppercase tracking-wider mb-1">
              Created
            </div>
            <div className="font-medium text-text-primary text-sm">
              {timeAgo(build.createdAt)}
            </div>
          </div>
          {build.artifactSize && (
            <div>
              <div className="text-[0.6875rem] text-text-muted uppercase tracking-wider mb-1">
                Artifact Size
              </div>
              <div className="font-medium text-text-primary text-sm">
                {(build.artifactSize / 1024).toFixed(1)} KB
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Build Logs — Live SSE Stream (Phase 11) */}
      <LiveBuildLog
        buildId={build.id}
        initialLogs={build.logs || ""}
        initialStatus={build.status}
      />

      {/* Submit for Review (Feature 4) */}
      <SubmitForReview
        buildId={build.id}
        buildNumber={build.buildNumber}
        buildStatus={build.status}
        isSubmitted={build.id === build.plugin?.reviewBuildId}
        canSubmit={canSubmit}
      />

      {/* Not Reviewed Warning */}
      {!build.isRelease ? (
        <div className="card px-4 md:px-5 py-4 mt-6 flex items-center gap-3 border-l-4 border-warning bg-warning/5">
          <AlertTriangle size={18} className="text-warning shrink-0" />
          <span className="text-text-secondary text-sm">
            <strong className="text-text-primary">NOT REVIEWED</strong> — This
            is a development build. It has not been reviewed for safety or
            stability. Use at your own risk.
          </span>
        </div>
      ) : null}
    </div>
  );
}

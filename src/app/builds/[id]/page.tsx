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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const config: Record<
    string,
    { variant: "default" | "destructive" | "secondary"; icon: React.ReactNode }
  > = {
    SUCCESS: {
      variant: "default",
      icon: <CheckCircle />,
    },
    FAILED: {
      variant: "destructive",
      icon: <XCircle />,
    },
    RUNNING: {
      variant: "destructive",
      icon: <Loader2 className="animate-spin" />,
    },
    QUEUED: {
      variant: "secondary",
      icon: <Clock />,
    },
  };
  const c = config[status] || config.QUEUED;
  return (
    <Badge variant={c.variant}>
      {c.icon} {status}
    </Badge>
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
      <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Build not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          This build may have been deleted or doesn&apos;t exist.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-6">
          <Link href="/builds">
            <ArrowLeft /> Back to Live Builds
          </Link>
        </Button>
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
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/builds"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6"
      >
        <ArrowLeft size={14} /> Back to Live Builds
      </Link>

      {/* Header Card */}
      <div className="rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-sm sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-lg font-semibold m-0">
                {build.plugin?.displayName} — Build #{build.buildNumber}
              </h1>
              <StatusBadge status={build.status} />
              {!build.isRelease && (
                <span className="rounded-sm bg-yellow-500/10 px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider text-yellow-500">
                  Unstable
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              by {build.plugin?.author?.username || "unknown"}
            </p>
          </div>

          {build.status === "SUCCESS" && (
            <div className="flex flex-col items-end gap-2">
              {build.artifactUrl &&
                !build.artifactUrlLinux &&
                !build.artifactUrlWin && (
                  <Button asChild size="sm">
                    <a href={build.artifactUrl}>
                      <Download /> Download Artifact
                    </a>
                  </Button>
                )}
              {build.artifactUrlLinux && (
                <Button asChild size="sm">
                  <a href={build.artifactUrlLinux}>
                    <Download /> Linux (.so)
                  </a>
                </Button>
              )}
              {build.artifactUrlWin && (
                <Button asChild variant="outline" size="sm">
                  <a href={build.artifactUrlWin}>
                    <Download /> Windows (.dll)
                  </a>
                </Button>
              )}
            </div>
          )}
          {build.status === "RUNNING" &&
            (build.winBuildStatus || build.linuxBuildStatus) && (
              <div className="flex flex-col items-end gap-1 text-xs">
                {build.linuxBuildStatus && (
                  <span
                    className={
                      build.linuxBuildStatus === "SUCCESS"
                        ? "text-green-500"
                        : build.linuxBuildStatus === "FAILED"
                          ? "text-red-500"
                          : "text-primary"
                    }
                  >
                    Linux:{" "}
                    {build.linuxBuildStatus === "PENDING"
                      ? "Pending"
                      : build.linuxBuildStatus === "RUNNING"
                        ? "Building..."
                        : build.linuxBuildStatus}
                  </span>
                )}
                {build.winBuildStatus && (
                  <span
                    className={
                      build.winBuildStatus === "SUCCESS"
                        ? "text-green-500"
                        : build.winBuildStatus === "FAILED"
                          ? "text-red-500"
                          : "text-primary"
                    }
                  >
                    Windows:{" "}
                    {build.winBuildStatus === "PENDING"
                      ? "Pending"
                      : build.winBuildStatus === "RUNNING"
                        ? "Building..."
                        : build.winBuildStatus}
                  </span>
                )}
              </div>
            )}
        </div>

        {/* Metadata Grid */}
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 border-t border-border pt-5">
          <div>
            <div className="mb-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
              Branch
            </div>
            <div className="flex items-center gap-1 font-medium text-foreground">
              <GitBranch size={14} className="text-primary" /> {build.branch}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
              Commit
            </div>
            <div className="font-mono text-sm font-medium text-foreground">
              {build.commitHash ? build.commitHash.slice(0, 7) : "—"}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
              Duration
            </div>
            <div className="flex items-center gap-1 font-medium text-foreground">
              <Clock size={14} className="text-primary" />{" "}
              {build.duration ? `${build.duration}s` : "—"}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
              Created
            </div>
            <div className="text-sm font-medium text-foreground">
              {timeAgo(build.createdAt)}
            </div>
          </div>
          {build.artifactSize && (
            <div>
              <div className="mb-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
                Artifact Size
              </div>
              <div className="text-sm font-medium text-foreground">
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
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border/70 bg-card/80 border-l-4 border-l-yellow-500 bg-yellow-500/[0.04] px-5 py-4">
          <AlertTriangle size={18} className="shrink-0 text-yellow-500" />
          <span className="text-sm text-foreground">
            <strong>NOT REVIEWED</strong> — This is a development build. It has
            not been reviewed for safety or stability. Use at your own risk.
          </span>
        </div>
      ) : null}
    </div>
  );
}

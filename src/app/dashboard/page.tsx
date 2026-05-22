import {
  PackagePlus,
  Settings,
  Activity,
  AlertCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import PluginImage from "@/components/PluginImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { fetchApi } from "@/lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const [pluginsRes, statsRes, statusRes] = await Promise.all([
    fetchApi("/api/v1/dashboard/plugins"),
    fetchApi("/api/v1/dashboard/stats"),
    fetchApi("/api/v1/dashboard/status"),
  ]);

  const hasAppInstalled = statusRes.data?.data?.hasAppInstalled || false;
  const githubTokenExpired = statusRes.data?.data?.githubTokenExpired || false;
  const installUrl =
    process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ||
    "https://github.com/apps/endgit-app/installations/new";

  if (githubTokenExpired) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[600px] rounded-2xl border border-border/70 bg-card/70 p-10 text-center shadow-lg backdrop-blur-sm">
           <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            GitHub Session Expired
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            For security reasons, your connection to GitHub has expired. Please
            re-authenticate to sync your App installation status and continue
            using the Developer Dashboard.
          </p>
          <Button asChild size="sm" className="mt-8 text-lg">
            <a href="/api/auth/signin?callbackUrl=/dashboard">
              Re-authenticate with GitHub
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (!hasAppInstalled) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[600px] rounded-2xl border border-border/70 bg-card/70 p-10 text-center shadow-lg backdrop-blur-sm">
           <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to EndGit!
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            To get started with the Developer Dashboard, you need to install the
            EndGit GitHub App on your repositories. The app will automatically
            detect your Bedrock plugins, build them using our CI/CD pipeline,
            and publish them to the marketplace.
          </p>
          <Button asChild size="sm" className="mt-8 text-lg">
            <a href={installUrl}>
              <ExternalLink size={20} /> Install GitHub App{" "}
              <ArrowRight size={20} />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const stats = statsRes.data?.data || {
    totalPlugins: 0,
    totalDownloads: 0,
    totalVersions: 0,
    pendingReviews: 0,
  };

  const myPlugins: any[] = pluginsRes.data?.data || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Developer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your plugins and track performance.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="outline" size="sm">
            <a href={installUrl} target="_blank" rel="noopener noreferrer">
              <Settings size={18} /> Manage App Installation
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-6">
        <Card className="flex-row items-center gap-4 rounded-2xl border border-border/70 bg-card/80 p-6">
          <div className="rounded-md bg-primary/10 p-3 text-primary">
            <PackagePlus size={24} />
          </div>
          <div>
            <div className="mb-0.5 text-sm text-muted-foreground">
              Total Plugins
            </div>
            <div className="text-2xl font-bold tracking-tight sm:text-3xl">
              {stats.totalPlugins?.toLocaleString() ?? 0}
            </div>
          </div>
        </Card>

        <Card className="flex-row items-center gap-4 rounded-2xl border border-border/70 bg-card/80 p-6">
          <div className="rounded-md bg-cyan-500/10 p-3 text-primary">
            <Activity size={24} />
          </div>
          <div>
            <div className="mb-0.5 text-sm text-muted-foreground">
              Total Downloads
            </div>
            <div className="text-2xl font-bold tracking-tight sm:text-3xl">
              {stats.totalDownloads?.toLocaleString() ?? 0}
            </div>
          </div>
        </Card>

        <Card className="flex-row items-center gap-4 rounded-2xl border border-border/70 bg-card/80 p-6">
          <div className="rounded-md bg-yellow-500/10 p-3 text-yellow-500">
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="mb-0.5 text-sm text-muted-foreground">
              Pending Review
            </div>
            <div className="text-2xl font-bold tracking-tight sm:text-3xl">
              {stats.pendingReviews?.toLocaleString() ?? 0}
            </div>
          </div>
        </Card>
      </div>

      <h2 className="mt-10 text-lg font-semibold">My Plugins</h2>
      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6">
        {myPlugins.map((plugin) => (
          <Card
            key={plugin.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80"
          >
            <div
              className={`h-1 w-full ${
                plugin.status === "APPROVED" ? "bg-green-500" : "bg-yellow-500"
              }`}
            />

            <div className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-muted">
                    <PluginImage
                      iconUrl={plugin.iconUrl}
                      repoUrl={plugin.repoUrl}
                      alt={`${plugin.displayName} icon`}
                    />
                  </div>
                  <div>
                    <Link
                      href={`/plugins/${plugin.slug}`}
                      className="block text-lg font-semibold text-foreground"
                    >
                      {plugin.displayName}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      v{plugin.latestVersion || "0.0.0"}
                    </span>
                  </div>
                </div>
                <Badge
                  className={
                    plugin.pluginType === "PYTHON"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-purple-500/10 text-purple-500"
                  }
                >
                  {plugin.pluginType}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 border-y border-border py-4 text-sm text-foreground">
                <div className="flex-1">
                  <div className="mb-0.5 text-[0.75rem] uppercase tracking-wider text-muted-foreground">
                    Downloads
                  </div>
                  <div className="flex items-center gap-0.5 font-medium text-foreground">
                    <Activity size={14} className="text-primary" />{" "}
                    {plugin.downloads?.toLocaleString() ?? 0}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 text-[0.75rem] uppercase tracking-wider text-muted-foreground">
                    Latest Version
                  </div>
                  <div className="font-medium text-foreground">
                    {plugin.latestVersion
                      ? `v${plugin.latestVersion}`
                      : "No versions"}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 text-[0.75rem] uppercase tracking-wider text-muted-foreground">
                    Status
                  </div>
                  <div
                    className={`font-medium ${
                      plugin.status === "APPROVED"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {plugin.status}
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {plugin.status === "PENDING_REVIEW" ? (
                  <div className="w-full rounded-sm bg-yellow-500 py-2 text-center font-semibold text-black">
                    Submitted
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                  >
                    <Settings size={16} /> Manage Plugin
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

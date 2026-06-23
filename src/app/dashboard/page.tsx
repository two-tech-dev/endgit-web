import {
  PackagePlus,
  Settings,
  Activity,
  Upload,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Lock,
} from "lucide-react";
import Link from "next/link";
import PluginImage from "@/components/PluginImage";

import { fetchGraphQL } from "@/lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const GET_DASHBOARD_DATA = `
 query GetDashboardData {
 dashboardStatus {
 hasAppInstalled
 githubTokenExpired
 }
 myStats {
 totalPlugins
 totalDownloads
 totalVersions
 pendingReviews
 }
 myPlugins {
 id
 slug
 displayName
 iconUrl
 repoUrl
 pluginType
 downloads
 status
 latestVersion
 }
 }
 `;

  let hasAppInstalled = false;
  let githubTokenExpired = false;
  let stats = {
    totalPlugins: 0,
    totalDownloads: 0,
    totalVersions: 0,
    pendingReviews: 0,
  };
  let myPlugins: any[] = [];

  try {
    const { data } = await fetchGraphQL(
      GET_DASHBOARD_DATA,
      {},
      { cache: "no-store" },
    );
    if (data) {
      hasAppInstalled = data.dashboardStatus?.hasAppInstalled || false;
      githubTokenExpired = data.dashboardStatus?.githubTokenExpired || false;
      stats = data.myStats || stats;
      myPlugins = data.myPlugins || [];
    }
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
  }
  const installUrl =
    process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ||
    "https://github.com/apps/endgit-app/installations/new";

  if (githubTokenExpired) {
    return (
      <div className="container py-12 min-h-[60vh] grid place-items-center">
        <div className="card max-w-[600px] p-6 lg:p-10 text-center border border-border-highlight ">
          <div className="w-20 h-20 bg-warning/10 rounded-sm grid place-items-center mx-auto mb-6">
            <AlertCircle size={40} className="text-warning" />
          </div>
          <h1 className="heading-2 mb-4">GitHub Session Expired</h1>
          <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8">
            For security reasons, your connection to GitHub has expired. Please
            re-authenticate to sync your App installation status and continue
            using the Developer Dashboard.
          </p>
          <a
            href="/api/auth/signin?callbackUrl=/dashboard"
            className="btn btn-primary inline-grid grid-cols-[auto_1fr] items-center gap-2 text-lg py-3 px-8"
          >
            Re-authenticate with GitHub
          </a>
        </div>
      </div>
    );
  }

  if (!hasAppInstalled) {
    return (
      <div className="container py-12 min-h-[60vh] grid place-items-center">
        <div className="card max-w-[600px] p-6 lg:p-10 text-center border border-border-highlight ">
          <div className="w-20 h-20 bg-[#1890ff]/10 rounded-sm grid place-items-center mx-auto mb-6">
            <PackagePlus size={40} className="text-[#1890ff]" />
          </div>
          <h1 className="heading-2 mb-4">Welcome to EndGit!</h1>
          <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8">
            To get started with the Developer Dashboard, you need to install the
            EndGit GitHub App on your repositories. The app will automatically
            detect your Bedrock plugins, build them using our CI/CD pipeline,
            and publish them to the marketplace.
          </p>
          <div className="grid gap-3">
            <a
              href={installUrl}
              className="btn btn-primary inline-grid grid-cols-[auto_1fr] items-center gap-2 text-lg py-3 px-8"
            >
              <ExternalLink size={20} /> Install GitHub App{" "}
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 lg:py-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="heading-2">Developer Dashboard</h1>
          <p className="text-text-muted">
            Manage your plugins and track performance.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 sm:ml-auto">
          <a
            href={installUrl}
            target="_blank"
            className="btn btn-secondary flex items-center gap-2"
          >
            <Settings size={18} /> Manage App Installation
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4">
        <div className="card flex items-center gap-4 p-4 transition-colors hover:border-[#1890ff]/35 hover:bg-surface-secondary">
          <div className="bg-[#1890ff]/10 p-3 rounded-sm text-[#1890ff] shrink-0">
            <PackagePlus size={24} />
          </div>
          <div className="min-w-0">
            <div className="text-text-muted text-sm mb-1">Total Plugins</div>
            <div className="heading-2">
              {stats.totalPlugins?.toLocaleString() ?? 0}
            </div>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-4 transition-colors hover:border-[#1890ff]/35 hover:bg-surface-secondary">
          <div className="shrink-0 rounded-sm bg-[#1890ff]/10 p-3 text-[#1890ff] ">
            <Activity size={24} />
          </div>
          <div className="min-w-0">
            <div className="text-text-muted text-sm mb-1">Total Downloads</div>
            <div className="heading-2">
              {stats.totalDownloads?.toLocaleString() ?? 0}
            </div>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-4 transition-colors hover:border-[#1890ff]/35 hover:bg-surface-secondary">
          <div className="bg-warning/10 p-3 rounded-sm text-warning shrink-0">
            <AlertCircle size={24} />
          </div>
          <div className="min-w-0">
            <div className="text-text-muted text-sm mb-1">Pending Review</div>
            <div className="heading-2">
              {stats.pendingReviews?.toLocaleString() ?? 0}
            </div>
          </div>
        </div>
      </div>

      {/* Plugins List */}
      <h2 className="mb-4 text-base font-bold text-text-primary">My Plugins</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-4">
        {myPlugins.map((plugin) => (
          <div
            key={plugin.id}
            className="card grid overflow-hidden transition-all hover:border-[#1890ff]/40 hover:bg-surface-secondary hover:shadow-[0_0_24px_rgba(24,144,255,0.12)]"
          >
            {/* Status Bar */}
            <div
              className={`h-1 w-full ${
                plugin.status === "APPROVED" ? "bg-success" : "bg-warning"
              }`}
            />

            <div className="flex flex-col gap-4 p-4">
              <div className="grid grid-cols-[1fr_auto] items-start">
                <div className="flex gap-3 items-center min-w-0">
                  <div className="w-12 h-12 rounded-sm bg-surface-secondary grid place-items-center border border-border shrink-0 overflow-hidden">
                    <PluginImage
                      iconUrl={plugin.iconUrl}
                      repoUrl={plugin.repoUrl}
                      alt={`${plugin.displayName} icon`}
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/plugins/${plugin.slug}`}
                      className="mb-1 block truncate text-lg font-bold text-text-primary"
                    >
                      {plugin.displayName}
                    </Link>
                    <span className="text-sm text-text-muted">
                      v{plugin.latestVersion || "0.0.0"}
                    </span>
                  </div>
                </div>
                <span
                  className={`badge ${plugin.pluginType === "PYTHON" ? "badge-green" : "badge-purple"}`}
                >
                  {plugin.pluginType}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 border-y border-border text-text-secondary text-sm">
                <div className="min-w-0">
                  <div className="text-text-muted text-[0.625rem] sm:text-[0.75rem] mb-1 uppercase tracking-wider">
                    Downloads
                  </div>
                  <div className="flex items-center gap-1 font-medium text-text-primary">
                    <Activity size={14} className="shrink-0 text-[#1890ff]" />{" "}
                    <span className="truncate">
                      {plugin.downloads?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-text-muted text-[0.625rem] sm:text-[0.75rem] mb-1 uppercase tracking-wider">
                    Version
                  </div>
                  <div className="font-medium text-text-primary truncate">
                    {plugin.latestVersion ? `v${plugin.latestVersion}` : "None"}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-text-muted text-[0.625rem] sm:text-[0.75rem] mb-1 uppercase tracking-wider">
                    Status
                  </div>
                  <div
                    className={`font-medium break-words ${
                      plugin.status === "APPROVED"
                        ? "text-success"
                        : "text-warning"
                    }`}
                  >
                    {plugin.status.replace(/_/g, " ")}
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {plugin.status === "PENDING_REVIEW" ? (
                  <div className="w-full rounded-sm border border-warning/25 bg-warning/15 p-2 text-center font-semibold text-warning">
                    Submitted
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/plugins/${plugin.slug}`}
                    className="btn btn-secondary w-full flex items-center justify-center gap-2 p-2"
                  >
                    <Settings size={16} /> Manage Plugin
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

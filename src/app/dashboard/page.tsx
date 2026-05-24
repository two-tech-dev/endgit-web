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

import { fetchApi } from "@/lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Fetch real data from backend
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
      <div className="container py-12 min-h-[60vh] grid place-items-center">
        <div className="card max-w-[600px] p-6 lg:p-10 text-center border border-border-highlight shadow-lg">
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
        <div className="card max-w-[600px] p-6 lg:p-10 text-center border border-border-highlight shadow-lg">
          <div className="w-20 h-20 bg-[#7c3aed]/10 rounded-sm grid place-items-center mx-auto mb-6">
            <PackagePlus size={40} className="text-[#7c3aed]" />
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

  const stats = statsRes.data?.data || {
    totalPlugins: 0,
    totalDownloads: 0,
    totalVersions: 0,
    pendingReviews: 0,
  };

  const myPlugins: any[] = pluginsRes.data?.data || [];

  return (
    <div className="container py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-end mb-6 lg:mb-8 gap-4">
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-5 lg:gap-6 mb-10 lg:mb-12">
        <div className="card p-4 lg:p-6 flex items-center gap-4">
          <div className="bg-[#7c3aed]/10 p-3 rounded-sm text-[#7c3aed] shrink-0">
            <PackagePlus size={24} />
          </div>
          <div className="min-w-0">
            <div className="text-text-muted text-sm mb-1">Total Plugins</div>
            <div className="heading-2">
              {stats.totalPlugins?.toLocaleString() ?? 0}
            </div>
          </div>
        </div>

        <div className="card p-4 lg:p-6 flex items-center gap-4">
          <div className="bg-cyan-500/10 p-3 rounded-sm text-cyan-500 shrink-0">
            <Activity size={24} />
          </div>
          <div className="min-w-0">
            <div className="text-text-muted text-sm mb-1">Total Downloads</div>
            <div className="heading-2">
              {stats.totalDownloads?.toLocaleString() ?? 0}
            </div>
          </div>
        </div>

        <div className="card p-4 lg:p-6 flex items-center gap-4">
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
      <h2 className="heading-3 mb-5 lg:mb-6">My Plugins</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-5 lg:gap-6">
        {myPlugins.map((plugin) => (
          <div key={plugin.id} className="card grid overflow-hidden">
            {/* Status Bar */}
            <div
              className={`h-1 w-full ${
                plugin.status === "APPROVED" ? "bg-success" : "bg-warning"
              }`}
            />

            <div className="p-4 lg:p-5 flex flex-col gap-4">
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
                      className="heading-3 text-xl text-text-primary block mb-1 truncate"
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
                    <Activity size={14} className="text-accent shrink-0" />{" "}
                    <span className="truncate">{plugin.downloads?.toLocaleString() ?? 0}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-text-muted text-[0.625rem] sm:text-[0.75rem] mb-1 uppercase tracking-wider">
                    Version
                  </div>
                  <div className="font-medium text-text-primary truncate">
                    {plugin.latestVersion
                      ? `v${plugin.latestVersion}`
                      : "None"}
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
                  <div className="w-full bg-warning text-black font-semibold p-2 rounded-sm text-center">
                    Submitted
                  </div>
                ) : (
                  <button className="btn btn-secondary w-full flex items-center justify-center gap-2 p-2">
                    <Settings size={16} /> Manage Plugin
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

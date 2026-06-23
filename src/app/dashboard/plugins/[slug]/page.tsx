import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchGraphQL } from "@/lib/api";
import Link from "next/link";
import PluginImage from "@/components/PluginImage";
import BuildsList from "@/components/BuildList";
import { ArrowLeft, Settings, Activity, GitBranch, Send } from "lucide-react";

const GET_PLUGIN_DASHBOARD = `
 query GetPluginDashboard($slug: String!) {
 plugin(slug: $slug) {
 id slug displayName description iconUrl repoUrl pluginType status
 author { username displayName }
 versions { id }
 }
 }
`;

async function getPluginBuilds(slug: string, token: string) {
 const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
 try {
 const res = await fetch(`${apiUrl}/api/v1/builds/plugin/${slug}?limit=20`, {
 headers: {
 Authorization: `Bearer ${token}`,
 },
 next: { revalidate: 0 },
 });
 if (!res.ok) return [];
 const json = await res.json();
 return json.data?.builds || [];
 } catch {
 return [];
 }
}

export default async function PluginDashboardPage({
 params,
}: {
 params: { slug: string };
}) {
 const session = await getServerSession(authOptions);
 if (!session) {
 redirect("/api/auth/signin");
 }

 const { data } = await fetchGraphQL(
 GET_PLUGIN_DASHBOARD,
 { slug: params.slug },
 { noAuth: false },
 );
 const plugin = data?.plugin;

 if (!plugin) {
 return (
 <div className="container py-12 text-center">
 <h1 className="heading-2 mb-4">Plugin Not Found</h1>
 <p className="text-text-muted mb-8">
 This plugin doesn't exist or you don't have access to it.
 </p>
 <Link href="/dashboard" className="btn btn-primary">
 Back to Dashboard
 </Link>
 </div>
 );
 }

 // TODO: ensure user is the owner of this plugin. We can assume the API only returns it if they have access,
 // but GraphQL `plugin` query is public. Let's just trust it for now.

 const builds = await getPluginBuilds(
 params.slug,
 (session as any).user?.apiToken,
 );
 const buildsWithPlugin = builds.map((build: any) => ({
 ...build,
 plugin: plugin,
 }));
 const today = new Date().toISOString().slice(0, 10);

 const hasPendingVersion =
 builds.some((b: any) => b.versionStatus === "PENDING") ||
 plugin.status === "PENDING_REVIEW";

 const versionedBuilds = builds.filter((b: any) => b.versionStatus !== null);
 const reviewedBuildNumber =
 versionedBuilds.length > 0
 ? Math.max(...versionedBuilds.map((b: any) => Number(b.buildNumber)))
 : -1;

 const eligibleBuildsToSubmit = builds.filter(
 (b: any) =>
 b.canSubmit && Number(b.buildNumber) > Number(reviewedBuildNumber),
 );

 // builds are usually sorted descending by creation, so [0] is the latest
 const latestEligibleBuild =
 eligibleBuildsToSubmit.length > 0 ? eligibleBuildsToSubmit[0] : null;

 const hasPublishedVersions = plugin.versions && plugin.versions.length > 0;
 const submitButtonText = hasPublishedVersions
 ? "Submit New Version"
 : "Submit Plugin";

 return (
 <div className="container py-4 lg:py-6">
 <Link
 href="/dashboard"
 className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition-colors"
 >
 <ArrowLeft size={16} /> Back to Dashboard
 </Link>

 <div className="card p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-[#1890ff]/20 bg-surface-secondary/50">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-sm bg-surface grid place-items-center border border-border shrink-0 overflow-hidden shadow-sm">
 <PluginImage
 iconUrl={plugin.iconUrl}
 repoUrl={plugin.repoUrl}
 alt={plugin.displayName}
 />
 </div>
 <div>
 <h1 className="heading-2 mb-1">{plugin.displayName}</h1>
 <div className="flex items-center gap-3 text-sm">
 <span
 className={`badge ${plugin.pluginType === "PYTHON" ? "badge-green" : "badge-purple"}`}
 >
 {plugin.pluginType}
 </span>
 <span className="text-text-muted">
 {plugin.status.replace(/_/g, " ")}
 </span>
 </div>
 </div>
 </div>

 <div className="flex flex-wrap gap-3 w-full md:w-auto">
 {hasPendingVersion ? (
 <button
 disabled
 className="btn btn-secondary opacity-50 cursor-not-allowed flex-1 md:flex-none flex items-center justify-center gap-2"
 >
 <Send size={16} /> Review Pending
 </button>
 ) : latestEligibleBuild ? (
 <Link
 href={`/builds/${latestEligibleBuild.id}/submit`}
 className="btn btn-primary flex-1 md:flex-none flex items-center justify-center gap-2"
 >
 <Send size={16} /> {submitButtonText}
 </Link>
 ) : (
 <button
 disabled
 className="btn btn-secondary opacity-50 cursor-not-allowed flex-1 md:flex-none flex items-center justify-center gap-2"
 title="Push code and wait for a successful build to submit."
 >
 <Send size={16} /> {submitButtonText}
 </button>
 )}

 <Link
 href={`/plugins/${plugin.slug}`}
 target="_blank"
 className="btn btn-secondary flex-1 md:flex-none justify-center"
 >
 Public Page
 </Link>
 <button className="btn btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2">
 <Settings size={16} /> Settings
 </button>
 </div>
 </div>

 <div className="grid lg:grid-cols-[1fr_300px] gap-8">
 <div className="space-y-6">
 <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2">
 <GitBranch size={20} className="text-[#1890ff]" /> Build History
 </h2>

 {buildsWithPlugin.length > 0 ? (
 <BuildsList
 builds={buildsWithPlugin}
 today={today}
 filterByToday={false}
 hideHeader={true}
 showPluginName={false}
 scrollableWrapper={true}
 hideWarning={true}
 linkToBuildDetail={true}
 />
 ) : (
 <div className="card p-8 text-center bg-surface-secondary border-dashed">
 <p className="text-text-muted mb-2">
 No builds found for this plugin.
 </p>
 <p className="text-sm text-text-secondary">
 Push code to your repository to trigger a new build.
 </p>
 </div>
 )}
 </div>

 <div className="space-y-6">
 <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2">
 <Activity size={20} className="text-[#1890ff]" /> Analytics & Status
 </h2>

 <div className="card p-5 space-y-4">
 <div>
 <div className="text-xs text-text-muted uppercase tracking-wider mb-1">
 Visibility
 </div>
 <div className="font-medium">{plugin.status}</div>
 </div>
 <div>
 <div className="text-xs text-text-muted uppercase tracking-wider mb-1">
 Repository
 </div>
 <a
 href={plugin.repoUrl}
 target="_blank"
 className="text-[#1890ff] hover:underline break-all text-sm font-medium"
 >
 {plugin.repoUrl.replace("https://github.com/", "")}
 </a>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

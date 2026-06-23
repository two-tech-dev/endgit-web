"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
 GitBranch,
 Activity,
 Search,
 Settings,
 ToggleLeft,
 ToggleRight,
 ExternalLink,
 Lock,
 Globe,
 Code,
 Loader2,
 PackagePlus,
 ArrowRight,
 ChevronDown,
 Building2,
} from "lucide-react";
import { Skeleton, SkeletonText, SkeletonCard } from "@/components/Skeleton";

interface OrgSummary {
 id: number;
 login: string;
 description: string | null;
 avatarUrl: string;
 url: string;
}

interface Repo {
 id: number;
 name: string;
 fullName: string;
 description: string | null;
 language: string | null;
 isPrivate: boolean;
 htmlUrl: string;
 defaultBranch: string;
 stargazersCount: number;
 updatedAt: string;
 ciEnabled: boolean;
 pluginId: string | null;
 pluginSlug: string | null;
 pluginStatus: string | null;
}

export default function DevDashboardPage() {
 const { data: session, status: sessionStatus } = useSession();
 const [repos, setRepos] = useState<Repo[]>([]);
 const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");
 const [search, setSearch] = useState("");
 const [debouncedSearch, setDebouncedSearch] = useState("");
 const [hideNonEndstone, setHideNonEndstone] = useState(true);
 const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 const [loading, setLoading] = useState(true);
 const [hasAppInstalled, setHasAppInstalled] = useState<boolean | null>(null);
 const [error, setError] = useState("");
 const [toggling, setToggling] = useState<number | null>(null);
 const [page, setPage] = useState(1);
 const [hasMore, setHasMore] = useState(false);
 const [isFetchingMore, setIsFetchingMore] = useState(false);
 const [totalCount, setTotalCount] = useState(0);
 const [totalEnabled, setTotalEnabled] = useState(0);
 const [totalDisabled, setTotalDisabled] = useState(0);
 const [quota, setQuota] = useState<{
 used: number;
 limit: number;
 resetsAt: string;
 } | null>(null);
 const [orgs, setOrgs] = useState<OrgSummary[]>([]);
 const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
 const [orgsLoading, setOrgsLoading] = useState(false);
 const [orgsError, setOrgsError] = useState("");
 const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
 const orgDropdownRef = useRef<HTMLDivElement>(null);

 const initialFetchDone = useRef(false);

 useEffect(() => {
 if (sessionStatus !== "authenticated") return;
 fetchRepos(1, null);
 fetchOrgs();
 initialFetchDone.current = true;
 }, [sessionStatus]);

 useEffect(() => {
 if (!initialFetchDone.current) return;
 if (sessionStatus !== "authenticated") return;
 fetchRepos(1, selectedOrg, debouncedSearch, filter);
 }, [debouncedSearch, filter]);

 useEffect(() => {
 const handleClickOutside = (e: MouseEvent) => {
 if (
 orgDropdownRef.current &&
 !orgDropdownRef.current.contains(e.target as Node)
 ) {
 setOrgDropdownOpen(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 useEffect(() => {
 if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
 searchTimerRef.current = setTimeout(() => {
 setDebouncedSearch(search);
 }, 400);
 return () => {
 if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
 };
 }, [search]);

 const fetchOrgs = async () => {
 setOrgsLoading(true);
 setOrgsError("");
 try {
 const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
 const token = (session?.user as any)?.apiToken;
 const res = await fetch(`${apiUrl}/api/v1/github/orgs`, {
 headers: token ? { Authorization: `Bearer ${token}` } : {},
 });
 const json = await res.json();
 if (json.success) {
 setOrgs(json.data);
 } else {
 setOrgsError(json.error || "Failed to fetch organizations");
 }
 } catch {
 setOrgsError("Failed to load organizations");
 } finally {
 setOrgsLoading(false);
 }
 };

 const fetchRepos = async (
 pageNumber: number = 1,
 org: string | null = selectedOrg,
 searchQuery: string = debouncedSearch,
 currentFilter: string = filter,
 ) => {
 if (pageNumber === 1) setLoading(true);
 else setIsFetchingMore(true);

 setError("");
 try {
 const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
 const token = (session?.user as any)?.apiToken;

 if (pageNumber === 1 && hasAppInstalled === null) {
 const statusRes = await fetch(`${apiUrl}/api/v1/dashboard/status`, {
 headers: token ? { Authorization: `Bearer ${token}` } : {},
 });
 const statusJson = await statusRes.json();

 if (!statusJson.success) {
 setError(statusJson.error || "Failed to check installation status.");
 setLoading(false);
 setIsFetchingMore(false);
 return;
 }

 if (!statusJson.data.hasAppInstalled) {
 setHasAppInstalled(false);
 setLoading(false);
 setIsFetchingMore(false);
 return;
 }
 setHasAppInstalled(true);
 if (statusJson.data.quota) {
 setQuota(statusJson.data.quota);
 }
 }

 const orgParam = org ? `&org=${encodeURIComponent(org)}` : "";
 const searchParam = searchQuery
 ? `&search=${encodeURIComponent(searchQuery)}`
 : "";
 const filterParam =
 currentFilter !== "all"
 ? `&filter=${encodeURIComponent(currentFilter)}`
 : "";
 const res = await fetch(
 `${apiUrl}/api/v1/github/repos?page=${pageNumber}&per_page=50${orgParam}${searchParam}${filterParam}`,
 {
 headers: token ? { Authorization: `Bearer ${token}` } : {},
 },
 );
 const json = await res.json();
 if (json.success) {
 if (pageNumber === 1) {
 setRepos(json.data);
 } else {
 setRepos((prev) => [...prev, ...json.data]);
 }
 setHasMore(json.pagination?.hasMore || false);
 setPage(pageNumber);
 if (!searchQuery) {
 if (json.pagination?.totalCount !== undefined) {
 setTotalCount(json.pagination.totalCount);
 }
 if (json.pagination?.totalEnabled !== undefined) {
 setTotalEnabled(json.pagination.totalEnabled);
 }
 if (json.pagination?.totalDisabled !== undefined) {
 setTotalDisabled(json.pagination.totalDisabled);
 }
 }
 } else {
 setError(json.error || "Failed to fetch repos");
 }
 } catch (err) {
 setError(
 "Failed to connect to API. Make sure you're signed in with GitHub.",
 );
 } finally {
 if (pageNumber === 1) setLoading(false);
 else setIsFetchingMore(false);
 }
 };

 const handleOrgChange = (orgLogin: string | null) => {
 setSelectedOrg(orgLogin);
 setOrgDropdownOpen(false);
 fetchRepos(1, orgLogin, debouncedSearch, filter);
 };

 const toggleCI = async (repo: Repo) => {
 setToggling(repo.id);
 const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
 const token = (session?.user as any)?.apiToken;

 try {
 let res;
 if (repo.ciEnabled && repo.pluginId) {
 // Disable CI
 res = await fetch(
 `${apiUrl}/api/v1/github/repos/${repo.pluginId}/disable`,
 {
 method: "POST",
 headers: {
 Authorization: `Bearer ${token}`,
 "Content-Type": "application/json",
 },
 },
 );
 } else {
 // Enable CI
 res = await fetch(`${apiUrl}/api/v1/github/repos/${repo.id}/enable`, {
 method: "POST",
 headers: {
 Authorization: `Bearer ${token}`,
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 name: repo.name,
 fullName: repo.fullName,
 htmlUrl: repo.htmlUrl,
 language: repo.language,
 defaultBranch: repo.defaultBranch,
 description: repo.description,
 }),
 });
 }

 const json = await res.json().catch(() => ({}));
 if (!res.ok || json.success === false) {
 if (
 json.error &&
 json.error.includes(
 "EndGit GitHub App is installed on the organization",
 )
 ) {
 const installUrl =
 process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ||
 "https://github.com/apps/endgit-local-dev/installations/new";
 window.location.href = installUrl;
 return;
 }

 alert(
 `Failed to ${repo.ciEnabled ? "disable" : "enable"} CI:\n${json.error || "Unknown error"}`,
 );
 setToggling(null);
 return;
 }

 // Refresh current repos by reloading page 1
 await fetchRepos(1, selectedOrg, debouncedSearch, filter);
 } catch (err: any) {
 alert(`An error occurred while toggling CI: ${err.message}`);
 } finally {
 setToggling(null);
 }
 };

 const filteredRepos = repos.filter((repo) => {
 if (hideNonEndstone && !repo.ciEnabled) {
 if (
 repo.language !== "C++" &&
 repo.language !== "Python" &&
 repo.language !== "C"
 ) {
 return false;
 }
 }
 return true;
 });

 const enabledCount = repos.filter((r) => r.ciEnabled).length;
 const disabledCount = repos.filter((r) => !r.ciEnabled).length;
 const displayTotal = totalCount || repos.length;
 const displayEnabled = totalEnabled || enabledCount;
 const displayDisabled = totalDisabled || disabledCount;

 const langColor = (lang: string | null) => {
 switch (lang) {
 case "Python":
 return "#3572A5";
 case "C++":
 return "#f34b7d";
 case "TypeScript":
 return "#3178c6";
 case "JavaScript":
 return "#f1e05a";
 default:
 return "#8b949e";
 }
 };

 const statusBadge = (status: string | null) => {
 switch (status) {
 case "APPROVED":
 return {
 bg: "rgba(16,185,129,0.1)",
 color: "var(--status-success)",
 text: "Approved",
 };
 case "PENDING_REVIEW":
 return {
 bg: "rgba(245,158,11,0.1)",
 color: "var(--status-warning)",
 text: "Pending Review",
 };
 case "REJECTED":
 return {
 bg: "rgba(239,68,68,0.1)",
 color: "var(--status-error)",
 text: "Rejected",
 };
 case "DRAFT":
 return {
 bg: "rgba(100,116,139,0.1)",
 color: "var(--text-muted)",
 text: "Draft",
 };
 default:
 return null;
 }
 };

 const timeAgo = (d: string) => {
 const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
 if (s < 60) return "just now";
 if (s < 3600) return `${Math.floor(s / 60)}m ago`;
 if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
 return `${Math.floor(s / 86400)}d ago`;
 };

 if (sessionStatus === "loading") {
 return (
 <div className="container py-8">
 <div className="mb-6">
 <Skeleton width="14rem" height="2rem" className="mb-2" />
 <Skeleton width="20rem" height="0.875rem" />
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
 {Array.from({ length: 3 }, (_, i) => (
 <SkeletonCard key={i} className="p-5">
 <Skeleton width="5rem" height="0.6875rem" className="mb-1.5" />
 <Skeleton width="3rem" height="1.75rem" />
 </SkeletonCard>
 ))}
 </div>
 <SkeletonCard className="p-4 lg:px-5 mb-5">
 <div className="grid grid-flow-col auto-cols-max items-center gap-3">
 <Skeleton width={20} height={20} borderRadius="9999px" />
 <Skeleton width="10rem" height="0.875rem" />
 </div>
 </SkeletonCard>
 <div className="grid grid-flow-col auto-cols-max gap-3 mb-5 items-center">
 <Skeleton width="100%" height="2.5rem" borderRadius="2px" />
 <Skeleton width="14rem" height="2.5rem" borderRadius="2px" />
 </div>
 <div className="grid gap-3">
 {Array.from({ length: 5 }, (_, i) => (
 <SkeletonCard key={i} className="p-5 border-l-[3px] border-border">
 <div className="grid grid-cols-[1fr_auto] items-start">
 <div className="grid grid-flow-col auto-cols-max items-start gap-4">
 <Skeleton width={40} height={40} borderRadius="2px" />
 <div>
 <div className="grid grid-flow-col auto-cols-max gap-2 mb-1">
 <Skeleton width="8rem" height="0.9375rem" />
 <Skeleton
 width="3rem"
 height="0.6875rem"
 borderRadius="2px"
 />
 </div>
 <Skeleton
 width="70%"
 height="0.8125rem"
 className="mb-1.5"
 />
 <div className="grid grid-flow-col auto-cols-max gap-4">
 <Skeleton width="2rem" height="0.75rem" />
 <Skeleton width="3rem" height="0.75rem" />
 <Skeleton width="4rem" height="0.75rem" />
 </div>
 </div>
 </div>
 <Skeleton width="6rem" height="2rem" borderRadius="2px" />
 </div>
 </SkeletonCard>
 ))}
 </div>
 </div>
 );
 }

 if (sessionStatus === "unauthenticated") {
 return (
 <div className="container py-16 text-center">
 <h2 className="heading-3">Sign in Required</h2>
 <p className="text-text-muted mt-2">
 Please sign in with GitHub to access the Dev Dashboard.
 </p>
 </div>
 );
 }

 if (hasAppInstalled === false) {
 const installUrl =
 process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ||
 "https://github.com/apps/endgit-app/installations/new";
 return (
 <div className="container py-12 min-h-[60vh] grid place-items-center">
 <div className="card max-w-[600px] p-6 lg:p-10 text-center border border-border-highlight shadow-lg">
 <div className="w-20 h-20 bg-[#1890ff]/10 rounded-sm grid place-items-center mx-auto mb-6">
 <PackagePlus size={40} className="text-[#1890ff]" />
 </div>
 <h1 className="heading-2 mb-4">Welcome to EndGit!</h1>
 <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8">
 To enable CI/CD pipelines, you must install the EndGit GitHub App on
 your repositories. The app will automatically detect your Bedrock
 plugins, build them, and publish them to the marketplace.
 </p>
 <a
 href={installUrl}
 className="btn btn-primary inline-grid grid-cols-[auto_1fr_auto] items-center gap-2 text-lg py-3 px-8"
 >
 <ExternalLink size={20} /> Install GitHub App{" "}
 <ArrowRight size={20} />
 </a>
 </div>
 </div>
 );
 }

 return (
 <div className="container py-6 lg:py-8 ">
 {/* Header */}
 <div className="grid grid-cols-[1fr_auto] items-start lg:items-center mb-6 gap-3">
 <div>
 <h1 className="heading-2 flex flex-wrap items-center gap-3">
 <Settings size={28} className="text-accent" /> Dev Dashboard
 </h1>
 <p className="text-text-muted mt-1">
 Manage your GitHub repositories and CI/CD pipelines
 </p>
 </div>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 mb-6">
 <div className="card p-5">
 <div className="text-[0.6875rem] uppercase tracking-wider text-text-muted mb-1">
 Total Repos
 </div>
 <div className="text-3xl font-bold text-text-primary">
 {displayTotal}
 </div>
 </div>
 <div className="card p-5">
 <div className="text-[0.6875rem] uppercase tracking-wider text-text-muted mb-1">
 CI Enabled
 </div>
 <div className="text-3xl font-bold text-success">
 {displayEnabled}
 </div>
 </div>
 <div className="card p-5">
 <div className="text-[0.6875rem] uppercase tracking-wider text-text-muted mb-1">
 Disabled
 </div>
 <div className="text-3xl font-bold text-text-muted">
 {displayDisabled}
 </div>
 </div>
 </div>

 {/* Build Quota */}
 {quota && (
 <div className="card p-4 lg:px-5 mb-6 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-start sm:items-center gap-3 sm:gap-4">
 <div>
 <div className="text-[0.6875rem] uppercase tracking-wider text-text-muted mb-0.5">
 Weekly Builds
 </div>
 <div
 className={`text-lg font-bold ${quota.used >= quota.limit ? "text-error" : "text-text-primary"}`}
 >
 {quota.used}/{quota.limit}
 </div>
 </div>
 <div className="min-w-[120px]">
 <div className="h-2 bg-surface-secondary rounded-sm overflow-hidden">
 <div
 className={`h-full rounded-sm transition-[width] duration-300 ${
 quota.used >= quota.limit
 ? "bg-error"
 : quota.used >= quota.limit * 0.8
 ? "bg-warning"
 : "bg-accent"
 }`}
 style={{
 width: `${Math.min(100, (quota.used / quota.limit) * 100)}%`,
 }}
 />
 </div>
 </div>
 <div className="text-xs text-text-muted whitespace-nowrap">
 Resets{" "}
 {new Date(quota.resetsAt).toLocaleDateString("en-GB", {
 day: "2-digit",
 month: "short",
 })}
 </div>
 {quota.used >= quota.limit && (
 <div className="w-full p-3 bg-error/5 rounded-sm text-xs text-error">
 ⚠️ Build quota exceeded. New pushes will not trigger builds until
 the quota resets. Contact an admin to increase your limit.
 </div>
 )}
 </div>
 )}

 {/* Org Selector Section */}
 {orgsLoading && (
 <SkeletonCard className="p-5 mb-5">
 <div className="grid grid-cols-[1fr_auto] items-center mb-4">
 <div>
 <Skeleton width="5rem" height="0.6875rem" className="mb-1" />
 <Skeleton width="10rem" height="0.875rem" />
 </div>
 <Skeleton width="4rem" height="2rem" borderRadius="2px" />
 </div>
 <div className="grid grid-flow-col auto-cols-max gap-2">
 {Array.from({ length: 3 }, (_, i) => (
 <Skeleton
 key={i}
 width={`${5 + i * 1.5}rem`}
 height="1.75rem"
 borderRadius="2px"
 />
 ))}
 </div>
 </SkeletonCard>
 )}
 {orgsError && !orgsLoading && (
 <div className="card p-3 px-5 mb-5 border-l-[3px] border-warning text-xs text-warning">
 {orgsError}
 </div>
 )}
 {!orgsLoading && !orgsError && orgs.length > 1 && (
 <div className="card p-5 mb-5">
 <div className="grid grid-cols-[1fr_auto] items-center mb-4">
 <div>
 <div className="text-[0.6875rem] uppercase tracking-wider text-text-muted mb-0.5">
 Organization
 </div>
 <div className="text-sm text-text-primary font-medium">
 {selectedOrg
 ? `Viewing ${selectedOrg}`
 : "Viewing all organizations"}
 </div>
 </div>
 <div ref={orgDropdownRef} className="relative">
 <button
 onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
 className="grid grid-flow-col auto-cols-max items-center gap-2 py-2 px-3 rounded-sm border border-border bg-surface-secondary text-xs font-medium text-text-primary cursor-pointer transition-colors duration-150"
 >
 Switch
 <ChevronDown
 size={14}
 className={`text-text-muted transition-transform duration-150 ${orgDropdownOpen ? "rotate-180" : ""}`}
 />
 </button>
 {orgDropdownOpen && (
 <div className="absolute top-full right-0 mt-1 min-w-[280px] bg-surface-card border border-border rounded-sm shadow-lg z-50 overflow-hidden">
 <button
 onClick={() => handleOrgChange(null)}
 className={`grid grid-flow-col auto-cols-max items-center gap-3 w-full py-3 px-4 border-none text-sm text-text-primary text-left cursor-pointer transition-colors duration-100 hover:bg-surface-secondary ${
 selectedOrg === null
 ? "bg-surface-secondary"
 : "bg-transparent"
 }`}
 >
 <Building2 size={18} className="text-text-muted" />
 <span>All organizations</span>
 </button>
 {orgs.map((org) => (
 <button
 key={org.id}
 onClick={() => handleOrgChange(org.login)}
 className={`grid grid-flow-col auto-cols-max items-center gap-3 w-full py-3 px-4 border-none border-t border-border text-sm text-text-primary text-left cursor-pointer transition-colors duration-100 hover:bg-surface-secondary ${
 selectedOrg === org.login
 ? "bg-surface-secondary"
 : "bg-transparent"
 }`}
 >
 <Image
 src={org.avatarUrl}
 alt=""
 width={20}
 height={20}
 className="rounded-full"
 />
 <div className="min-w-0">
 <div className="font-medium">{org.login}</div>
 {org.description && (
 <div className="text-[0.75rem] text-text-muted overflow-hidden text-ellipsis whitespace-nowrap">
 {org.description}
 </div>
 )}
 </div>
 {selectedOrg === org.login && (
 <div className="w-1.5 h-1.5 rounded-sm bg-accent shrink-0" />
 )}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 <div className="flex flex-wrap gap-2">
 <button
 onClick={() => handleOrgChange(null)}
 className={`inline-grid grid-cols-[auto_1fr] items-center gap-2 py-2 px-3 rounded-sm border text-xs cursor-pointer transition-all duration-150 ${
 selectedOrg === null
 ? "border-accent bg-accent/10 font-semibold text-accent"
 : "border-border bg-surface-secondary font-normal text-text-muted"
 }`}
 >
 <Building2 size={14} />
 All
 </button>
 {orgs.map((org) => (
 <button
 key={org.id}
 onClick={() => handleOrgChange(org.login)}
 className={`inline-grid grid-cols-[auto_1fr] items-center gap-2 py-2 px-3 rounded-sm border text-xs cursor-pointer transition-all duration-150 ${
 selectedOrg === org.login
 ? "border-accent bg-accent/10 font-semibold text-accent"
 : "border-border bg-surface-secondary font-normal text-text-muted"
 }`}
 >
 <Image
 src={org.avatarUrl}
 alt=""
 width={16}
 height={16}
 className="rounded-full"
 />
 {org.login}
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Search + Filter */}
 <div className="dev-search-filter flex flex-wrap gap-3 mb-5 items-center justify-between">
 <div className="relative flex-1 min-w-[200px]">
 <Search
 size={16}
 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
 />
 <input
 type="text"
 placeholder="Search repositories..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full py-2.5 pl-9 pr-3 rounded-sm border border-border bg-surface-card text-text-primary text-sm outline-none"
 />
 </div>
 <div className="flex items-center gap-4 flex-wrap">
 <label className="flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer select-none">
 <input
 type="checkbox"
 checked={hideNonEndstone}
 onChange={(e) => setHideNonEndstone(e.target.checked)}
 className="accent-accent w-4 h-4 rounded-sm border-border bg-surface-secondary cursor-pointer"
 />
 Hide non-Endstone repos
 </label>
 <div className="grid grid-flow-col auto-cols-max gap-[2px] bg-surface-secondary p-[3px] rounded-sm">
 {(["all", "enabled", "disabled"] as const).map((f) => (
 <button
 key={f}
 onClick={() => setFilter(f)}
 className={`py-2 px-3.5 rounded-sm text-xs font-medium capitalize border-none cursor-pointer transition-all duration-150 ${
 filter === f
 ? "bg-surface-card text-text-primary shadow-sm"
 : "bg-transparent text-text-muted hover:text-text-primary"
 }`}
 >
 {f}{" "}
 {f === "all"
 ? `(${displayTotal})`
 : f === "enabled"
 ? `(${displayEnabled})`
 : `(${displayDisabled})`}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Loading / Error */}
 {loading && (
 <div className="grid gap-3">
 {Array.from({ length: 5 }, (_, i) => (
 <SkeletonCard key={i} className="p-5 border-l-[3px] border-border">
 <div className="grid grid-cols-[1fr_auto] items-start">
 <div className="grid grid-flow-col auto-cols-max items-start gap-4">
 <Skeleton width={40} height={40} borderRadius="2px" />
 <div>
 <div className="grid grid-flow-col auto-cols-max gap-2 mb-1">
 <Skeleton width="8rem" height="0.9375rem" />
 <Skeleton
 width="3rem"
 height="0.6875rem"
 borderRadius="2px"
 />
 <Skeleton
 width="4rem"
 height="0.6875rem"
 borderRadius="2px"
 />
 </div>
 <Skeleton
 width="70%"
 height="0.8125rem"
 className="mb-1.5"
 />
 <div className="grid grid-flow-col auto-cols-max gap-4">
 <Skeleton width="2rem" height="0.75rem" />
 <Skeleton width="3rem" height="0.75rem" />
 <Skeleton width="4rem" height="0.75rem" />
 </div>
 </div>
 </div>
 <Skeleton width="6rem" height="2rem" borderRadius="2px" />
 </div>
 </SkeletonCard>
 ))}
 </div>
 )}

 {error && (
 <div className="card p-6 text-center border-l-4 border-error">
 <p className="text-error font-semibold">{error}</p>
 <p className="text-text-muted text-sm mt-2">
 Make sure the API server is running and you are signed in with
 GitHub OAuth.
 </p>
 </div>
 )}

 {/* Repo List */}
 {!loading && !error && (
 <div className="grid gap-3">
 {filteredRepos.map((repo) => {
 const badge = statusBadge(repo.pluginStatus);
 return (
 <div
 key={repo.id}
 className={`card p-4 lg:p-5 border-l-[3px] transition-all duration-200 ${
 repo.ciEnabled ? "border-l-success" : "border-l-border"
 }`}
 >
 <div className="dev-repo-card-inner grid grid-cols-[1fr_auto] items-start">
 <div className="grid grid-flow-col auto-cols-max items-start gap-4">
 <div
 className="w-10 h-10 rounded-sm grid place-items-center shrink-0"
 style={{
 background: `${langColor(repo.language)}15`,
 border: `1px solid ${langColor(repo.language)}30`,
 }}
 >
 <Code
 size={18}
 style={{ color: langColor(repo.language) }}
 />
 </div>
 <div className="min-w-0">
 <div className="flex flex-wrap items-center gap-2">
 <span className="font-semibold text-[0.9375rem] text-text-primary">
 {repo.name}
 </span>
 {repo.isPrivate ? (
 <span className="inline-grid grid-cols-[auto_1fr] items-center gap-[3px] text-[0.6875rem] py-0.5 px-1.5 rounded-sm bg-warning/10 text-warning border border-warning/20">
 <Lock size={10} /> Private
 </span>
 ) : (
 <span className="inline-grid grid-cols-[auto_1fr] items-center gap-[3px] text-[0.6875rem] py-0.5 px-1.5 rounded-sm bg-success/8 text-text-muted">
 <Globe size={10} /> Public
 </span>
 )}
 {repo.language && (
 <span className="inline-grid grid-cols-[auto_1fr] items-center gap-1 text-[0.6875rem]">
 <span
 className="w-2 h-2 rounded-sm inline-block"
 style={{
 width: "8px",
 height: "8px",
 background: langColor(repo.language),
 }}
 />
 <span className="text-text-muted">
 {repo.language}
 </span>
 </span>
 )}
 {badge && (
 <span
 className="text-[0.6875rem] py-0.5 px-2 rounded-sm font-semibold"
 style={{
 background: badge.bg,
 color: badge.color,
 }}
 >
 {badge.text}
 </span>
 )}
 </div>
 <p className="text-xs text-text-muted mt-0.5 break-all sm:wrap-break-word normal-case min-w-0">
 {repo.description || "No description"}
 </p>
 <div className="flex flex-wrap gap-4 mt-1 text-xs text-text-muted">
 <span>⭐ {repo.stargazersCount}</span>
 <span>
 <GitBranch
 size={11}
 className="inline-block align-[-1px] mr-1"
 />
 {repo.defaultBranch}
 </span>
 <span>Updated {timeAgo(repo.updatedAt)}</span>
 </div>
 </div>
 </div>
 <div className="dev-repo-actions flex flex-wrap items-center gap-3 shrink-0 pt-3 sm:pt-0">
 {repo.ciEnabled && repo.pluginSlug && (
 <Link
 href={`/plugins/${repo.pluginSlug}/builds`}
 className="inline-grid grid-cols-[auto_1fr] items-center gap-1 text-xs text-accent font-medium"
 >
 View Builds <ExternalLink size={12} />
 </Link>
 )}
 <button
 onClick={() => toggleCI(repo)}
 disabled={toggling === repo.id}
 className={`w-full sm:w-auto grid grid-flow-col auto-cols-max items-center justify-center gap-1.5 py-2 px-4 rounded-sm text-xs font-semibold transition-all duration-200 border-none opacity-100 ${
 toggling === repo.id
 ? "cursor-wait opacity-50"
 : "cursor-pointer"
 } ${
 repo.ciEnabled
 ? "bg-error/8 text-error"
 : "bg-success/8 text-success"
 }`}
 >
 {repo.ciEnabled ? (
 <>
 <ToggleRight size={16} /> Disable CI
 </>
 ) : (
 <>
 <ToggleLeft size={16} /> Enable CI
 </>
 )}
 </button>
 </div>
 </div>
 </div>
 );
 })}

 {filteredRepos.length > 0 && hasMore && (
 <div className="text-center mt-6">
 <button
 className="btn btn-secondary min-w-[150px] inline-grid place-items-center"
 onClick={() =>
 fetchRepos(page + 1, selectedOrg, debouncedSearch)
 }
 disabled={isFetchingMore}
 >
 {isFetchingMore ? (
 <Loader2 size={16} className="spin" />
 ) : (
 "Load More"
 )}
 </button>
 </div>
 )}

 {filteredRepos.length === 0 && !loading && (
 <div className="text-center py-12 text-text-muted">
 <p className="text-base">No repositories found</p>
 <p className="text-sm mt-2">
 {search
 ? "Try a different search term"
 : "No GitHub repositories detected"}
 </p>
 </div>
 )}
 </div>
 )}
 </div>
 );
}

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
import { Skeleton, SkeletonText } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    fetchRepos(1, selectedOrg, debouncedSearch);
  }, [debouncedSearch]);

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
      const res = await fetch(
        `${apiUrl}/api/v1/github/repos?page=${pageNumber}&per_page=10${orgParam}${searchParam}`,
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
    fetchRepos(1, orgLogin, debouncedSearch);
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
      await fetchRepos(1, selectedOrg, debouncedSearch);
    } catch (err: any) {
      alert(`An error occurred while toggling CI: ${err.message}`);
    } finally {
      setToggling(null);
    }
  };

  const filteredRepos = repos.filter((r) => {
    if (filter === "enabled" && !r.ciEnabled) return false;
    if (filter === "disabled" && r.ciEnabled) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()))
      return false;
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
        return (
          <Badge className="bg-green-500/10 text-green-500">Approved</Badge>
        );
      case "PENDING_REVIEW":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500">
            Pending Review
          </Badge>
        );
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Draft</Badge>;
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
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6">
          <Skeleton
            width="14rem"
            height="2rem"
            style={{ marginBottom: "0.5rem" }}
          />
          <Skeleton width="20rem" height="0.875rem" />
        </div>
        <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/70 bg-card/80 p-5"
            >
              <Skeleton
                width="5rem"
                height="0.6875rem"
                style={{ marginBottom: "6px" }}
              />
              <Skeleton width="3rem" height="1.75rem" />
            </div>
          ))}
        </div>
        <div className="mb-5 rounded-2xl border border-border/70 bg-card/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Skeleton
                width="5rem"
                height="0.6875rem"
                style={{ marginBottom: "4px" }}
              />
              <Skeleton width="10rem" height="0.875rem" />
            </div>
            <Skeleton width="4rem" height="2rem" borderRadius="0.375rem" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton
                key={i}
                width={`${5 + i * 1.5}rem`}
                height="1.75rem"
                borderRadius="9999px"
              />
            ))}
          </div>
        </div>
        <div className="mb-5 flex items-center gap-3">
          <Skeleton
            width="100%"
            height="2.5rem"
            borderRadius="0.375rem"
            style={{ flex: 1 }}
          />
          <Skeleton width="14rem" height="2.5rem" borderRadius="0.375rem" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/70 border-l-[3px] border-l-border bg-card/80 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <Skeleton width={40} height={40} borderRadius="0.375rem" />
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap gap-2">
                      <Skeleton width="8rem" height="0.9375rem" />
                      <Skeleton
                        width="3rem"
                        height="0.6875rem"
                        borderRadius="9999px"
                      />
                      <Skeleton
                        width="4rem"
                        height="0.6875rem"
                        borderRadius="9999px"
                      />
                    </div>
                    <Skeleton
                      width="70%"
                      height="0.8125rem"
                      style={{ marginBottom: "6px" }}
                    />
                    <div className="flex gap-4">
                      <Skeleton width="2rem" height="0.75rem" />
                      <Skeleton width="3rem" height="0.75rem" />
                      <Skeleton width="4rem" height="0.75rem" />
                    </div>
                  </div>
                </div>
                <Skeleton width="6rem" height="2rem" borderRadius="0.375rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <Card className="max-w-md rounded-2xl border border-border/50 bg-card/60 p-8 text-center shadow-lg backdrop-blur-xl">
            <CardContent className="px-0">
              <h2 className="text-lg font-semibold">Sign in Required</h2>
              <p className="mt-2 text-muted-foreground">
                Please sign in with GitHub to access the Dev Dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (hasAppInstalled === false) {
    const installUrl =
      process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ||
      "https://github.com/apps/endgit-app/installations/new";
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <Card className="max-w-xl rounded-2xl border border-primary bg-card/60 p-10 text-center shadow-lg backdrop-blur-xl">
            <CardContent className="px-0">
           <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to EndGit!
          </h1>
              <p className="mb-8 text-lg leading-relaxed text-foreground">
                To enable CI/CD pipelines, you must install the EndGit GitHub App
                on your repositories. The app will automatically detect your
                Bedrock plugins, build them, and publish them to the marketplace.
              </p>
              <Button asChild size="lg" className="gap-2 px-8 text-base">
                <a href={installUrl}>
                  <ExternalLink size={20} /> Install GitHub App{" "}
                  <ArrowRight size={20} />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
             Dev Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your GitHub repositories and CI/CD pipelines
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
          <div className="mb-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Total Repos
          </div>
          <div className="text-[1.75rem] font-bold text-foreground">
            {displayTotal}
          </div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
          <div className="mb-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            CI Enabled
          </div>
          <div className="text-[1.75rem] font-bold text-green-500">
            {displayEnabled}
          </div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
          <div className="mb-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Disabled
          </div>
          <div className="text-[1.75rem] font-bold text-muted-foreground">
            {displayDisabled}
          </div>
        </div>
      </div>

      {/* Build Quota */}
      {quota && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border/70 bg-card/80 px-5 py-4">
          <div className="shrink-0">
            <div className="mb-0.5 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
              Weekly Builds
            </div>
            <div
              className={`text-lg font-bold ${quota.used >= quota.limit ? "text-red-500" : "text-foreground"}`}
            >
              {quota.used}/{quota.limit}
            </div>
          </div>
          <div className="min-w-[120px] flex-1">
            <div className="h-2 overflow-hidden rounded bg-muted">
              <div
                className={`h-full rounded transition-[width] duration-300 ${
                  quota.used >= quota.limit
                    ? "bg-red-500"
                    : quota.used >= quota.limit * 0.8
                      ? "bg-yellow-500"
                      : "bg-primary"
                }`}
                style={{
                  width: `${Math.min(100, (quota.used / quota.limit) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="whitespace-nowrap text-xs text-muted-foreground">
            Resets{" "}
            {new Date(quota.resetsAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </div>
          {quota.used >= quota.limit && (
            <div className="w-full rounded-sm bg-red-500/[0.06] p-3 text-[0.8125rem] text-red-500">
              ⚠️ Build quota exceeded. New pushes will not trigger builds until
              the quota resets. Contact an admin to increase your limit.
            </div>
          )}
        </div>
      )}

      {/* Org Selector Section */}
      {orgsLoading && (
        <div className="mb-5 rounded-2xl border border-border/70 bg-card/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Skeleton
                width="5rem"
                height="0.6875rem"
                style={{ marginBottom: "4px" }}
              />
              <Skeleton width="10rem" height="0.875rem" />
            </div>
            <Skeleton width="4rem" height="2rem" borderRadius="0.375rem" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton
                key={i}
                width={`${5 + i * 1.5}rem`}
                height="1.75rem"
                borderRadius="9999px"
              />
            ))}
          </div>
        </div>
      )}
      {orgsError && !orgsLoading && (
        <div className="mb-5 rounded-2xl border border-border/70 border-l-[3px] border-l-yellow-500 bg-card/80 px-5 py-3 text-[0.8125rem] text-yellow-500">
          {orgsError}
        </div>
      )}
      {!orgsLoading && !orgsError && orgs.length > 1 && (
        <div className="mb-5 rounded-2xl border border-border/70 bg-card/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="mb-0.5 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
                Organization
              </div>
              <div className="text-sm font-medium text-foreground">
                {selectedOrg
                  ? `Viewing ${selectedOrg}`
                  : "Viewing all organizations"}
              </div>
            </div>
            <div ref={orgDropdownRef} className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="gap-2"
              >
                Switch
                <ChevronDown
                  size={14}
                  className={`text-muted-foreground transition-transform duration-150 ${orgDropdownOpen ? "rotate-180" : ""}`}
                />
              </Button>
              {orgDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-[280px] overflow-hidden rounded-md border border-border bg-card shadow-lg">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-none px-4 py-3 text-sm"
                    onClick={() => handleOrgChange(null)}
                  >
                    <Building2 size={18} className="text-muted-foreground" />
                    <span>All organizations</span>
                  </Button>
                  {orgs.map((org) => (
                    <Button
                      key={org.id}
                      variant="ghost"
                      className={`w-full justify-start gap-3 rounded-none border-t border-border px-4 py-3 text-sm ${
                        selectedOrg === org.login ? "bg-muted" : ""
                      }`}
                      onClick={() => handleOrgChange(org.login)}
                    >
                      <Image
                        src={org.avatarUrl}
                        alt=""
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-medium">{org.login}</div>
                        {org.description && (
                          <div className="truncate text-xs text-muted-foreground">
                            {org.description}
                          </div>
                        )}
                      </div>
                      {selectedOrg === org.login && (
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedOrg === null ? "outline" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => handleOrgChange(null)}
            >
              <Building2 size={14} />
              All
            </Button>
            {orgs.map((org) => (
              <Button
                key={org.id}
                variant={selectedOrg === org.login ? "outline" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => handleOrgChange(org.login)}
              >
                <Image
                  src={org.avatarUrl}
                  alt=""
                  width={16}
                  height={16}
                  className="rounded-full"
                />
                {org.login}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex gap-0.5 rounded-md bg-muted p-0.5">
          {(["all", "enabled", "disabled"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              className="capitalize"
              onClick={() => setFilter(f)}
            >
              {f}{" "}
              {f === "all"
                ? `(${displayTotal})`
                : f === "enabled"
                  ? `(${displayEnabled})`
                  : `(${displayDisabled})`}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/70 border-l-[3px] border-l-border bg-card/80 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <Skeleton width={40} height={40} borderRadius="0.375rem" />
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap gap-2">
                      <Skeleton width="8rem" height="0.9375rem" />
                      <Skeleton
                        width="3rem"
                        height="0.6875rem"
                        borderRadius="9999px"
                      />
                    </div>
                    <Skeleton
                      width="70%"
                      height="0.8125rem"
                      style={{ marginBottom: "6px" }}
                    />
                    <div className="flex gap-4">
                      <Skeleton width="2rem" height="0.75rem" />
                      <Skeleton width="3rem" height="0.75rem" />
                      <Skeleton width="4rem" height="0.75rem" />
                    </div>
                  </div>
                </div>
                <Skeleton width="6rem" height="2rem" borderRadius="0.375rem" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-border/70 border-l-4 border-l-red-500 bg-card/80 p-6 text-center">
          <p className="font-semibold text-red-500">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Make sure the API server is running and you are signed in with GitHub
            OAuth.
          </p>
        </div>
      )}

      {/* Repo List */}
      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {filteredRepos.map((repo) => {
            const badge = statusBadge(repo.pluginStatus);
            return (
              <div
                key={repo.id}
                className={`rounded-2xl border border-border/70 border-l-[3px] bg-card/80 p-5 transition-all duration-200 ${
                  repo.ciEnabled ? "border-l-green-500" : "border-l-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border"
                      style={{
                        backgroundColor: `${langColor(repo.language)}15`,
                        borderColor: `${langColor(repo.language)}30`,
                      }}
                    >
                      <Code size={18} style={{ color: langColor(repo.language) }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[0.9375rem] font-semibold text-foreground">
                          {repo.name}
                        </span>
                        {repo.isPrivate ? (
                          <Badge
                            variant="outline"
                            className="gap-0.5 border-yellow-500/20 bg-yellow-500/10 text-[0.6875rem] text-yellow-500"
                          >
                            <Lock size={10} /> Private
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="gap-0.5 bg-green-500/[0.08] text-[0.6875rem] text-muted-foreground"
                          >
                            <Globe size={10} /> Public
                          </Badge>
                        )}
                        {repo.language && (
                          <span className="inline-flex items-center gap-1 text-[0.6875rem]">
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ backgroundColor: langColor(repo.language) }}
                            />
                            <span className="text-muted-foreground">
                              {repo.language}
                            </span>
                          </span>
                        )}
                        {badge}
                      </div>
                      <p className="mt-0.5 break-words text-[0.8125rem] text-muted-foreground">
                        {repo.description || "No description"}
                      </p>
                      <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                        <span>⭐ {repo.stargazersCount}</span>
                        <span className="inline-flex items-center gap-0.5">
                          <GitBranch size={11} /> {repo.defaultBranch}
                        </span>
                        <span>Updated {timeAgo(repo.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {repo.ciEnabled && repo.pluginSlug && (
                      <Link
                        href={`/plugins/${repo.pluginSlug}/builds`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        View Builds <ExternalLink size={12} />
                      </Link>
                    )}
                    <Button
                      variant={repo.ciEnabled ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleCI(repo)}
                      disabled={toggling === repo.id}
                    >
                      {toggling === repo.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : repo.ciEnabled ? (
                        <>
                          <ToggleRight size={16} /> Disable CI
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={16} /> Enable CI
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRepos.length > 0 && hasMore && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchRepos(page + 1, selectedOrg, debouncedSearch)}
                disabled={isFetchingMore}
                className="min-w-[150px]"
              >
                {isFetchingMore ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}

          {filteredRepos.length === 0 && !loading && (
            <div className="py-12 text-center text-muted-foreground">
              <p>No repositories found</p>
              <p className="mt-2 text-sm">
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

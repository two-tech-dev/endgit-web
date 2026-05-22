"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import PluginImage from "@/components/PluginImage";
import {
  Users,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Clock,
  Package,
  Activity,
  Loader2,
  Star,
  Filter,
  ShieldAlert,
  FlaskConical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Skeleton, SkeletonText } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const PLUGIN_STATUSES = [
  "ALL",
  "APPROVED",
  "PENDING_REVIEW",
  "REJECTED",
  "SUSPENDED",
  "FLAGGED",
  "DRAFT",
] as const;

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  APPROVED: {
    bg: "bg-green-500/10",
    text: "text-green-500",
    border: "border-green-500/30",
  },
  PENDING_REVIEW: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    border: "border-yellow-500/30",
  },
  PENDING: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    border: "border-yellow-500/30",
  },
  REJECTED: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/30",
  },
  SUSPENDED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-400/30",
  },
  FLAGGED: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/30",
  },
  DRAFT: {
    bg: "bg-slate-500/10",
    text: "text-muted-foreground",
    border: "border-slate-500/30",
  },
};

const NEGATIVE_STATUSES = ["REJECTED", "SUSPENDED", "FLAGGED"];

const TRUST_LEVELS = ["NEW", "TRUSTED", "FLAGGED", "ADMIN"];
const TRUST_STYLES: Record<string, { bg: string; text: string }> = {
  ADMIN: { bg: "bg-purple-500/10", text: "text-purple-500" },
  TRUSTED: { bg: "bg-green-500/10", text: "text-green-500" },
  NEW: { bg: "bg-slate-500/10", text: "text-muted-foreground" },
  FLAGGED: { bg: "bg-red-500/10", text: "text-red-500" },
};

export default function AdminPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [tab, setTab] = useState<"users" | "queue" | "plugins" | "system">(
    "users",
  );
  const [users, setUsers] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    plugins: 0,
    builds: 0,
    pendingReviews: 0,
  });
  const [userSearch, setUserSearch] = useState("");
  const [pluginSearch, setPluginSearch] = useState("");
  const [pluginStatusFilter, setPluginStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pluginRejectModal, setPluginRejectModal] = useState<{
    type: "plugin" | "version";
    pluginId: string;
    versionId?: string;
    name: string;
    currentStatus: string;
    targetStatus: string;
  } | null>(null);
  const [pluginRejectReason, setPluginRejectReason] = useState("");
  const [pluginRejectLoading, setPluginRejectLoading] = useState(false);
  const [expandedPlugins, setExpandedPlugins] = useState<Set<string>>(
    new Set(),
  );

  const togglePluginExpanded = (pluginId: string) => {
    setExpandedPlugins((prev) => {
      const next = new Set(prev);
      if (next.has(pluginId)) next.delete(pluginId);
      else next.add(pluginId);
      return next;
    });
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const token = (session?.user as any)?.apiToken || "";

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    loadData();
  }, [sessionStatus, tab]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      if (tab === "users") {
        const res = await fetch(
          `${apiUrl}/api/v1/admin/users?search=${userSearch}`,
          { headers },
        );
        const json = await res.json();
        if (json.success) setUsers(json.data);
        else setError(json.error);
      } else if (tab === "queue") {
        const res = await fetch(`${apiUrl}/api/v1/reviews/admin/queue`, {
          headers,
        });
        const json = await res.json();
        if (json.success) setQueue(json.data);
        else setError(json.error);
      } else if (tab === "plugins") {
        const res = await fetch(
          `${apiUrl}/api/v1/admin/plugins?search=${pluginSearch}`,
          { headers },
        );
        const json = await res.json();
        if (json.success) setPlugins(json.data);
        else setError(json.error);
      } else {
        const res = await fetch(`${apiUrl}/api/v1/admin/stats`, { headers });
        const json = await res.json();
        if (json.success) setStats(json.data);
        else setError(json.error);
      }
    } catch {
      setError("Failed to connect to API. Admin access required.");
    } finally {
      setLoading(false);
    }
  };

  const changeTrustLevel = async (userId: string, newLevel: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/users/${userId}/trust`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trustLevel: newLevel }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, trustLevel: newLevel } : u,
          ),
        );
      }
    } catch {
      /* noop */
    }
  };

  const changeQuota = async (userId: string, newQuota: number) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/users/${userId}/quota`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weeklyBuildQuota: newQuota }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, weeklyBuildQuota: newQuota } : u,
          ),
        );
      }
    } catch {
      /* noop */
    }
  };

  const [rejectModal, setRejectModal] = useState<{
    slug: string;
    name: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const reviewPlugin = async (
    slug: string,
    decision: string,
    comment?: string,
  ) => {
    setReviewLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/reviews/${slug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision,
          comment: comment || `${decision} by admin`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setQueue((prev) => prev.filter((p) => p.slug !== slug));
        setRejectModal(null);
        setRejectReason("");
      }
    } catch {
      /* noop */
    } finally {
      setReviewLoading(false);
    }
  };

  const changeVersionStatus = async (
    pluginId: string,
    versionId: string,
    newStatus: string,
    reason?: string,
  ) => {
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/admin/versions/${versionId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            ...(reason ? { reason } : {}),
          }),
        },
      );
      const json = await res.json();
      if (json.success) {
        setPlugins((prev) =>
          prev.map((p) => {
            if (p.id === pluginId) {
              return {
                ...p,
                versions: p.versions.map((v: any) =>
                  v.id === versionId ? { ...v, status: newStatus } : v,
                ),
              };
            }
            return p;
          }),
        );
      }
    } catch {
      /* noop */
    }
  };

  const changePluginStatus = async (
    pluginId: string,
    newStatus: string,
    reason?: string,
  ) => {
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/admin/plugins/${pluginId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            ...(reason ? { reason } : {}),
          }),
        },
      );
      const json = await res.json();
      if (json.success) {
        setPlugins((prev) =>
          prev.map((p) =>
            p.id === pluginId ? { ...p, status: newStatus } : p,
          ),
        );
      }
    } catch {
      /* noop */
    }
  };

  const handlePluginStatusChange = (
    pluginId: string,
    currentStatus: string,
    newStatus: string,
    pluginName: string,
  ) => {
    if (NEGATIVE_STATUSES.includes(newStatus) && currentStatus !== newStatus) {
      setPluginRejectModal({
        type: "plugin",
        pluginId,
        name: pluginName,
        currentStatus,
        targetStatus: newStatus,
      });
      setPluginRejectReason("");
    } else {
      changePluginStatus(pluginId, newStatus);
    }
  };

  const handleVersionStatusChange = (
    pluginId: string,
    versionId: string,
    currentStatus: string,
    newStatus: string,
    versionLabel: string,
  ) => {
    if (NEGATIVE_STATUSES.includes(newStatus) && currentStatus !== newStatus) {
      setPluginRejectModal({
        type: "version",
        pluginId,
        versionId,
        name: versionLabel,
        currentStatus,
        targetStatus: newStatus,
      });
      setPluginRejectReason("");
    } else {
      changeVersionStatus(pluginId, versionId, newStatus);
    }
  };

  const confirmPluginReject = async () => {
    if (!pluginRejectModal || !pluginRejectReason.trim()) return;
    setPluginRejectLoading(true);
    try {
      if (pluginRejectModal.type === "plugin") {
        await changePluginStatus(
          pluginRejectModal.pluginId,
          pluginRejectModal.targetStatus,
          pluginRejectReason.trim(),
        );
      } else if (pluginRejectModal.versionId) {
        await changeVersionStatus(
          pluginRejectModal.pluginId,
          pluginRejectModal.versionId,
          pluginRejectModal.targetStatus,
          pluginRejectReason.trim(),
        );
      }
      setPluginRejectModal(null);
      setPluginRejectReason("");
    } finally {
      setPluginRejectLoading(false);
    }
  };

  const toggleFeatured = async (pluginId: string) => {
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/admin/plugins/${pluginId}/featured`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const json = await res.json();
      if (json.success) {
        setPlugins((prev) =>
          prev.map((p) =>
            p.id === pluginId ? { ...p, isFeatured: json.data.isFeatured } : p,
          ),
        );
      }
    } catch {
      /* noop */
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Loader2 size={32} className="mx-auto animate-spin text-purple-500" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Shield size={48} className="mx-auto mb-4 text-purple-500" />
        <h2 className="text-lg font-semibold">Admin Access Required</h2>
        <p className="mt-1 text-muted-foreground">
          Please sign in with an admin account.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Admin Panel
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage users, review queue, and system settings
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 inline-flex gap-0.5 rounded-md bg-muted p-0.5">
        {(
          [
            { key: "users", label: "Users", icon: <Users size={14} /> },
            { key: "queue", label: "Review Queue", icon: <Eye size={14} /> },
            { key: "plugins", label: "Plugins", icon: <Package size={14} /> },
            { key: "system", label: "System", icon: <BarChart3 size={14} /> },
          ] as const
        ).map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "default" : "ghost"}
            size="lg"
            className="px-4"
            onClick={() => setTab(t.key)}
          >
            {t.icon} {t.label}
          </Button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-2xl border border-border/70 border-l-4 border-l-red-500 bg-card/80 p-5">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div>
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") loadData();
              }}
              className="max-w-[400px] pl-9"
            />
          </div>

          {loading ? (
            <div className="rounded-2xl border border-border/70 bg-card/80 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    {[
                      "User",
                      "Trust Level",
                      "Quota",
                      "Plugins",
                      "Joined",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="p-3 px-4 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }, (_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="p-3 px-4">
                        <div className="flex items-center gap-3">
                          <Skeleton
                            circle
                            width={32}
                            height={32}
                          />
                          <div>
                            <Skeleton
                              width="7rem"
                              height="0.875rem"
                              style={{ marginBottom: "4px" }}
                            />
                            <Skeleton width="5rem" height="0.75rem" />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 px-4">
                        <Skeleton
                          width="4rem"
                          height="1.25rem"
                          borderRadius="9999px"
                        />
                      </td>
                      <td className="p-3 px-4">
                        <Skeleton width="3.5rem" height="0.875rem" />
                      </td>
                      <td className="p-3 px-4">
                        <Skeleton width="1.5rem" height="0.875rem" />
                      </td>
                      <td className="p-3 px-4">
                        <Skeleton width="5rem" height="0.8125rem" />
                      </td>
                      <td className="p-3 px-4">
                        <Skeleton
                          width="5rem"
                          height="1.5rem"
                          borderRadius="0.25rem"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-card/80 p-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-card/80 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    {[
                      "User",
                      "Trust Level",
                      "Quota",
                      "Plugins",
                      "Joined",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="p-3 px-4 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => {
                    const ts =
                      TRUST_STYLES[user.trustLevel] || TRUST_STYLES.NEW;
                    return (
                      <tr key={user.id} className="border-b border-border">
                        <td className="p-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary text-xs font-bold text-white">
                              {user.avatarUrl ? (
                                <Image
                                  src={user.avatarUrl}
                                  alt=""
                                  width={32}
                                  height={32}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                user.username.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-semibold">
                                {user.displayName || user.username}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 px-4">
                          <Badge
                            variant="secondary"
                            className={`${ts.bg} ${ts.text}`}
                          >
                            {user.trustLevel}
                          </Badge>
                        </td>
                        <td className="p-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[0.8125rem] ${
                                user.weeklyBuildCount >= user.weeklyBuildQuota
                                  ? "text-red-500"
                                  : "text-foreground"
                              }`}
                            >
                              {user.weeklyBuildCount || 0}/
                              {user.weeklyBuildQuota || 50}
                            </span>
                            <input
                              type="number"
                              min="1"
                              max="10000"
                              defaultValue={user.weeklyBuildQuota || 50}
                              onBlur={(e) => {
                                const v = parseInt(e.target.value);
                                if (v && v !== user.weeklyBuildQuota)
                                  changeQuota(user.id, v);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  (e.target as HTMLInputElement).blur();
                              }}
                              className="w-15 rounded-sm border border-border bg-muted px-1.5 py-0.5 text-center text-xs text-foreground"
                            />
                          </div>
                        </td>
                        <td className="p-3 px-4 text-sm text-foreground">
                          {user._count?.plugins || 0}
                        </td>
                        <td className="p-3 px-4 text-[0.8125rem] text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 px-4">
                          <select
                            value={user.trustLevel}
                            onChange={(e) =>
                              changeTrustLevel(user.id, e.target.value)
                            }
                            className="cursor-pointer rounded-sm border border-border bg-muted px-2 py-1 text-xs text-foreground"
                          >
                            {TRUST_LEVELS.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Review Queue Tab — shows pending PLUGINS */}
      {tab === "queue" &&
        (loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/70 bg-card/80"
              >
                <div className="flex flex-col gap-3 border-t-4 border-t-border p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton
                        width={48}
                        height={48}
                        borderRadius="0.375rem"
                      />
                      <div>
                        <Skeleton
                          width="8rem"
                          height="1.125rem"
                          style={{ marginBottom: "4px" }}
                        />
                        <Skeleton width="5rem" height="0.8125rem" />
                      </div>
                    </div>
                    <Skeleton
                      width="3.5rem"
                      height="1.25rem"
                      borderRadius="9999px"
                    />
                  </div>
                  <SkeletonText lines={2} />
                  <div className="mt-2 flex gap-2 border-t border-border pt-3">
                    <Skeleton
                      width="100%"
                      height="2.25rem"
                      borderRadius="0.375rem"
                    />
                    <Skeleton
                      width="100%"
                      height="2.25rem"
                      borderRadius="0.375rem"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6">
            {queue.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-border/70 bg-card/80 p-12 text-center">
                <CheckCircle
                  size={40}
                  className="mx-auto mb-3 text-green-500"
                />
                <p className="font-semibold">All caught up!</p>
                <p className="text-sm text-muted-foreground">
                  No plugins pending review
                </p>
              </div>
            ) : (
              queue.map((plugin: any) => (
                <div
                  key={plugin.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border/70 border-t-4 border-t-yellow-500 bg-card/80"
                >
                  <div className="flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                          <PluginImage
                            iconUrl={plugin.iconUrl}
                            repoUrl={plugin.repoUrl}
                            alt={`${plugin.displayName} icon`}
                          />
                        </div>
                        <div>
                          <h3 className="flex items-center gap-1.5 text-lg font-semibold text-foreground">
                            {plugin.displayName}
                            {plugin.versions?.[0]?.isPreRelease && (
                              <span
                                title="This is a pre-release"
                                className="inline-flex items-center text-red-500"
                              >
                                <FlaskConical size={16} />
                              </span>
                            )}
                          </h3>
                          <p className="text-[0.8125rem] text-muted-foreground">
                            @{plugin.author?.username}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          plugin.pluginType === "PYTHON"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-purple-500/10 text-purple-500"
                        }
                      >
                        {plugin.pluginType}
                      </Badge>
                    </div>

                    <p className="line-clamp-2 text-[0.8125rem] leading-[1.5] text-foreground">
                      {plugin.description}
                    </p>

                    <div className="mt-2 flex gap-2 border-t border-border pt-3">
                      <Button
                        className="flex-1 bg-green-600 text-white hover:bg-green-700"
                        size="sm"
                        onClick={() =>
                          reviewPlugin(plugin.slug, "APPROVED")
                        }
                      >
                        <CheckCircle size={16} /> Approve Plugin
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        size="sm"
                        onClick={() =>
                          setRejectModal({
                            slug: plugin.slug,
                            name: plugin.displayName,
                          })
                        }
                      >
                        <XCircle size={16} /> Reject Plugin
                      </Button>
                    </div>
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/plugins/${plugin.slug}`}
                        className="text-center text-xs text-primary"
                      >
                        View Plugin →
                      </Link>
                      {plugin.repoUrl && plugin.versions?.[0]?.fileHash && (
                        <a
                          href={`${plugin.repoUrl}/commit/${plugin.versions[0].fileHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center text-xs text-muted-foreground"
                        >
                          View Commit →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Reject Reason Modal */}
            {rejectModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
              >
                <div
                  className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-border/70 border-t-4 border-t-red-500 bg-card/80 shadow-lg backdrop-blur-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground">
                      Reject Plugin
                    </h3>
                    <p className="mb-5 mt-1 text-sm text-muted-foreground">
                      Rejecting{" "}
                      <strong className="text-foreground">
                        {rejectModal.name}
                      </strong>
                      . The author will be notified via email with your reason.
                    </p>

                    <label className="block text-[0.8125rem] font-semibold text-foreground">
                      Reason for Rejection *
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder={
                          "Explain why this plugin is being rejected...\n\nExample:\nA1 — Complete and serve a purpose:\n> The plugin must be complete and serve a purpose.\n\nThe readme is outdated. Please resolve these issues and submit the plugin again."
                        }
                        rows={8}
                        className="mt-2 w-full resize-y rounded-md border border-border bg-muted p-3 font-[inherit] text-sm leading-[1.6] text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                      />
                    </label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Supports **bold** and {">"} blockquote formatting in the
                      email.
                    </p>

                    <div className="mt-5 flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRejectModal(null);
                          setRejectReason("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-500 text-white hover:bg-red-600"
                        disabled={!rejectReason.trim() || reviewLoading}
                        onClick={() =>
                          rejectReason.trim() &&
                          reviewPlugin(
                            rejectModal.slug,
                            "REJECTED",
                            rejectReason.trim(),
                          )
                        }
                      >
                        {reviewLoading && (
                          <Loader2 size={14} className="animate-spin" />
                        )}
                        <XCircle size={14} /> Reject & Notify Author
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

      {/* Plugins Tab */}
      {tab === "plugins" &&
        (() => {
          const filtered =
            pluginStatusFilter === "ALL"
              ? plugins
              : plugins.filter((p) => p.status === pluginStatusFilter);
          return (
            <div className="rounded-2xl border border-border/70 bg-card/80 p-6">
              {/* Search + Filter Bar */}
              <div className="mb-4 flex flex-wrap gap-4">
                <div className="relative min-w-[240px] flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="text"
                    placeholder="Search plugins by name or slug..."
                    className="pl-10"
                    value={pluginSearch}
                    onChange={(e) => setPluginSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadData()}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={loadData}>
                  Search
                </Button>
              </div>

              {/* Status Filter Pills */}
              <div className="mb-5 flex flex-wrap items-center gap-1.5">
                <Filter size={14} className="mr-1 text-muted-foreground" />
                {PLUGIN_STATUSES.map((s) => {
                  const isActive = pluginStatusFilter === s;
                  const sc = s !== "ALL" ? STATUS_STYLES[s] : null;
                  const count =
                    s === "ALL"
                      ? plugins.length
                      : plugins.filter((p) => p.status === s).length;
                  return (
                    <Button
                      key={s}
                      variant={isActive ? "default" : "ghost"}
                      size="xs"
                      className={`rounded-full ${
                        isActive && sc
                          ? `${sc.bg} ${sc.text} border ${sc.border}`
                          : ""
                      }`}
                      onClick={() => setPluginStatusFilter(s)}
                    >
                      {s === "ALL" ? "All" : s.replace("_", " ")}
                      <span
                        className={`ml-1 min-w-[20px] rounded-full px-1.5 text-[0.6875rem] ${
                          isActive
                            ? "bg-white/15"
                            : "bg-muted"
                        }`}
                      >
                        {count}
                      </span>
                    </Button>
                  );
                })}
              </div>

              {loading ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border text-left">
                      {["Plugin", "Author", "Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="pb-3 pl-0 pr-4 text-[0.8125rem] text-muted-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }, (_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Skeleton width="8rem" height="0.875rem" />
                            <Skeleton width="4rem" height="0.75rem" />
                          </div>
                        </td>
                        <td className="p-4">
                          <Skeleton width="6rem" height="0.875rem" />
                        </td>
                        <td className="p-4">
                          <Skeleton
                            width="5rem"
                            height="1.5rem"
                            borderRadius="0.25rem"
                          />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton
                              width="2rem"
                              height="2rem"
                              borderRadius="0.25rem"
                            />
                            <Skeleton
                              width="2rem"
                              height="2rem"
                              borderRadius="0.25rem"
                            />
                            <Skeleton
                              width="2.5rem"
                              height="2rem"
                              borderRadius="0.25rem"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 pl-0 pr-4 text-[0.8125rem] text-muted-foreground">
                        Plugin
                      </th>
                      <th className="pb-3 pl-0 pr-4 text-[0.8125rem] text-muted-foreground">
                        Author
                      </th>
                      <th className="pb-3 pl-0 pr-4 text-[0.8125rem] text-muted-foreground">
                        Status
                      </th>
                      <th className="pb-3 pl-0 pr-4 text-right text-[0.8125rem] text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((plugin: any) => {
                      const psc =
                        STATUS_STYLES[plugin.status] || STATUS_STYLES.DRAFT;
                      return (
                        <React.Fragment key={plugin.id}>
                          <tr className="border-b border-border">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="font-semibold">
                                  {plugin.displayName}
                                </div>
                                <div className="font-mono text-xs text-muted-foreground">
                                  {plugin.slug}
                                </div>
                                {plugin.versions &&
                                  plugin.versions.length > 0 && (
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      className={`gap-1 ${
                                        expandedPlugins.has(plugin.id)
                                          ? "bg-muted"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        togglePluginExpanded(plugin.id)
                                      }
                                    >
                                      {expandedPlugins.has(plugin.id) ? (
                                        <ChevronDown size={14} />
                                      ) : (
                                        <ChevronRight size={14} />
                                      )}
                                      Releases ({plugin.versions.length})
                                    </Button>
                                  )}
                              </div>
                            </td>
                            <td className="p-4 text-sm">
                              {plugin.author?.displayName ||
                                plugin.author?.username}
                            </td>
                            <td className="p-4">
                              <select
                                value={plugin.status}
                                onChange={(e) =>
                                  handlePluginStatusChange(
                                    plugin.id,
                                    plugin.status,
                                    e.target.value,
                                    plugin.displayName,
                                  )
                                }
                                className={`cursor-pointer rounded-sm border bg-transparent px-2 py-1 text-[0.8125rem] font-semibold ${psc.bg} ${psc.text} ${psc.border}`}
                              >
                                <option value="DRAFT">DRAFT</option>
                                <option value="PENDING_REVIEW">
                                  PENDING_REVIEW
                                </option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                                <option value="SUSPENDED">SUSPENDED</option>
                                <option value="FLAGGED">FLAGGED</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {plugin.status === "APPROVED" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => {
                                      setPluginRejectModal({
                                        type: "plugin",
                                        pluginId: plugin.id,
                                        name: plugin.displayName,
                                        currentStatus: plugin.status,
                                        targetStatus: "REJECTED",
                                      });
                                      setPluginRejectReason("");
                                    }}
                                    title="Reject this approved plugin"
                                  >
                                    <ShieldAlert size={14} /> Reject
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="icon-sm"
                                  className={
                                    plugin.isFeatured
                                      ? "border-yellow-400 bg-yellow-400/15"
                                      : "bg-muted"
                                  }
                                  onClick={() => toggleFeatured(plugin.id)}
                                  title={
                                    plugin.isFeatured
                                      ? "Remove Featured"
                                      : "Mark as Featured"
                                  }
                                >
                                  <Star
                                    size={16}
                                    className={
                                      plugin.isFeatured
                                        ? "text-yellow-400"
                                        : "text-muted-foreground"
                                    }
                                    fill={
                                      plugin.isFeatured ? "#fbbf24" : "none"
                                    }
                                  />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={`/plugins/${plugin.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    View
                                  </a>
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {expandedPlugins.has(plugin.id) &&
                            plugin.versions &&
                            plugin.versions.length > 0 && (
                              <tr className="border-b border-border bg-black/[0.02]">
                                <td
                                  colSpan={4}
                                  className="px-8 pb-4 pl-8 pr-4 pt-3"
                                >
                                  <div className="flex flex-col gap-1.5">
                                    {plugin.versions.map((v: any) => {
                                      const vsc =
                                        STATUS_STYLES[v.status] ||
                                        STATUS_STYLES.DRAFT;
                                      return (
                                        <div
                                          key={v.id}
                                          className={`flex items-center gap-2.5 rounded-sm border bg-card px-2.5 py-1.5 ${vsc.border}`}
                                        >
                                          <span className="min-w-[56px] text-[0.8125rem] font-bold text-foreground">
                                            v{v.version}
                                          </span>
                                          <Badge
                                            variant="secondary"
                                            className={`${vsc.bg} ${vsc.text} uppercase tracking-wide`}
                                          >
                                            {v.status}
                                          </Badge>
                                          <select
                                            value={v.status}
                                            onChange={(e) =>
                                              handleVersionStatusChange(
                                                plugin.id,
                                                v.id,
                                                v.status,
                                                e.target.value,
                                                `${plugin.displayName} v${v.version}`,
                                              )
                                            }
                                            className="ml-auto cursor-pointer rounded border border-border bg-muted text-[0.6875rem] text-foreground"
                                          >
                                            <option value="PENDING">
                                              PENDING
                                            </option>
                                            <option value="APPROVED">
                                              APPROVED
                                            </option>
                                            <option value="REJECTED">
                                              REJECTED
                                            </option>
                                          </select>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </td>
                              </tr>
                            )}
                        </React.Fragment>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-muted-foreground"
                        >
                          {pluginStatusFilter !== "ALL"
                            ? `No ${pluginStatusFilter.replace("_", " ").toLowerCase()} plugins found`
                            : "No plugins found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          );
        })()}

      {/* Plugin/Version Rejection Reason Modal */}
      {pluginRejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => {
            setPluginRejectModal(null);
            setPluginRejectReason("");
          }}
        >
          <div
            className={`w-full max-w-[560px] overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-lg backdrop-blur-xl border-t-4 ${
              pluginRejectModal.targetStatus === "SUSPENDED"
                ? "border-t-red-400"
                : pluginRejectModal.targetStatus === "FLAGGED"
                  ? "border-t-orange-500"
                  : "border-t-red-500"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="mb-1 flex items-center gap-3">
                <ShieldAlert
                  size={22}
                  className={
                    pluginRejectModal.targetStatus === "FLAGGED"
                      ? "text-orange-500"
                      : "text-red-500"
                  }
                />
                <h3 className="text-lg font-bold text-foreground">
                  {pluginRejectModal.targetStatus === "SUSPENDED"
                    ? "Suspend"
                    : pluginRejectModal.targetStatus === "FLAGGED"
                      ? "Flag"
                      : "Reject"}{" "}
                  {pluginRejectModal.type === "version" ? "Version" : "Plugin"}
                </h3>
              </div>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Changing{" "}
                <strong className="text-foreground">
                  {pluginRejectModal.name}
                </strong>{" "}
                from{" "}
                <span
                  className={`font-semibold ${
                    STATUS_STYLES[pluginRejectModal.currentStatus]?.text ||
                    "text-foreground"
                  }`}
                >
                  {pluginRejectModal.currentStatus}
                </span>
                {" → "}
                <span
                  className={`font-semibold ${
                    STATUS_STYLES[pluginRejectModal.targetStatus]?.text ||
                    "text-red-500"
                  }`}
                >
                  {pluginRejectModal.targetStatus}
                </span>
                .
                {pluginRejectModal.currentStatus === "APPROVED" && (
                  <span className="mt-2 block rounded-sm border-l-[3px] border-l-yellow-500 bg-yellow-500/[0.08] px-3 py-2 text-[0.8125rem]">
                    <AlertTriangle
                      size={12}
                      className="mr-1 inline align-middle"
                    />
                    This plugin/version is currently{" "}
                    <strong>live and approved</strong>. This action will remove
                    it from public availability.
                  </span>
                )}
              </p>

              <label className="mb-2 block text-[0.8125rem] font-semibold text-foreground">
                Reason for{" "}
                {pluginRejectModal.targetStatus === "SUSPENDED"
                  ? "Suspension"
                  : pluginRejectModal.targetStatus === "FLAGGED"
                    ? "Flagging"
                    : "Rejection"}{" "}
                *
              </label>
              <textarea
                value={pluginRejectReason}
                onChange={(e) => setPluginRejectReason(e.target.value)}
                autoFocus
                placeholder={`Explain why this ${pluginRejectModal.type} is being ${pluginRejectModal.targetStatus.toLowerCase()}...\n\nExample:\nSecurity concern — Suspicious network calls detected in decompiled code.\n\nThe plugin will be reverted to non-public status.`}
                rows={7}
                className="w-full resize-y rounded-md border border-border bg-muted p-3 font-[inherit] text-sm leading-[1.6] text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />

              <div className="mt-5 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPluginRejectModal(null);
                    setPluginRejectReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className={`text-white ${
                    pluginRejectReason.trim()
                      ? STATUS_STYLES[pluginRejectModal.targetStatus]?.text ===
                        "text-red-500"
                        ? "bg-red-500 hover:bg-red-600"
                        : STATUS_STYLES[pluginRejectModal.targetStatus]?.text ===
                            "text-red-400"
                          ? "bg-red-400 hover:bg-red-500"
                          : STATUS_STYLES[pluginRejectModal.targetStatus]?.text ===
                              "text-orange-500"
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-red-500 hover:bg-red-600"
                      : "bg-red-500/30"
                  } ${
                    !pluginRejectReason.trim() ? "cursor-not-allowed" : ""
                  } ${pluginRejectLoading ? "opacity-70" : ""}`}
                  disabled={!pluginRejectReason.trim() || pluginRejectLoading}
                  onClick={confirmPluginReject}
                >
                  {pluginRejectLoading && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  <ShieldAlert size={14} />
                  {pluginRejectModal.targetStatus === "SUSPENDED"
                    ? "Suspend"
                    : pluginRejectModal.targetStatus === "FLAGGED"
                      ? "Flag"
                      : "Reject"}{" "}
                  & Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {tab === "system" &&
        (loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/70 bg-card/80"
              >
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <Skeleton
                      width={40}
                      height={40}
                      borderRadius="0.375rem"
                    />
                    <Skeleton width="5rem" height="0.8125rem" />
                  </div>
                  <Skeleton width="4rem" height="2rem" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Total Users",
                value: stats.users,
                icon: <Users size={20} className="text-primary" />,
                bg: "bg-purple-500/[0.08]",
              },
              {
                label: "Total Plugins",
                value: stats.plugins,
                icon: <Package size={20} className="text-primary" />,
                bg: "bg-sky-500/[0.08]",
              },
              {
                label: "Total Builds",
                value: stats.builds,
                icon: <Activity size={20} className="text-green-500" />,
                bg: "bg-green-500/[0.08]",
              },
              {
                label: "Pending Reviews",
                value: stats.pendingReviews,
                icon: (
                  <AlertTriangle size={20} className="text-yellow-500" />
                ),
                bg: "bg-yellow-500/[0.08]",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border/70 bg-card/80 p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${s.bg}`}
                  >
                    {s.icon}
                  </div>
                  <span className="text-[0.8125rem] uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

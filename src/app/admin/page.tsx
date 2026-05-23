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
import { Skeleton, SkeletonText, SkeletonCard } from "@/components/Skeleton";

const PLUGIN_STATUSES = [
  "ALL",
  "APPROVED",
  "PENDING_REVIEW",
  "REJECTED",
  "SUSPENDED",
  "FLAGGED",
  "DRAFT",
] as const;
const STATUS_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  APPROVED: {
    bg: "rgba(16,185,129,0.1)",
    color: "var(--status-success)",
    border: "rgba(16,185,129,0.3)",
  },
  PENDING_REVIEW: {
    bg: "rgba(245,158,11,0.1)",
    color: "var(--status-warning)",
    border: "rgba(245,158,11,0.3)",
  },
  PENDING: {
    bg: "rgba(245,158,11,0.1)",
    color: "var(--status-warning)",
    border: "rgba(245,158,11,0.3)",
  },
  REJECTED: {
    bg: "rgba(239,68,68,0.1)",
    color: "var(--status-error)",
    border: "rgba(239,68,68,0.3)",
  },
  SUSPENDED: {
    bg: "rgba(239,68,68,0.08)",
    color: "#f87171",
    border: "rgba(248,113,113,0.3)",
  },
  FLAGGED: {
    bg: "rgba(251,146,60,0.1)",
    color: "#fb923c",
    border: "rgba(251,146,60,0.3)",
  },
  DRAFT: {
    bg: "rgba(100,116,139,0.1)",
    color: "var(--text-muted)",
    border: "rgba(100,116,139,0.3)",
  },
};
const NEGATIVE_STATUSES = ["REJECTED", "SUSPENDED", "FLAGGED"];

const TRUST_LEVELS = ["NEW", "TRUSTED", "FLAGGED", "ADMIN"];
const TRUST_COLORS: Record<string, { bg: string; color: string }> = {
  ADMIN: { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  TRUSTED: { bg: "rgba(16,185,129,0.1)", color: "var(--status-success)" },
  NEW: { bg: "rgba(100,116,139,0.1)", color: "var(--text-muted)" },
  FLAGGED: { bg: "rgba(239,68,68,0.1)", color: "var(--status-error)" },
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-success/10 text-success border-success/20";
    case "PENDING":
    case "PENDING_REVIEW":
      return "bg-warning/10 text-warning border-warning/20";
    case "REJECTED":
      return "bg-error/10 text-error border-error/20";
    case "SUSPENDED":
      return "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20";
    case "FLAGGED":
      return "bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20";
    default:
      return "bg-surface-secondary text-text-muted border border-border";
  }
};

const getVersionRowClass = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "border-success/20 bg-surface-card";
    case "PENDING":
    case "PENDING_REVIEW":
      return "border-warning/20 bg-surface-card";
    case "REJECTED":
      return "border-error/20 bg-surface-card";
    default:
      return "border-border bg-surface-card";
  }
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

  // Modal for rejecting plugins/versions from the Plugins tab
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

  // Intercept status changes: if changing TO a negative status, open rejection reason modal
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
      <div className="container py-16 text-center">
        <Loader2 size={32} className="text-[#8b5cf6] animate-spin mx-auto" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="container py-16 text-center">
        <Shield size={48} className="mx-auto mb-4 text-[#8b5cf6]" />
        <h2 className="heading-3">Admin Access Required</h2>
        <p className="text-text-muted mt-2">
          Please sign in with an admin account.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-6 lg:py-8 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="heading-2 flex items-center gap-3">
          <Shield size={28} className="text-[#8b5cf6]" /> Admin Panel
        </h1>
        <p className="text-text-muted mt-1">
          Manage users, review queue, and system settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-[2px] bg-surface-secondary p-[3px] rounded-md mb-6 w-full sm:w-fit">
        {(
          [
            { key: "users", label: "Users", icon: <Users size={14} /> },
            { key: "queue", label: "Review Queue", icon: <Eye size={14} /> },
            { key: "plugins", label: "Plugins", icon: <Package size={14} /> },
            { key: "system", label: "System", icon: <BarChart3 size={14} /> },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-sm text-[13px] font-medium transition-all cursor-pointer border-none shadow-none ${
              tab === t.key
                ? "bg-surface-card text-text-primary shadow-sm"
                : "bg-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="card p-5 mb-4 border-l-4 border-l-error">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="w-full max-w-full overflow-hidden">
          <div className="mb-4 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") loadData();
              }}
              className="w-full max-w-[400px] pl-9 pr-3 py-2.5 rounded-md border border-border bg-surface-card text-text-primary text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          {(() => {
            const getTrustBadgeClass = (level: string) => {
              switch (level) {
                case "ADMIN":
                  return "bg-[#8b5cf6]/10 text-[#8b5cf6]";
                case "TRUSTED":
                  return "bg-success/10 text-success border border-success/20";
                case "FLAGGED":
                  return "bg-error/10 text-error border border-error/20";
                default:
                  return "bg-surface-secondary text-text-muted border border-border";
              }
            };

            return loading ? (
              <div className="card w-full max-w-full overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-secondary border-b border-border">
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
                          className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-text-muted font-semibold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }, (_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton circle width={32} height={32} />
                            <div>
                              <Skeleton
                                width="7rem"
                                height="0.875rem"
                                className="mb-1"
                              />
                              <Skeleton width="5rem" height="0.75rem" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton
                            width="4rem"
                            height="1.25rem"
                            borderRadius="9999px"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton width="3.5rem" height="0.875rem" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton width="1.5rem" height="0.875rem" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton width="5rem" height="0.8125rem" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton
                            width="5rem"
                            height="1.5rem"
                            borderRadius="var(--radius-sm)"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : users.length === 0 ? (
              <div className="card p-12 text-center w-full">
                <p className="text-text-muted">No users found</p>
              </div>
            ) : (
              <div className="card w-full max-w-full overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-secondary border-b border-border">
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
                          className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-text-muted font-semibold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: any) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-surface-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand text-white grid place-items-center text-xs font-bold overflow-hidden flex-shrink-0">
                              {user.avatarUrl ? (
                                <Image
                                  src={user.avatarUrl}
                                  alt=""
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                user.username.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-text-primary">
                                {user.displayName || user.username}
                              </div>
                              <div className="text-xs text-text-muted">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTrustBadgeClass(
                              user.trustLevel,
                            )}`}
                          >
                            {user.trustLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[13px] ${
                                user.weeklyBuildCount >= user.weeklyBuildQuota
                                  ? "text-error font-semibold"
                                  : "text-text-secondary"
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
                              className="w-[60px] px-1.5 py-0.5 rounded-sm border border-border bg-surface-secondary text-text-primary text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          {user._count?.plugins || 0}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.trustLevel}
                            onChange={(e) =>
                              changeTrustLevel(user.id, e.target.value)
                            }
                            className="px-2 py-1 rounded-sm border border-border bg-surface-secondary text-text-primary text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                          >
                            {TRUST_LEVELS.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}

      {/* Review Queue Tab — shows pending PLUGINS */}
      {tab === "queue" &&
        (loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonCard key={i} className="p-0 border-t-4 border-t-border">
                <div className="p-5 grid gap-3">
                  <div className="grid grid-cols-[1fr_auto] items-start">
                    <div className="flex items-center gap-3">
                      <Skeleton
                        width={48}
                        height={48}
                        borderRadius="var(--radius-md)"
                      />
                      <div>
                        <Skeleton
                          width="8rem"
                          height="1.125rem"
                          className="mb-1"
                        />
                        <Skeleton width="5rem" height="0.8125rem" />
                      </div>
                    </div>
                    <Skeleton
                      width="3.5rem"
                      height="1.25rem"
                      borderRadius="var(--radius-full)"
                    />
                  </div>
                  <SkeletonText lines={2} />
                  <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-3 border-t border-border w-full">
                    <div className="flex-1">
                      <Skeleton
                        width="100%"
                        height="2.25rem"
                        borderRadius="var(--radius-md)"
                      />
                    </div>
                    <div className="flex-1">
                      <Skeleton
                        width="100%"
                        height="2.25rem"
                        borderRadius="var(--radius-md)"
                      />
                    </div>
                  </div>
                </div>
              </SkeletonCard>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {queue.length === 0 ? (
              <div className="card p-12 text-center col-span-full">
                <CheckCircle size={40} className="text-success mx-auto mb-3" />
                <p className="font-semibold text-text-primary">
                  All caught up!
                </p>
                <p className="text-text-muted text-sm">
                  No plugins pending review
                </p>
              </div>
            ) : (
              queue.map((plugin: any) => (
                <div
                  key={plugin.id}
                  className="card p-0 grid overflow-hidden border-t-4 border-t-warning border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-5 grid gap-3">
                    <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-md bg-surface-secondary grid place-items-center border border-border flex-shrink-0 overflow-hidden">
                          <PluginImage
                            iconUrl={plugin.iconUrl}
                            repoUrl={plugin.repoUrl}
                            alt={`${plugin.displayName} icon`}
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="heading-3 text-lg font-bold m-0 text-text-primary flex flex-wrap items-center gap-1.5 font-sans">
                            <span className="truncate">{plugin.displayName}</span>
                            {plugin.versions?.[0]?.isPreRelease && (
                              <span
                                title="This is a pre-release"
                                className="inline-flex items-center text-error"
                              >
                                <FlaskConical size={16} />
                              </span>
                            )}
                          </h3>
                          <p className="text-text-muted text-xs">
                            @{plugin.author?.username}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`badge ${plugin.pluginType === "PYTHON" ? "badge-green" : "badge-purple"}`}
                      >
                        {plugin.pluginType}
                      </span>
                    </div>

                    <p className="text-text-secondary text-xs leading-relaxed line-clamp-2 overflow-hidden">
                      {plugin.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-3 border-t border-border">
                      <button
                        onClick={() => reviewPlugin(plugin.slug, "APPROVED")}
                        className="flex-1 flex justify-center items-center gap-1.5 p-2.5 rounded-md text-sm font-semibold bg-success text-white border-none cursor-pointer hover:bg-success/90 transition-colors"
                      >
                        <CheckCircle size={16} /> Approve Plugin
                      </button>
                      <button
                        onClick={() =>
                          setRejectModal({
                            slug: plugin.slug,
                            name: plugin.displayName,
                          })
                        }
                        className="flex-1 flex justify-center items-center gap-1.5 p-2.5 rounded-md text-sm font-semibold bg-error/10 text-error border border-error/20 cursor-pointer hover:bg-error/20 transition-colors"
                      >
                        <XCircle size={16} /> Reject Plugin
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      <Link
                        href={`/plugins/${plugin.slug}`}
                        className="text-xs text-brand hover:underline text-center"
                      >
                        View Plugin →
                      </Link>
                      {plugin.repoUrl && plugin.versions?.[0]?.fileHash && (
                        <a
                          href={`${plugin.repoUrl}/commit/${plugin.versions[0].fileHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-text-muted hover:text-text-primary text-center"
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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50 p-4"
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
              >
                <div
                  className="card w-full max-w-lg p-0 overflow-hidden border-t-4 border-t-error shadow-xl animate-in fade-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-text-primary m-0 mb-1">
                      Reject Plugin
                    </h3>
                    <p className="text-text-muted text-sm m-0 mb-5">
                      Rejecting{" "}
                      <strong className="font-semibold text-text-primary">
                        {rejectModal.name}
                      </strong>
                      . The author will be notified via email with your reason.
                    </p>

                    <label className="block text-[13px] font-semibold text-text-secondary mb-2">
                      Reason for Rejection *
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder={
                          "Explain why this plugin is being rejected...\n\nExample:\nA1 — Complete and serve a purpose:\n> The plugin must be complete and serve a purpose.\n\nThe readme is outdated. Please resolve these issues and submit the plugin again."
                        }
                        rows={8}
                        className="w-full p-3 rounded-md border border-border bg-surface-secondary text-text-primary text-sm leading-relaxed resize-y outline-none font-inherit min-h-[140px] focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                      />
                    </label>
                    <p className="text-text-muted text-xs mt-1">
                      Supports **bold** and {">"} blockquote formatting in the
                      email.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 justify-end">
                      <button
                        onClick={() => {
                          setRejectModal(null);
                          setRejectReason("");
                        }}
                        className="px-5 py-2.5 rounded-md text-sm font-medium bg-surface-secondary text-text-secondary border border-border cursor-pointer hover:bg-surface-secondary/80 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          rejectReason.trim() &&
                          reviewPlugin(
                            rejectModal.slug,
                            "REJECTED",
                            rejectReason.trim(),
                          )
                        }
                        disabled={!rejectReason.trim() || reviewLoading}
                        className="px-5 py-2.5 rounded-md text-sm font-semibold text-white border-none cursor-pointer flex items-center gap-1.5 bg-error hover:bg-error/90 disabled:bg-error/30 disabled:text-white/50 disabled:cursor-not-allowed transition-all"
                      >
                        {reviewLoading && (
                          <Loader2 size={14} className="animate-spin" />
                        )}
                        <XCircle size={14} /> Reject & Notify Author
                      </button>
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
            <div className="card w-full max-w-full overflow-hidden p-4 lg:p-6">
              {/* Search + Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search plugins by name or slug..."
                    className="w-full pl-10 pr-3 py-2 rounded-md border border-border bg-surface-card text-text-primary text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    value={pluginSearch}
                    onChange={(e) => setPluginSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadData()}
                  />
                </div>
                <button onClick={loadData} className="btn btn-secondary">
                  Search
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-1.5 mb-5 items-center">
                <Filter size={14} className="mr-1 text-text-muted" />
                {PLUGIN_STATUSES.map((s) => {
                  const isActive = pluginStatusFilter === s;
                  const count =
                    s === "ALL"
                      ? plugins.length
                      : plugins.filter((p) => p.status === s).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setPluginStatusFilter(s)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all flex items-center gap-1.5 ${
                        isActive
                          ? getStatusBadgeClass(s)
                          : "border-border bg-transparent text-text-muted hover:text-text-primary"
                      }`}
                    >
                      {s === "ALL" ? "All" : s.replace("_", " ")}
                      <span
                        className={`px-1.5 rounded-full text-[11px] min-w-[20px] text-center ${
                          isActive
                            ? "bg-white/15 dark:bg-white/10"
                            : "bg-surface-secondary text-text-muted"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border text-left">
                        {["Plugin", "Author", "Status", "Actions"].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-text-muted text-[13px] font-semibold"
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
                              borderRadius="var(--radius-sm)"
                            />
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Skeleton
                                width="2rem"
                                height="2rem"
                                borderRadius="var(--radius-sm)"
                              />
                              <Skeleton
                                width="2rem"
                                height="2rem"
                                borderRadius="var(--radius-sm)"
                              />
                              <Skeleton
                                width="2.5rem"
                                height="2rem"
                                borderRadius="var(--radius-sm)"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-4 py-3 text-text-muted text-[13px] font-semibold">
                        Plugin
                      </th>
                      <th className="px-4 py-3 text-text-muted text-[13px] font-semibold">
                        Author
                      </th>
                      <th className="px-4 py-3 text-text-muted text-[13px] font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-3 text-text-muted text-[13px] font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((plugin: any) => {
                      return (
                        <React.Fragment key={plugin.id}>
                          <tr className="border-b border-border hover:bg-surface-secondary/20 transition-colors">
                            <td className="p-4 text-sm">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="font-semibold text-text-primary truncate max-w-[200px]">
                                  {plugin.displayName}
                                </div>
                                <div className="text-xs text-text-muted font-mono truncate max-w-[150px]">
                                  {plugin.slug}
                                </div>
                                {plugin.versions &&
                                  plugin.versions.length > 0 && (
                                    <button
                                      onClick={() =>
                                        togglePluginExpanded(plugin.id)
                                      }
                                      className={`flex items-center gap-1 px-2 py-0.5 rounded-sm border border-border hover:bg-surface-secondary text-xs text-text-muted font-semibold transition-colors cursor-pointer ${
                                        expandedPlugins.has(plugin.id)
                                          ? "bg-surface-secondary"
                                          : "bg-transparent"
                                      }`}
                                    >
                                      {expandedPlugins.has(plugin.id) ? (
                                        <ChevronDown size={14} />
                                      ) : (
                                        <ChevronRight size={14} />
                                      )}
                                      Releases ({plugin.versions.length})
                                    </button>
                                  )}
                              </div>
                            </td>
                            <td className="p-4 text-sm text-text-secondary">
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
                                className={`px-2 py-1 rounded-sm text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand ${getStatusBadgeClass(
                                  plugin.status,
                                )}`}
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
                                {/* Quick reject button — only shown for approved plugins */}
                                {plugin.status === "APPROVED" && (
                                  <button
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
                                    className="flex items-center justify-center gap-1 px-2.5 h-8 rounded-sm border border-error/30 bg-error/10 text-error hover:bg-error/20 transition-all text-[11px] font-semibold cursor-pointer"
                                  >
                                    <ShieldAlert size={14} /> Reject
                                  </button>
                                )}
                                <button
                                  onClick={() => toggleFeatured(plugin.id)}
                                  title={
                                    plugin.isFeatured
                                      ? "Remove Featured"
                                      : "Mark as Featured"
                                  }
                                  className={`flex items-center justify-center w-8 h-8 rounded-sm border cursor-pointer transition-all ${
                                    plugin.isFeatured
                                      ? "border-amber-400 bg-amber-400/15 hover:bg-amber-400/25"
                                      : "border-border bg-surface-secondary text-text-muted hover:bg-surface-secondary/80"
                                  }`}
                                >
                                  <Star
                                    size={16}
                                    className={
                                      plugin.isFeatured
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-text-muted"
                                    }
                                  />
                                </button>
                                <a
                                  href={`/plugins/${plugin.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-secondary px-2.5 py-1 text-xs"
                                >
                                  View
                                </a>
                              </div>
                            </td>
                          </tr>
                          {expandedPlugins.has(plugin.id) &&
                            plugin.versions &&
                            plugin.versions.length > 0 && (
                              <tr className="border-b border-border bg-surface-secondary/10">
                                <td colSpan={4} className="p-3 px-4 pl-8">
                                  <div className="grid gap-1.5">
                                    {plugin.versions.map((v: any) => {
                                      return (
                                        <div
                                          key={v.id}
                                          className={`flex flex-wrap items-center gap-2.5 px-2.5 py-1.5 rounded-sm border ${getVersionRowClass(
                                            v.status,
                                          )}`}
                                        >
                                          <span className="text-[13px] font-bold text-text-primary min-w-[56px]">
                                            v{v.version}
                                          </span>
                                          <span
                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadgeClass(v.status)}`}
                                          >
                                            {v.status}
                                          </span>
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
                                            className="px-1.5 py-0.5 rounded-sm bg-surface-secondary border border-border text-text-primary text-[11px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand ml-auto"
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
                          className="p-8 text-center text-text-muted"
                        >
                          {pluginStatusFilter !== "ALL"
                            ? `No ${pluginStatusFilter.replace("_", " ").toLowerCase()} plugins found`
                            : "No plugins found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          );
        })()}

      {/* Plugin/Version Rejection Reason Modal */}
      {pluginRejectModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50 p-4"
          onClick={() => {
            setPluginRejectModal(null);
            setPluginRejectReason("");
          }}
        >
          <div
            className={`card w-full max-w-lg p-0 overflow-hidden border-t-4 shadow-xl animate-in fade-in zoom-in-95 duration-200 ${
              pluginRejectModal.targetStatus === "SUSPENDED"
                ? "border-t-red-400"
                : pluginRejectModal.targetStatus === "FLAGGED"
                  ? "border-t-orange-400"
                  : "border-t-error"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-1">
                <ShieldAlert
                  size={22}
                  className={
                    pluginRejectModal.targetStatus === "FLAGGED"
                      ? "text-orange-400"
                      : "text-error"
                  }
                />
                <h3 className="text-lg font-bold text-text-primary m-0">
                  {pluginRejectModal.targetStatus === "SUSPENDED"
                    ? "Suspend"
                    : pluginRejectModal.targetStatus === "FLAGGED"
                      ? "Flag"
                      : "Reject"}{" "}
                  {pluginRejectModal.type === "version" ? "Version" : "Plugin"}
                </h3>
              </div>
              <p className="text-text-muted text-sm my-2 mb-4">
                Changing{" "}
                <strong className="font-semibold text-text-primary">
                  {pluginRejectModal.name}
                </strong>{" "}
                from{" "}
                <span className="font-semibold text-text-primary">
                  {pluginRejectModal.currentStatus}
                </span>
                {" → "}
                <span
                  className={`font-semibold ${
                    pluginRejectModal.targetStatus === "SUSPENDED"
                      ? "text-red-500 dark:text-red-400"
                      : pluginRejectModal.targetStatus === "FLAGGED"
                        ? "text-orange-500 dark:text-orange-400"
                        : "text-error"
                  }`}
                >
                  {pluginRejectModal.targetStatus}
                </span>
                .
                {pluginRejectModal.currentStatus === "APPROVED" && (
                  <span className="block mt-2 px-3 py-2 bg-warning/10 rounded-sm border-l-3 border-l-warning text-[13px] text-text-secondary">
                    <AlertTriangle
                      size={12}
                      className="inline-block align-middle mr-1"
                    />
                    This plugin/version is currently{" "}
                    <strong>live and approved</strong>. This action will remove
                    it from public availability.
                  </span>
                )}
              </p>

              <label className="block text-[13px] font-semibold text-text-secondary mb-2">
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
                className="w-full p-3 rounded-md border border-border bg-surface-secondary text-text-primary text-sm leading-relaxed resize-y outline-none font-inherit min-h-[120px] focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              />

              <div className="flex flex-wrap gap-3 mt-5 justify-end">
                <button
                  onClick={() => {
                    setPluginRejectModal(null);
                    setPluginRejectReason("");
                  }}
                  className="px-5 py-2.5 rounded-md text-sm font-medium bg-surface-secondary text-text-secondary border border-border cursor-pointer hover:bg-surface-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPluginReject}
                  disabled={!pluginRejectReason.trim() || pluginRejectLoading}
                  className={`px-5 py-2.5 rounded-md text-sm font-semibold text-white border-none cursor-pointer flex items-center gap-1.5 transition-all ${
                    pluginRejectReason.trim()
                      ? pluginRejectModal.targetStatus === "SUSPENDED"
                        ? "bg-red-500 hover:bg-red-600"
                        : pluginRejectModal.targetStatus === "FLAGGED"
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-error hover:bg-error/90"
                      : "bg-error/30 text-white/50 cursor-not-allowed"
                  }`}
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
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {tab === "system" &&
        (loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <SkeletonCard key={i} className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton
                    width={40}
                    height={40}
                    borderRadius="var(--radius-md)"
                  />
                  <Skeleton width="5rem" height="0.8125rem" />
                </div>
                <Skeleton width="4rem" height="2rem" />
              </SkeletonCard>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Total Users",
                value: stats.users,
                icon: <Users size={20} className="text-purple-500" />,
                bg: "bg-purple-500/10",
              },
              {
                label: "Total Plugins",
                value: stats.plugins,
                icon: <Package size={20} className="text-brand" />,
                bg: "bg-brand/10",
              },
              {
                label: "Total Builds",
                value: stats.builds,
                icon: <Activity size={20} className="text-success" />,
                bg: "bg-success/10",
              },
              {
                label: "Pending Reviews",
                value: stats.pendingReviews,
                icon: <AlertTriangle size={20} className="text-warning" />,
                bg: "bg-warning/10",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="card p-6 grid bg-surface-card border border-border rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-md grid place-items-center flex-shrink-0 ${s.bg}`}
                  >
                    {s.icon}
                  </div>
                  <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                    {s.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-text-primary">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

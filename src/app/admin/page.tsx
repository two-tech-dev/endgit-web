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
  const [expandedPlugins, setExpandedPlugins] = useState<Set<string>>(new Set());

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
      <div
        className="container"
        style={{
          paddingTop: "var(--space-16)",
          paddingBottom: "var(--space-16)",
          textAlign: "center",
        }}
      >
        <Loader2
          size={32}
          color="#8b5cf6"
          style={{ animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div
        className="container"
        style={{
          paddingTop: "var(--space-16)",
          paddingBottom: "var(--space-16)",
          textAlign: "center",
        }}
      >
        <Shield
          size={48}
          color="#8b5cf6"
          style={{ margin: "0 auto var(--space-4)" }}
        />
        <h2 className="heading-3">Admin Access Required</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "var(--space-2)" }}>
          Please sign in with an admin account.
        </p>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-8)",
        paddingBottom: "var(--space-8)",
        maxWidth: "1100px",
      }}
    >
      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1
          className="heading-2"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <Shield size={28} color="#8b5cf6" /> Admin Panel
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
          Manage users, review queue, and system settings
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          background: "var(--bg-secondary)",
          padding: "3px",
          borderRadius: "var(--radius-md)",
          marginBottom: "var(--space-6)",
          width: "fit-content",
        }}
      >
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              background: tab === t.key ? "var(--bg-card)" : "transparent",
              color:
                tab === t.key ? "var(--text-primary)" : "var(--text-muted)",
              boxShadow: tab === t.key ? "var(--shadow-sm)" : "none",
              transition: "all 150ms",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          className="card"
          style={{
            padding: "var(--space-5)",
            marginBottom: "var(--space-4)",
            borderLeft: "4px solid var(--status-error)",
          }}
        >
          <p style={{ color: "var(--status-error)", fontSize: "0.875rem" }}>
            {error}
          </p>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div>
          <div style={{ marginBottom: "var(--space-4)", position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
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
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "0.625rem 0.75rem 0.625rem 2.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>

          {loading ? (
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: "var(--bg-secondary)",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
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
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.6875rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }, (_, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-3)",
                          }}
                        >
                          <Skeleton circle width={32} height={32} />
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
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <Skeleton
                          width="4rem"
                          height="1.25rem"
                          borderRadius="var(--radius-full)"
                        />
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <Skeleton width="3.5rem" height="0.875rem" />
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <Skeleton width="1.5rem" height="0.875rem" />
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <Skeleton width="5rem" height="0.8125rem" />
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
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
            <div
              className="card"
              style={{ padding: "var(--space-12)", textAlign: "center" }}
            >
              <p style={{ color: "var(--text-muted)" }}>No users found</p>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: "var(--bg-secondary)",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
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
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.6875rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                        }}
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
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, var(--accent-primary), var(--accent-primary))",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              overflow: "hidden",
                            }}
                          >
                            {user.avatarUrl ? (
                              <Image
                                src={user.avatarUrl}
                                alt=""
                                width={32}
                                height={32}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              user.username.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div
                              style={{ fontWeight: 600, fontSize: "0.875rem" }}
                            >
                              {user.displayName || user.username}
                            </div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--text-muted)",
                              }}
                            >
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            ...(TRUST_COLORS[user.trustLevel] ||
                              TRUST_COLORS.NEW),
                          }}
                        >
                          {user.trustLevel}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              color:
                                user.weeklyBuildCount >= user.weeklyBuildQuota
                                  ? "var(--status-error)"
                                  : "var(--text-secondary)",
                            }}
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
                            style={{
                              width: "60px",
                              padding: "2px 6px",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--border-color)",
                              background: "var(--bg-secondary)",
                              color: "var(--text-primary)",
                              fontSize: "0.75rem",
                              textAlign: "center",
                            }}
                          />
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {user._count?.plugins || 0}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "0.8125rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <select
                          value={user.trustLevel}
                          onChange={(e) =>
                            changeTrustLevel(user.id, e.target.value)
                          }
                          style={{
                            padding: "4px 8px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border-color)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-primary)",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                          }}
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
          )}
        </div>
      )}

      {/* Review Queue Tab — shows pending PLUGINS */}
      {tab === "queue" &&
        (loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonCard
                key={i}
                style={{
                  padding: 0,
                  borderTop: "4px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    padding: "var(--space-5)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-3)",
                        alignItems: "center",
                      }}
                    >
                      <Skeleton
                        width={48}
                        height={48}
                        borderRadius="var(--radius-md)"
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
                      borderRadius="var(--radius-full)"
                    />
                  </div>
                  <SkeletonText lines={2} />
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-2)",
                      marginTop: "var(--space-2)",
                      paddingTop: "var(--space-3)",
                      borderTop: "1px solid var(--border-color)",
                    }}
                  >
                    <Skeleton
                      width="100%"
                      height="2.25rem"
                      borderRadius="var(--radius-md)"
                    />
                    <Skeleton
                      width="100%"
                      height="2.25rem"
                      borderRadius="var(--radius-md)"
                    />
                  </div>
                </div>
              </SkeletonCard>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {queue.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: "var(--space-12)",
                  textAlign: "center",
                  gridColumn: "1 / -1",
                }}
              >
                <CheckCircle
                  size={40}
                  color="var(--status-success)"
                  style={{ margin: "0 auto var(--space-3)" }}
                />
                <p style={{ fontWeight: 600 }}>All caught up!</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  No plugins pending review
                </p>
              </div>
            ) : (
              queue.map((plugin: any) => (
                <div
                  key={plugin.id}
                  className="card"
                  style={{
                    padding: "0",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderTop: "4px solid var(--status-warning)",
                  }}
                >
                  <div
                    style={{
                      padding: "var(--space-5)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-3)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-3)",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "var(--radius-md)",
                            background: "var(--bg-secondary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid var(--border-color)",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          <PluginImage
                            iconUrl={plugin.iconUrl}
                            repoUrl={plugin.repoUrl}
                            alt={`${plugin.displayName} icon`}
                          />
                        </div>
                        <div>
                          <h3
                            className="heading-3"
                            style={{
                              fontSize: "1.125rem",
                              margin: 0,
                              color: "var(--text-primary)",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {plugin.displayName}
                            {plugin.versions?.[0]?.isPreRelease && (
                              <span
                                title="This is a pre-release"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  color: "#ef4444",
                                }}
                              >
                                <FlaskConical size={16} />
                              </span>
                            )}
                          </h3>
                          <p
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.8125rem",
                            }}
                          >
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

                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.8125rem",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {plugin.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        marginTop: "var(--space-2)",
                        paddingTop: "var(--space-3)",
                        borderTop: "1px solid var(--border-color)",
                      }}
                    >
                      <button
                        onClick={() => reviewPlugin(plugin.slug, "APPROVED")}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "0.5rem",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          background: "var(--status-success)",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
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
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "0.5rem",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          background: "rgba(239,68,68,0.1)",
                          color: "var(--status-error)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          cursor: "pointer",
                        }}
                      >
                        <XCircle size={16} /> Reject Plugin
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        href={`/plugins/${plugin.slug}`}
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--accent-primary)",
                          textAlign: "center",
                        }}
                      >
                        View Plugin →
                      </Link>
                      {plugin.repoUrl && plugin.versions?.[0]?.fileHash && (
                        <a
                          href={`${plugin.repoUrl}/commit/${plugin.versions[0].fileHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            textAlign: "center",
                          }}
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
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                  padding: "var(--space-4)",
                }}
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
              >
                <div
                  className="card"
                  style={{
                    width: "100%",
                    maxWidth: "560px",
                    padding: "0",
                    overflow: "hidden",
                    borderTop: "4px solid var(--status-error)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ padding: "var(--space-6)" }}>
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        margin: "0 0 var(--space-1)",
                      }}
                    >
                      Reject Plugin
                    </h3>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                        margin: "0 0 var(--space-5)",
                      }}
                    >
                      Rejecting{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        {rejectModal.name}
                      </strong>
                      . The author will be notified via email with your reason.
                    </p>

                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      Reason for Rejection *
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder={
                          "Explain why this plugin is being rejected...\n\nExample:\nA1 — Complete and serve a purpose:\n> The plugin must be complete and serve a purpose.\n\nThe readme is outdated. Please resolve these issues and submit the plugin again."
                        }
                        rows={8}
                        style={{
                          width: "100%",
                          padding: "var(--space-3)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-color)",
                          background: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          resize: "vertical",
                          outline: "none",
                          fontFamily: "inherit",
                          minHeight: "140px",
                        }}
                      />
                    </label>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        marginTop: "var(--space-1)",
                      }}
                    >
                      Supports **bold** and {">"} blockquote formatting in the
                      email.
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-3)",
                        marginTop: "var(--space-5)",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => {
                          setRejectModal(null);
                          setRejectReason("");
                        }}
                        style={{
                          padding: "0.625rem 1.25rem",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          background: "var(--bg-secondary)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-color)",
                          cursor: "pointer",
                        }}
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
                        style={{
                          padding: "0.625rem 1.25rem",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          background: rejectReason.trim()
                            ? "var(--status-error)"
                            : "rgba(239,68,68,0.3)",
                          color: "white",
                          border: "none",
                          cursor: rejectReason.trim()
                            ? "pointer"
                            : "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          opacity: reviewLoading ? 0.7 : 1,
                        }}
                      >
                        {reviewLoading && (
                          <Loader2
                            size={14}
                            style={{ animation: "spin 1s linear infinite" }}
                          />
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
            <div className="card" style={{ padding: "var(--space-6)" }}>
              {/* Search + Filter Bar */}
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-4)",
                  marginBottom: "var(--space-4)",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ flex: 1, position: "relative", minWidth: "240px" }}
                >
                  <Search
                    size={16}
                    color="var(--text-muted)"
                    style={{
                      position: "absolute",
                      left: "var(--space-3)",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search plugins by name or slug..."
                    className="input"
                    style={{ paddingLeft: "var(--space-10)" }}
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
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginBottom: "var(--space-5)",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Filter
                  size={14}
                  color="var(--text-muted)"
                  style={{ marginRight: "4px" }}
                />
                {PLUGIN_STATUSES.map((s) => {
                  const isActive = pluginStatusFilter === s;
                  const sc = s !== "ALL" ? STATUS_COLORS[s] : null;
                  const count =
                    s === "ALL"
                      ? plugins.length
                      : plugins.filter((p) => p.status === s).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setPluginStatusFilter(s)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        border: isActive
                          ? `1px solid ${sc?.border || "var(--border-highlight)"}`
                          : "1px solid var(--border-color)",
                        background: isActive
                          ? sc?.bg || "var(--bg-secondary)"
                          : "transparent",
                        color: isActive
                          ? sc?.color || "var(--text-primary)"
                          : "var(--text-muted)",
                        cursor: "pointer",
                        transition: "all 150ms",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {s === "ALL" ? "All" : s.replace("_", " ")}
                      <span
                        style={{
                          background: isActive
                            ? "rgba(255,255,255,0.15)"
                            : "var(--bg-secondary)",
                          padding: "0 6px",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.6875rem",
                          minWidth: "20px",
                          textAlign: "center",
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-color)",
                        textAlign: "left",
                      }}
                    >
                      {["Plugin", "Author", "Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "0 var(--space-4) var(--space-3)",
                            color: "var(--text-muted)",
                            fontSize: "0.8125rem",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }, (_, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px solid var(--border-color)",
                        }}
                      >
                        <td style={{ padding: "var(--space-4)" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--space-3)",
                            }}
                          >
                            <Skeleton width="8rem" height="0.875rem" />
                            <Skeleton width="4rem" height="0.75rem" />
                          </div>
                        </td>
                        <td style={{ padding: "var(--space-4)" }}>
                          <Skeleton width="6rem" height="0.875rem" />
                        </td>
                        <td style={{ padding: "var(--space-4)" }}>
                          <Skeleton
                            width="5rem"
                            height="1.5rem"
                            borderRadius="var(--radius-sm)"
                          />
                        </td>
                        <td
                          style={{
                            padding: "var(--space-4)",
                            textAlign: "right",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "var(--space-2)",
                              justifyContent: "flex-end",
                            }}
                          >
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
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-color)",
                        textAlign: "left",
                      }}
                    >
                      <th
                        style={{
                          padding: "0 var(--space-4) var(--space-3)",
                          color: "var(--text-muted)",
                          fontSize: "0.8125rem",
                        }}
                      >
                        Plugin
                      </th>
                      <th
                        style={{
                          padding: "0 var(--space-4) var(--space-3)",
                          color: "var(--text-muted)",
                          fontSize: "0.8125rem",
                        }}
                      >
                        Author
                      </th>
                      <th
                        style={{
                          padding: "0 var(--space-4) var(--space-3)",
                          color: "var(--text-muted)",
                          fontSize: "0.8125rem",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: "0 var(--space-4) var(--space-3)",
                          color: "var(--text-muted)",
                          fontSize: "0.8125rem",
                          textAlign: "right",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((plugin: any) => {
                      const psc =
                        STATUS_COLORS[plugin.status] || STATUS_COLORS.DRAFT;
                      return (
                        <React.Fragment key={plugin.id}>
                          <tr
                            style={{
                              borderBottom: "1px solid var(--border-color)",
                            }}
                          >
                            <td style={{ padding: "var(--space-4)" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "var(--space-3)",
                                }}
                              >
                                <div style={{ fontWeight: 600 }}>
                                  {plugin.displayName}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "var(--text-muted)",
                                    fontFamily: "var(--font-mono)",
                                  }}
                                >
                                  {plugin.slug}
                                </div>
                                {plugin.versions && plugin.versions.length > 0 && (
                                  <button
                                    onClick={() => togglePluginExpanded(plugin.id)}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      padding: "2px 8px",
                                      borderRadius: "var(--radius-sm)",
                                      border: "1px solid var(--border-color)",
                                      background: expandedPlugins.has(plugin.id)
                                        ? "var(--bg-secondary)"
                                        : "transparent",
                                      cursor: "pointer",
                                      fontSize: "0.75rem",
                                      color: "var(--text-muted)",
                                      fontWeight: 600,
                                      transition: "all 150ms",
                                    }}
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
                            <td
                              style={{
                                padding: "var(--space-4)",
                                fontSize: "0.875rem",
                              }}
                            >
                              {plugin.author?.displayName ||
                                plugin.author?.username}
                            </td>
                            <td style={{ padding: "var(--space-4)" }}>
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
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "var(--radius-sm)",
                                  background: psc.bg,
                                  border: `1px solid ${psc.border}`,
                                  color: psc.color,
                                  fontSize: "0.8125rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
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
                            <td
                              style={{
                                padding: "var(--space-4)",
                                textAlign: "right",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "var(--space-2)",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                }}
                              >
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
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: "4px",
                                      height: "32px",
                                      padding: "0 10px",
                                      borderRadius: "var(--radius-sm)",
                                      border: "1px solid rgba(239,68,68,0.3)",
                                      background: "rgba(239,68,68,0.08)",
                                      color: "var(--status-error)",
                                      cursor: "pointer",
                                      transition: "all 150ms",
                                      fontSize: "0.6875rem",
                                      fontWeight: 600,
                                    }}
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
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "var(--radius-sm)",
                                    border: plugin.isFeatured
                                      ? "1px solid #fbbf24"
                                      : "1px solid var(--border-color)",
                                    background: plugin.isFeatured
                                      ? "rgba(251, 191, 36, 0.15)"
                                      : "var(--bg-secondary)",
                                    cursor: "pointer",
                                    transition: "all 150ms",
                                  }}
                                >
                                  <Star
                                    size={16}
                                    color={
                                      plugin.isFeatured
                                        ? "#fbbf24"
                                        : "var(--text-muted)"
                                    }
                                    fill={
                                      plugin.isFeatured ? "#fbbf24" : "none"
                                    }
                                  />
                                </button>
                                <a
                                  href={`/plugins/${plugin.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-secondary"
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  View
                                </a>
                              </div>
                            </td>
                          </tr>
                          {expandedPlugins.has(plugin.id) &&
                            plugin.versions &&
                            plugin.versions.length > 0 && (
                              <tr
                                style={{
                                  borderBottom: "1px solid var(--border-color)",
                                  background: "rgba(0,0,0,0.02)",
                                }}
                              >
                                <td
                                  colSpan={4}
                                  style={{
                                    padding:
                                      "var(--space-3) var(--space-4) var(--space-4) var(--space-8)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "6px",
                                    }}
                                  >
                                    {plugin.versions.map((v: any) => {
                                      const vsc =
                                        STATUS_COLORS[v.status] ||
                                        STATUS_COLORS.DRAFT;
                                      return (
                                        <div
                                          key={v.id}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "6px 10px",
                                            borderRadius: "var(--radius-sm)",
                                            border: `1px solid ${vsc.border}`,
                                            background: "var(--bg-card)",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "0.8125rem",
                                              fontWeight: 700,
                                              color: "var(--text-primary)",
                                              minWidth: "56px",
                                            }}
                                          >
                                            v{v.version}
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "0.6875rem",
                                              fontWeight: 700,
                                              padding: "2px 8px",
                                              borderRadius: "var(--radius-full)",
                                              background: vsc.bg,
                                              color: vsc.color,
                                              textTransform: "uppercase",
                                              letterSpacing: "0.03em",
                                            }}
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
                                            style={{
                                              padding: "2px 6px",
                                              borderRadius: "4px",
                                              background: "var(--bg-secondary)",
                                              border:
                                                "1px solid var(--border-color)",
                                              color: "var(--text-primary)",
                                              fontSize: "0.6875rem",
                                              cursor: "pointer",
                                              marginLeft: "auto",
                                            }}
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
                          style={{
                            padding: "var(--space-8)",
                            textAlign: "center",
                            color: "var(--text-muted)",
                          }}
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
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "var(--space-4)",
          }}
          onClick={() => {
            setPluginRejectModal(null);
            setPluginRejectReason("");
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "560px",
              padding: "0",
              overflow: "hidden",
              borderTop: `4px solid ${pluginRejectModal.targetStatus === "SUSPENDED" ? "#f87171" : pluginRejectModal.targetStatus === "FLAGGED" ? "#fb923c" : "var(--status-error)"}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "var(--space-6)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-1)",
                }}
              >
                <ShieldAlert
                  size={22}
                  color={
                    pluginRejectModal.targetStatus === "FLAGGED"
                      ? "#fb923c"
                      : "var(--status-error)"
                  }
                />
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  {pluginRejectModal.targetStatus === "SUSPENDED"
                    ? "Suspend"
                    : pluginRejectModal.targetStatus === "FLAGGED"
                      ? "Flag"
                      : "Reject"}{" "}
                  {pluginRejectModal.type === "version" ? "Version" : "Plugin"}
                </h3>
              </div>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                  margin: "var(--space-2) 0 var(--space-4)",
                }}
              >
                Changing{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {pluginRejectModal.name}
                </strong>{" "}
                from{" "}
                <span
                  style={{
                    fontWeight: 600,
                    color:
                      STATUS_COLORS[pluginRejectModal.currentStatus]?.color ||
                      "var(--text-primary)",
                  }}
                >
                  {pluginRejectModal.currentStatus}
                </span>
                {" → "}
                <span
                  style={{
                    fontWeight: 600,
                    color:
                      STATUS_COLORS[pluginRejectModal.targetStatus]?.color ||
                      "var(--status-error)",
                  }}
                >
                  {pluginRejectModal.targetStatus}
                </span>
                .
                {pluginRejectModal.currentStatus === "APPROVED" && (
                  <span
                    style={{
                      display: "block",
                      marginTop: "var(--space-2)",
                      padding: "var(--space-2) var(--space-3)",
                      background: "rgba(245,158,11,0.08)",
                      borderRadius: "var(--radius-sm)",
                      borderLeft: "3px solid var(--status-warning)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <AlertTriangle
                      size={12}
                      style={{
                        display: "inline",
                        verticalAlign: "middle",
                        marginRight: "4px",
                      }}
                    />
                    This plugin/version is currently{" "}
                    <strong>live and approved</strong>. This action will remove
                    it from public availability.
                  </span>
                )}
              </p>

              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-2)",
                }}
              >
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
                style={{
                  width: "100%",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  fontFamily: "inherit",
                  minHeight: "120px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  marginTop: "var(--space-5)",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => {
                    setPluginRejectModal(null);
                    setPluginRejectReason("");
                  }}
                  style={{
                    padding: "0.625rem 1.25rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPluginReject}
                  disabled={!pluginRejectReason.trim() || pluginRejectLoading}
                  style={{
                    padding: "0.625rem 1.25rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    background: pluginRejectReason.trim()
                      ? STATUS_COLORS[pluginRejectModal.targetStatus]?.color ||
                        "var(--status-error)"
                      : "rgba(239,68,68,0.3)",
                    color: "white",
                    border: "none",
                    cursor: pluginRejectReason.trim()
                      ? "pointer"
                      : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    opacity: pluginRejectLoading ? 0.7 : 1,
                  }}
                >
                  {pluginRejectLoading && (
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "var(--space-4)",
            }}
          >
            {Array.from({ length: 4 }, (_, i) => (
              <SkeletonCard key={i} style={{ padding: "var(--space-6)" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                  }}
                >
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "var(--space-4)",
            }}
          >
            {[
              {
                label: "Total Users",
                value: stats.users,
                icon: <Users size={20} color="var(--accent-primary)" />,
                bg: "rgba(139,92,246,0.08)",
              },
              {
                label: "Total Plugins",
                value: stats.plugins,
                icon: <Package size={20} color="var(--accent-primary)" />,
                bg: "rgba(14,165,233,0.08)",
              },
              {
                label: "Total Builds",
                value: stats.builds,
                icon: <Activity size={20} color="var(--status-success)" />,
                bg: "rgba(16,185,129,0.08)",
              },
              {
                label: "Pending Reviews",
                value: stats.pendingReviews,
                icon: <AlertTriangle size={20} color="var(--status-warning)" />,
                bg: "rgba(245,158,11,0.08)",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="card"
                style={{ padding: "var(--space-6)" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--radius-md)",
                      background: s.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

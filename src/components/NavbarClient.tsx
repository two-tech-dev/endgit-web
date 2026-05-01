"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { User, LogIn, ChevronDown, LogOut, LayoutDashboard, Package, Shield, Search, Trophy } from "lucide-react";
import { useState } from "react";

export default function NavbarClient() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Loading state
  if (status === "loading") {
    return (
      <div style={{ width: "100px", height: "36px", borderRadius: "var(--radius-full)", background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
    );
  }

  // Not signed in
  if (!session) {
    return (
      <button onClick={() => signIn("github")} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
        <LogIn size={16} /> Sign In
      </button>
    );
  }

  const user = session.user;
  const initials = user?.name?.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.375rem 0.75rem", borderRadius: "var(--radius-full)",
          border: "1px solid #27272a", background: "#121212",
          cursor: "pointer", transition: "all 150ms"
        }}
      >
        {user?.image ? (
          <img src={user.image} alt="" style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "0.75rem", fontWeight: 700
          }}>
            {initials}
          </div>
        )}
        <span style={{ fontWeight: 500, fontSize: "0.875rem", color: "#f8fafc", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.name || user?.email}
        </span>
        <ChevronDown size={14} color="#94a3b8" style={{ transition: "transform 200ms", transform: dropdownOpen ? "rotate(180deg)" : "none" }} />
      </button>

      {dropdownOpen && (
        <>
          {/* Backdrop */}
          <div onClick={() => setDropdownOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />

          {/* Dropdown Menu */}
          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 50,
            width: "220px", background: "var(--bg-card)", border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
            overflow: "hidden"
          }}>
            {/* User info header */}
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-color)", background: "var(--bg-secondary)" }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{user?.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user?.email}</div>
            </div>

            {/* Menu items */}
            <div style={{ padding: "0.375rem" }}>
              <a href="/dashboard/dev" onClick={() => setDropdownOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-sm)", fontSize: "0.875rem", color: "var(--text-secondary)",
                transition: "background 100ms"
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <LayoutDashboard size={16} /> Dev Dashboard
              </a>
              <a href="/dashboard" onClick={() => setDropdownOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-sm)", fontSize: "0.875rem", color: "var(--text-secondary)",
                transition: "background 100ms"
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <Package size={16} /> My Plugins
              </a>
              {(session?.user as any)?.trustLevel === "ADMIN" || (session?.user as any)?.trustLevel === "TRUSTED" ? (
                <a href="/admin" onClick={() => setDropdownOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)", fontSize: "0.875rem", color: "#8b5cf6",
                  transition: "background 100ms"
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(139,92,246,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Shield size={16} /> Admin Panel
                </a>
              ) : null}
            </div>

            {/* Logout */}
            <div style={{ padding: "0.375rem", borderTop: "1px solid var(--border-color)" }}>
              <button onClick={() => { signOut(); setDropdownOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-sm)", fontSize: "0.875rem", color: "var(--status-error)",
                width: "100%", textAlign: "left", transition: "background 100ms"
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

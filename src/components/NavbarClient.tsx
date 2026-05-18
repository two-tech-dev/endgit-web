"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import {
  LogIn,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  Shield,
} from "lucide-react";
import { useState } from "react";

export default function NavbarClient({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (status === "loading") {
    return (
      <div
        style={{
          width: mobile ? "100%" : "100px",
          height: "36px",
          borderRadius: mobile ? "var(--radius-md)" : "var(--radius-full)",
          background: "var(--bg-secondary)",
          animation: "pulse 1.5s infinite",
        }}
      />
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("github")}
        className="btn btn-primary"
        style={{
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          width: mobile ? "100%" : undefined,
        }}
      >
        <LogIn size={16} /> Sign In
      </button>
    );
  }

  const user = session.user;
  const initials = user?.name?.charAt(0) || user?.email?.charAt(0) || "U";

  const userAvatar = user?.image ? (
    <img
      src={user.image}
      alt=""
      style={{
        width: mobile ? "32px" : "28px",
        height: mobile ? "32px" : "28px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      style={{
        width: mobile ? "32px" : "28px",
        height: mobile ? "32px" : "28px",
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "0.75rem",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );

  const menuItems = (
    <>
      <a
        href="/dashboard/dev"
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: mobile ? "0.625rem 0.75rem" : "0.5rem 0.75rem",
          borderRadius: "var(--radius-sm)",
          fontSize: mobile ? "0.9375rem" : "0.875rem",
          color: "var(--text-secondary)",
          transition: "background 100ms",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--bg-secondary)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <LayoutDashboard size={16} /> Dev Dashboard
      </a>
      <a
        href="/dashboard"
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: mobile ? "0.625rem 0.75rem" : "0.5rem 0.75rem",
          borderRadius: "var(--radius-sm)",
          fontSize: mobile ? "0.9375rem" : "0.875rem",
          color: "var(--text-secondary)",
          transition: "background 100ms",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--bg-secondary)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <Package size={16} /> My Plugins
      </a>
      {(session?.user as any)?.trustLevel === "ADMIN" ||
      (session?.user as any)?.trustLevel === "TRUSTED" ? (
        <a
          href="/admin"
          onClick={() => {
            setDropdownOpen(false);
            onNavigate?.();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: mobile ? "0.625rem 0.75rem" : "0.5rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            fontSize: mobile ? "0.9375rem" : "0.875rem",
            color: "#8b5cf6",
            transition: "background 100ms",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(139,92,246,0.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <Shield size={16} /> Admin Panel
        </a>
      ) : null}
    </>
  );

  const signOutButton = (
    <button
      onClick={() => {
        signOut();
        setDropdownOpen(false);
        onNavigate?.();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: mobile ? "0.625rem 0.75rem" : "0.5rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        fontSize: mobile ? "0.9375rem" : "0.875rem",
        color: "var(--status-error)",
        width: "100%",
        textAlign: "left",
        transition: "background 100ms",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <LogOut size={16} /> Sign Out
    </button>
  );

  if (mobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-1)",
        }}
      >
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.75rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: dropdownOpen ? "var(--bg-secondary)" : "transparent",
            cursor: "pointer",
            transition: "all 150ms",
            width: "100%",
          }}
        >
          {userAvatar}
          <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name || user?.email}
            </div>
            {user?.email && user?.name && (
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {user.email}
              </div>
            )}
          </div>
          <ChevronDown
            size={16}
            color="#94a3b8"
            style={{
              transition: "transform 200ms",
              transform: dropdownOpen ? "rotate(180deg)" : "none",
              flexShrink: 0,
            }}
          />
        </button>

        {dropdownOpen && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
              padding: "0 0.25rem",
            }}
          >
            {menuItems}
            <div
              style={{
                borderTop: "1px solid var(--border-color)",
                margin: "0.25rem 0",
              }}
            />
            {signOutButton}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.375rem 0.75rem",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-color)",
          background: "var(--bg-card)",
          cursor: "pointer",
          transition: "all 150ms",
        }}
      >
        {userAvatar}
        <span
          style={{
            fontWeight: 500,
            fontSize: "0.875rem",
            color: "var(--text-primary)",
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.name || user?.email}
        </span>
        <ChevronDown
          size={14}
          color="#94a3b8"
          style={{
            transition: "transform 200ms",
            transform: dropdownOpen ? "rotate(180deg)" : "none",
          }}
        />
      </button>

      {dropdownOpen && (
        <>
          <div
            onClick={() => setDropdownOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
          />

          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              zIndex: 50,
              width: "220px",
              maxWidth: "calc(100vw - 2rem)",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                borderBottom: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                }}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {user?.email}
              </div>
            </div>

            <div style={{ padding: "0.375rem" }}>{menuItems}</div>

            <div
              style={{
                padding: "0.375rem",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              {signOutButton}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

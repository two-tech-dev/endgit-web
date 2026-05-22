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
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
          width: mobile ? "100%" : "80px",
          height: mobile ? "36px" : "32px",
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
          padding: "0.375rem 0.75rem",
          fontSize: "0.8125rem",
          width: mobile ? "100%" : undefined,
          height: mobile ? undefined : "32px",
          borderRadius: "var(--radius-md)",
        }}
      >
        <LogIn size={14} /> Sign In
      </button>
    );
  }

  const user = session.user;
  const initials =
    (user?.name ?? "U")
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const userAvatar = user?.image ? (
    <Image
      src={user.image}
      alt=""
      width={mobile ? 28 : 24}
      height={mobile ? 28 : 24}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      style={{
        width: mobile ? "28px" : "24px",
        height: mobile ? "28px" : "24px",
        borderRadius: "50%",
        background: "rgba(0,95,90,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--accent-primary)",
        fontSize: "0.625rem",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );

  const menuItems = (
    <>
      <Link
        href="/dashboard/dev"
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: mobile ? "0.5rem 0.75rem" : "0.375rem 0.75rem",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8125rem",
          color: "var(--text-secondary)",
          transition: "background 100ms",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--bg-secondary)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <LayoutDashboard size={14} /> Dev Dashboard
      </Link>
      <Link
        href="/dashboard"
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: mobile ? "0.5rem 0.75rem" : "0.375rem 0.75rem",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8125rem",
          color: "var(--text-secondary)",
          transition: "background 100ms",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--bg-secondary)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <Package size={14} /> My Plugins
      </Link>
      {(session?.user as any)?.trustLevel === "ADMIN" ||
      (session?.user as any)?.trustLevel === "TRUSTED" ? (
        <Link
          href="/admin"
          onClick={() => {
            setDropdownOpen(false);
            onNavigate?.();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: mobile ? "0.5rem 0.75rem" : "0.375rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.8125rem",
            color: "var(--accent-primary)",
            transition: "background 100ms",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-brand-light)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <Shield size={14} /> Admin Panel
        </Link>
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
        padding: mobile ? "0.5rem 0.75rem" : "0.375rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.8125rem",
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
      <LogOut size={14} /> Sign Out
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
            gap: "0.625rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
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
                fontSize: "0.8125rem",
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name || user?.email}
            </div>
            {user?.email && user?.name && (
              <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                {user.email}
              </div>
            )}
          </div>
          <ChevronDown
            size={14}
            color="var(--text-muted)"
            style={{
              transition: "transform 200ms",
              transform: dropdownOpen ? "rotate(180deg)" : "none",
              flexShrink: 0,
            }}
          />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: "hidden" }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
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
          gap: "0.375rem",
          padding: "0.25rem 0.625rem 0.25rem 0.25rem",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-color)",
          background: "var(--bg-card)",
          cursor: "pointer",
          transition: "all 150ms",
          height: "32px",
        }}
      >
        {userAvatar}
        <span
          style={{
            fontWeight: 500,
            fontSize: "0.75rem",
            color: "var(--text-primary)",
            maxWidth: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.name || user?.email}
        </span>
        <ChevronDown
          size={12}
          color="var(--text-muted)"
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
              top: "calc(100% + 6px)",
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
                padding: "0.625rem 0.75rem",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--text-muted)",
                }}
              >
                Signed in as
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </div>
            </div>

            <div style={{ padding: "0.25rem" }}>{menuItems}</div>

            <div
              style={{
                padding: "0.25rem",
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
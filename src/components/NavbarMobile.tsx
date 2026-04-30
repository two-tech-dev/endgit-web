"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavbarClient from "./NavbarClient";
import ThemeToggle from "./ThemeToggle";

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Desktop nav */}
      <nav className="nav-links" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <a href="/plugins" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Plugins</a>
        <a href="/builds" style={{ color: "var(--text-secondary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--status-success)", display: "inline-block" }} />
          Live Builds
        </a>
        <a href="/docs" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Docs</a>
        <ThemeToggle />
        <NavbarClient />
      </nav>

      {/* Mobile hamburger button */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <div className="mobile-menu-btn" style={{ display: "none" }}>
          <ThemeToggle />
        </div>
        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          className="nav-links open"
          onClick={() => setOpen(false)}
        >
          <a href="/plugins" style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "1rem" }}>Plugins</a>
          <a href="/builds" style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--status-success)", display: "inline-block" }} />
            Live Builds
          </a>
          <a href="/docs" style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "1rem" }}>Docs</a>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-3)" }}>
            <NavbarClient />
          </div>
        </nav>
      )}
    </div>
  );
}

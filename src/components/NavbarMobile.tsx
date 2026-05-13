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
      <nav
        className="nav-links"
        style={{ display: "flex", gap: "2rem", alignItems: "center" }}
      >
        <a
          href="/plugins"
          style={{ color: "var(--text-secondary)", fontWeight: 500 }}
        >
          Releases
        </a>
        <a
          href="/plugins/top"
          style={{ color: "var(--text-secondary)", fontWeight: 500 }}
        >
          Top Plugins
        </a>
        <a
          href="/builds"
          style={{ color: "var(--text-secondary)", fontWeight: 500 }}
        >
          Dev Builds
        </a>
        <a
          href="/faq"
          style={{ color: "var(--text-secondary)", fontWeight: 500 }}
        >
          FAQ
        </a>
        <ThemeToggle />
        <NavbarClient />
      </nav>

      {/* Mobile hamburger button */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
      >
        <div className="mobile-menu-btn">
          <ThemeToggle />
        </div>
        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ color: "var(--text-primary)" }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="nav-links open" onClick={() => setOpen(false)}>
          <a
            href="/plugins"
            style={{
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Releases
          </a>
          <a
            href="/plugins/top"
            style={{
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Top Plugins
          </a>
          <a
            href="/builds"
            style={{
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Dev Builds
          </a>
          <a
            href="/faq"
            style={{
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            FAQ
          </a>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "var(--space-3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <NavbarClient />
          </div>
        </nav>
      )}
    </div>
  );
}

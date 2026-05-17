"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex" }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex" }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav-links open"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {[
              { href: "/plugins", label: "Releases" },
              { href: "/plugins/top", label: "Top Plugins" },
              { href: "/builds", label: "Dev Builds" },
              { href: "/faq", label: "FAQ" },
            ].map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                style={{
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "1rem",
                }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.05 + i * 0.05,
                  duration: 0.25,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.div
              style={{
                borderTop: "1px solid var(--border-color)",
                paddingTop: "var(--space-3)",
              }}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.2 }}
            >
              <NavbarClient />
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

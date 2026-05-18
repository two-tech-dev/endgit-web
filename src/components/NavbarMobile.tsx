"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarClient from "./NavbarClient";
import { useTheme } from "@/components/ThemeToggle";

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const header = wrapperRef.current?.closest("header");
    if (header) {
      const rect = header.getBoundingClientRect();
      setDropdownTop(rect.bottom);
    }
  }, []);

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const dropdown = (
    <AnimatePresence>
      {open && mounted && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: "fixed",
            top: dropdownTop,
            left: 0,
            right: 0,
            zIndex: 49,
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "var(--space-4)",
              gap: "var(--space-1)",
            }}
          >
            {[
              { href: "/plugins", label: "Releases" },
              { href: "/plugins/top", label: "Top Plugins" },
              { href: "/builds", label: "Dev Builds" },
              { href: "/faq", label: "FAQ" },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.05 + i * 0.05,
                  duration: 0.25,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                    fontSize: "1rem",
                    padding: "0.625rem 0",
                  }}
                >
                  {item.label}
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            key="theme-toggle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.25 }}
          >
            <div
              style={{
                borderTop: "1px solid var(--border-color)",
              }}
            />
            <div
              className="container"
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "var(--space-3)",
                paddingBottom: "var(--space-4)",
                gap: "var(--space-1)",
              }}
            >
              <button
                onClick={toggleTheme}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.625rem 0",
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "1rem",
                  width: "100%",
                }}
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                {theme === "light" ? "Dark mode" : "Light mode"}
              </button>

              <div
                onClick={(e) => e.stopPropagation()}
                style={{ paddingTop: "var(--space-2)" }}
              >
                <NavbarClient mobile onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={wrapperRef} style={{ display: "flex", alignItems: "center" }}>
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
        <button
          onClick={toggleTheme}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "var(--radius-full)",
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            transition: "all var(--transition-fast)",
          }}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <NavbarClient />
      </nav>

      {/* Mobile hamburger button */}
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

      {/* Dropdown rendered via portal to body */}
      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
}

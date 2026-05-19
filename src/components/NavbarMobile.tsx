"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import NavbarClient from "./NavbarClient";
import { useTheme } from "@/components/ThemeToggle";

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

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
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    setAnimating(true);
    requestAnimationFrame(() => {
      setVisible(true);
      setTimeout(() => setAnimating(false), 250);
    });
  };

  const handleClose = () => {
    setVisible(false);
    setAnimating(true);
    setTimeout(() => {
      setOpen(false);
      setAnimating(false);
    }, 250);
  };

  const handleToggle = () => {
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const dropdown = (
    <div
      ref={dropdownRef}
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
        opacity: visible ? 1 : 0,
        maxHeight: visible ? "400px" : "0px",
        transition: "opacity 250ms ease, max-height 250ms ease",
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
          <div
            key={item.href}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-16px)",
              transition: `opacity 250ms ease ${50 + i * 50}ms, transform 250ms ease ${50 + i * 50}ms`,
            }}
          >
            <a
              href={item.href}
              onClick={() => handleClose()}
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
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border-color)",
          opacity: visible ? 1 : 0,
          transition: "opacity 250ms ease 200ms",
        }}
      >
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
            <NavbarClient mobile onNavigate={() => handleClose()} />
          </div>
        </div>
      </div>
    </div>
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
        onClick={handleToggle}
        aria-label="Toggle menu"
        style={{
          color: "var(--text-primary)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 24,
            height: 24,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: open ? 0 : 1,
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "opacity 200ms, transform 200ms",
            }}
          >
            <Menu size={24} />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: open ? 1 : 0,
              transform: open ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "opacity 200ms, transform 200ms",
            }}
          >
            <X size={24} />
          </div>
        </div>
      </button>

      {/* Dropdown rendered via portal to body */}
      {mounted && open && createPortal(dropdown, document.body)}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import Link from "next/link";
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
      style={{ top: dropdownTop }}
      className={`fixed left-0 right-0 z-[49] bg-surface/80 backdrop-blur-md border-b border-border shadow-sm rounded-b-sm overflow-hidden transition-all duration-250 ease-in-out ${
        visible ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"
      }`}
    >
      <div className="container grid pt-4 gap-1">
        {[
          { href: "/plugins", label: "Releases" },
          { href: "/plugins/top", label: "Top Plugins" },
          { href: "/builds", label: "Dev Builds" },
          { href: "/faq", label: "FAQ" },
        ].map((item, i) => (
          <div
            key={item.href}
            className="transition-all duration-250 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-16px)",
              transitionDelay: `${50 + i * 50}ms`,
            }}
          >
            <Link
              href={item.href}
              onClick={() => handleClose()}
              className="block text-text-secondary font-medium text-base py-2.5 hover:text-text-primary transition-colors"
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>

      <div
        className="border-t border-border transition-opacity duration-250 ease-in-out"
        style={{
          opacity: visible ? 1 : 0,
          transitionDelay: "200ms",
        }}
      >
        <div className="container grid pt-3 pb-4 gap-1">
          <div
            className="transition-all duration-250 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-16px)",
              transitionDelay: "250ms",
            }}
          >
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 py-2.5 text-text-secondary font-medium text-base w-full text-left hover:text-text-primary transition-colors"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="pt-2 transition-all duration-250 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-16px)",
              transitionDelay: "300ms",
            }}
          >
            <NavbarClient mobile onNavigate={() => handleClose()} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={wrapperRef} className="grid items-center">
      <nav className="hidden lg:grid lg:grid-flow-col lg:auto-cols-auto gap-8 xl:gap-12 items-center">
        <Link
          href="/plugins"
          className="text-text-secondary font-medium hover:text-text-primary transition-colors"
        >
          Releases
        </Link>
        <Link
          href="/plugins/top"
          className="text-text-secondary font-medium hover:text-text-primary transition-colors"
        >
          Top Plugins
        </Link>
        <Link
          href="/builds"
          className="text-text-secondary font-medium hover:text-text-primary transition-colors"
        >
          Dev Builds
        </Link>
        <Link
          href="/faq"
          className="text-text-secondary font-medium hover:text-text-primary transition-colors"
        >
          FAQ
        </Link>
        <button
          onClick={toggleTheme}
          className="grid items-center justify-center w-8 h-8 rounded-sm bg-surface-secondary text-text-secondary transition-all hover:bg-border hover:text-text-primary"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <NavbarClient />
      </nav>

      <button
        className="grid lg:hidden items-center justify-center p-1.5 cursor-pointer text-text-primary touch-target"
        onClick={handleToggle}
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <div
            className={`absolute inset-0 grid items-center justify-center transition-all duration-200 ${
              open ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
            }`}
          >
            <Menu size={24} />
          </div>
          <div
            className={`absolute inset-0 grid items-center justify-center transition-all duration-200 ${
              open ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
            }`}
          >
            <X size={24} />
          </div>
        </div>
      </button>

      {mounted && open && createPortal(dropdown, document.body)}
    </div>
  );
}

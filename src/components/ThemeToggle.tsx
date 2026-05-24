"use client";

import { useState, useEffect, useCallback } from "react";
import { Moon, Sun } from "lucide-react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else if (systemDark) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const next = e.matches ? "dark" : "light";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
      }
    };

    mediaQuery.addEventListener("change", handler);
    setMounted(true);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  return { theme, mounted, toggleTheme };
}

export default function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={toggleTheme}
      className="grid place-items-center w-8 h-8 rounded-sm bg-surface-secondary text-text-secondary transition-all hover:bg-border hover:text-text-primary"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

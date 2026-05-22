"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IconChevronDown,
  IconLogout2,
  IconMenu2,
  IconMoon,
  IconSettings,
  IconSun,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function useDarkMode() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return { dark, mounted, toggle };
}

function UserMenu({ onClose }: { onClose?: () => void }) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.trustLevel === "ADMIN" || (session?.user as any)?.trustLevel === "TRUSTED";

  return (
    <>
      {isAdmin && (
        <Button asChild variant="ghost" className="h-8 w-full justify-start gap-2 text-xs" onClick={onClose}>
          <Link href="/admin">
            <IconSettings className="size-3.5" />
            Admin Panel
          </Link>
        </Button>
      )}
      <Button asChild variant="ghost" className="h-8 w-full justify-start gap-2 text-xs" onClick={onClose}>
        <Link href="/dashboard/dev">
          <IconSettings className="size-3.5" />
          Dev Dashboard
        </Link>
      </Button>
      <Button asChild variant="ghost" className="h-8 w-full justify-start gap-2 text-xs" onClick={onClose}>
        <Link href="/dashboard">
          <IconSettings className="size-3.5" />
          My Plugins
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="h-8 w-full justify-start gap-2 text-xs"
        onClick={() => {
          onClose?.();
          signOut({ callbackUrl: "/" });
        }}
      >
        <IconLogout2 className="size-3.5" />
        Log Out
      </Button>
    </>
  );
}

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const signInPendingRef = useRef(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession();
  const { dark, toggle: toggleDark } = useDarkMode();

  const handleLogin = () => {
    if (signInPendingRef.current) return;
    signInPendingRef.current = true;
    const callbackParam = new URLSearchParams(window.location.search).get("callbackUrl");
    const callbackUrl = callbackParam || window.location.pathname || "/";
    signIn("github", { callbackUrl }).catch(() => {
      signInPendingRef.current = false;
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const initials = (session?.user?.name ?? "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-2 py-2 sm:px-6 sm:py-3 lg:px-8">
        <div
          ref={navRef}
          className={cn(
            "mx-auto w-full max-w-6xl rounded-xl border px-3 py-2 transition-all duration-300 ease-out sm:px-4",
            scrolled
              ? "border-border/70 bg-background/85 shadow-sm backdrop-blur-md dark:bg-background/75"
              : "border-transparent bg-transparent",
          )}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md px-1 py-1"
            >
              <Image
                src="/logo.png"
                alt="EndGit"
                width={28}
                height={28}
                className="rounded-sm"
                priority
              />
              <span className="hidden text-sm font-semibold tracking-wide sm:inline sm:text-base">
                endgit<span style={{ color: "#2dd4bf" }}>.</span>
              </span>
            </Link>

            <Button
              type="button"
              variant="outline"
              className="h-8 px-2 md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <IconX className="size-4" /> : <IconMenu2 className="size-4" />}
            </Button>

            <nav className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" className="h-8 px-3 text-xs sm:text-sm">
                <Link href="/plugins">Releases</Link>
              </Button>
              <Button asChild variant="ghost" className="h-8 px-3 text-xs sm:text-sm">
                <Link href="/plugins/top">Top Plugins</Link>
              </Button>
              <Button asChild variant="ghost" className="h-8 px-3 text-xs sm:text-sm">
                <Link href="/builds">Dev Builds</Link>
              </Button>
              <Button asChild variant="ghost" className="h-8 px-3 text-xs sm:text-sm">
                <Link href="/faq">FAQ</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={toggleDark}
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {dark ? <IconSun className="size-3.5" /> : <IconMoon className="size-3.5" />}
              </Button>

              {status === "authenticated" ? (
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 gap-2 rounded-full pl-1 pr-2"
                    onClick={() => setMenuOpen((open) => !open)}
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user?.name ?? "Profile"}
                        width={24}
                        height={24}
                        className="size-6 rounded-full"
                      />
                    ) : (
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/20 text-[0.65rem] font-semibold text-primary">
                        {initials}
                      </span>
                    )}
                    <span className="hidden text-xs sm:inline">
                      {session.user?.name ?? "Profile"}
                    </span>
                    <IconChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        menuOpen ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </Button>

                  <div
                    className={cn(
                      "absolute right-0 top-11 z-50 w-56 origin-top-right rounded-2xl border border-border/70 bg-background/95 p-1.5 shadow-lg backdrop-blur-md transition-all duration-200",
                      menuOpen
                        ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none -translate-y-1 scale-95 opacity-0",
                    )}
                  >
                    <p className="px-2 pt-1 pb-0.5 text-[0.65rem] text-muted-foreground">
                      Signed in as
                    </p>
                    <p className="truncate px-2 pb-1.5 text-sm font-medium">
                      {session.user?.name ?? "GitHub User"}
                    </p>
                    <div className="h-px bg-border/70" />
                    <div className="flex flex-col gap-0.5 pt-1">
                      <UserMenu onClose={() => setMenuOpen(false)} />
                    </div>
                  </div>
                </div>
              ) : (
                <Button type="button" variant="outline" className="h-8 px-3 text-xs sm:text-sm" onClick={handleLogin}>
                  Login
                </Button>
              )}
            </nav>
          </div>

          {/* Mobile menu */}
          <div
            className={cn(
              "grid max-h-[calc(100dvh-6rem)] overflow-hidden overflow-y-auto transition-all duration-300 ease-out md:hidden",
              mobileOpen
                ? "mt-3 border-t border-border/70 max-h-128 grid-rows-[1fr] pt-3 opacity-100"
                : "mt-0 border-transparent max-h-0 grid-rows-[0fr] pt-0 opacity-0",
            )}
          >
            <div className="grid min-h-0 gap-2">
              <Button asChild variant="ghost" className="h-9 justify-start px-3 text-sm" onClick={() => setMobileOpen(false)}>
                <Link href="/plugins">Releases</Link>
              </Button>
              <Button asChild variant="ghost" className="h-9 justify-start px-3 text-sm" onClick={() => setMobileOpen(false)}>
                <Link href="/plugins/top">Top Plugins</Link>
              </Button>
              <Button asChild variant="ghost" className="h-9 justify-start px-3 text-sm" onClick={() => setMobileOpen(false)}>
                <Link href="/builds">Dev Builds</Link>
              </Button>
              <Button asChild variant="ghost" className="h-9 justify-start px-3 text-sm" onClick={() => setMobileOpen(false)}>
                <Link href="/faq">FAQ</Link>
              </Button>

              {status === "authenticated" ? (
                <>
                  <div className="mt-1 rounded-xl border border-border/70 bg-background/80 px-3 py-2.5">
                    <p className="text-[0.65rem] text-muted-foreground">Signed in as</p>
                    <p className="truncate text-sm font-medium">
                      {session.user?.name ?? "GitHub User"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <UserMenu onClose={() => setMobileOpen(false)} />
                  </div>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 justify-start px-3 text-sm"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogin();
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] transition-opacity duration-300 md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}

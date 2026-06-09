"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
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
        className={`animate-pulse bg-surface-secondary ${
          mobile ? "w-full rounded-sm" : "w-[100px] rounded-sm"
        } h-[36px]`}
      />
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("github")}
        className={`btn btn-primary text-sm py-2 px-4 ${mobile ? "w-full" : ""}`}
      >
        [+] Sign In
      </button>
    );
  }

  const user = session.user;
  const initials = user?.name?.charAt(0) || user?.email?.charAt(0) || "U";

  const userAvatar = user?.image ? (
    <Image
      src={user.image}
      alt=""
      width={mobile ? 32 : 28}
      height={mobile ? 32 : 28}
      className="rounded-full object-cover"
    />
  ) : (
    <div
      className={`${
        mobile ? "w-8 h-8" : "w-7 h-7"
      } rounded-full border border-border bg-surface-secondary flex items-center justify-center text-text-primary text-xs font-bold shrink-0`}
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
        className={`grid grid-cols-[auto_1fr] items-center gap-2 rounded-sm text-text-secondary hover:bg-surface-secondary transition-colors ${
          mobile ? "py-2.5 px-3 text-[15px]" : "py-2 px-3 text-sm"
        }`}
      >
        <span>[+]</span> Dev Dashboard
      </Link>
      <Link
        href="/dashboard"
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
        className={`grid grid-cols-[auto_1fr] items-center gap-2 rounded-sm text-text-secondary hover:bg-surface-secondary transition-colors ${
          mobile ? "py-2.5 px-3 text-[15px]" : "py-2 px-3 text-sm"
        }`}
      >
        <span>[+]</span> My Plugins
      </Link>
      {((session?.user as any)?.trustLevel === "ADMIN" ||
        (session?.user as any)?.trustLevel === "TRUSTED") && (
        <Link
          href="/admin"
          onClick={() => {
            setDropdownOpen(false);
            onNavigate?.();
          }}
          className={`grid grid-cols-[auto_1fr] items-center gap-2 rounded-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors ${
            mobile ? "py-2.5 px-3 text-[15px]" : "py-2 px-3 text-sm"
          }`}
        >
          <span>[x]</span> Admin Panel
        </Link>
      )}
    </>
  );

  const signOutButton = (
    <button
      onClick={() => {
        signOut();
        setDropdownOpen(false);
        onNavigate?.();
      }}
      className={`grid grid-cols-[auto_1fr] items-center gap-2 rounded-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary w-full text-left transition-colors ${
        mobile ? "py-2.5 px-3 text-[15px]" : "py-2 px-3 text-sm"
      }`}
    >
      <span>[-]</span> Sign Out
    </button>
  );

  if (mobile) {
    return (
      <div className="grid gap-1">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 px-3 rounded-sm border-0 w-full cursor-pointer transition-all ${
            dropdownOpen ? "bg-surface-secondary" : "bg-transparent"
          }`}
        >
          {userAvatar}
          <div className="min-w-0">
            <div className="font-semibold text-[15px] text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
              {user?.name || user?.email}
            </div>
            {user?.email && user?.name && (
              <div className="text-xs text-text-muted">{user.email}</div>
            )}
          </div>
          <span className="text-text-muted shrink-0">
            {dropdownOpen ? "[-]" : "[+]"}
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            dropdownOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid gap-1 px-1">
            {menuItems}
            <div className="border-t border-border my-1" />
            {signOutButton}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="grid grid-cols-[auto_1fr_auto] items-center gap-2 py-1.5 px-3 rounded-sm border border-border bg-surface-card cursor-pointer transition-all hover:bg-surface-secondary"
      >
        {userAvatar}
        <span className="font-medium text-sm text-text-primary max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
          {user?.name || user?.email}
        </span>
        <span className="text-text-muted">{dropdownOpen ? "[-]" : "[+]"}</span>
      </button>

      {dropdownOpen && (
        <>
          <div
            onClick={() => setDropdownOpen(false)}
            className="fixed inset-0 z-40"
          />

          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[220px] max-w-[calc(100vw-2rem)] bg-surface-card border border-border rounded-sm overflow-hidden animate-fade-in">
            <div className="py-3 px-4 border-b border-border bg-surface-secondary">
              <div className="font-semibold text-sm text-text-primary">
                {user?.name}
              </div>
              <div className="text-xs text-text-muted">{user?.email}</div>
            </div>

            <div className="p-1.5 grid gap-0.5">{menuItems}</div>

            <div className="p-1.5 border-t border-border">{signOutButton}</div>
          </div>
        </>
      )}
    </div>
  );
}

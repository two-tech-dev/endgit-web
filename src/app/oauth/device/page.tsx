"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, Terminal, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeviceAuthPage() {
  const { data: session, status } = useSession();

  const [segments, setSegments] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const secondRef = useRef<HTMLInputElement>(null);

  const userCode =
    segments[0] && segments[1] ? `${segments[0]}-${segments[1]}` : "";

  function handleSegmentChange(index: number, value: string) {
    const clean = value
      .toUpperCase()
      .replace(/[^A-Z2-9]/g, "")
      .slice(0, 4);
    const next = [...segments];
    next[index] = clean;
    setSegments(next);
    setError("");

    if (index === 0 && clean.length === 4) {
      secondRef.current?.focus();
    }
  }

  function handleSegmentKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (index === 1 && e.key === "Backspace" && segments[1] === "") {
      const input = e.currentTarget
        .previousElementSibling as HTMLInputElement | null;
      input?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").toUpperCase();
    const clean = pasted.replace(/[^A-Z2-9-]/g, "");
    const parts = clean.split("-");
    const first = (parts[0] || "").slice(0, 4);
    const second = (parts[1] || "").slice(0, 4);
    setSegments([first, second]);
    setError("");
    if (first.length === 4) {
      secondRef.current?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (userCode.length !== 9) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_code: userCode }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(
          data.error ||
            "Authorization failed. Please check your code and try again.",
        );
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[480px] rounded-2xl border border-border/70 bg-card/80 p-10 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Device Authorization
        </h1>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
          Authorize the EndGit CLI to access your account
        </p>

        {success ? (
          <div className="mt-8 flex flex-col items-center gap-4">
            <CheckCircle size={48} className="text-green-500" />
            <p className="text-lg font-semibold text-foreground">
              Device authorized!
            </p>
            <p className="text-[0.9375rem] text-muted-foreground">
              You can close this page. The CLI will complete login
              automatically.
            </p>
          </div>
        ) : !session ? (
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="w-full rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4">
              <div className="flex items-center justify-center gap-2 font-medium text-orange-500">
                <AlertCircle size={16} />
                You must be signed in to authorize a device
              </div>
            </div>
            <Button asChild size="sm" className="w-full">
              <a
                href={`/api/auth/signin?callbackUrl=${encodeURIComponent("/oauth/device")}`}
              >
                Sign in with GitHub
              </a>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            <div>
              <p className="mb-3 text-sm font-medium text-foreground">
                Enter the code shown in your terminal
              </p>

              <div className="flex items-center justify-center gap-3">
                <input
                  type="text"
                  value={segments[0]}
                  onChange={(e) => handleSegmentChange(0, e.target.value)}
                  onPaste={handlePaste}
                  maxLength={4}
                  placeholder="XXXX"
                  autoFocus
                  autoComplete="off"
                  className={`w-[120px] rounded-md border-2 bg-muted p-3 text-center font-mono text-2xl font-bold uppercase tracking-widest text-foreground outline-none ${
                    error ? "border-red-500" : "border-border"
                  }`}
                />
                <span className="text-2xl font-bold text-muted-foreground">
                  —
                </span>
                <input
                  ref={secondRef}
                  type="text"
                  value={segments[1]}
                  onChange={(e) => handleSegmentChange(1, e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={(e) => handleSegmentKeyDown(1, e)}
                  maxLength={4}
                  placeholder="XXXX"
                  autoComplete="off"
                  className={`w-[120px] rounded-md border-2 bg-muted p-3 text-center font-mono text-2xl font-bold uppercase tracking-widest text-foreground outline-none ${
                    error ? "border-red-500" : "border-border"
                  }`}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={userCode.length !== 9 || loading}
              className={`w-full text-base ${
                userCode.length !== 9 || loading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Authorizing...
                </>
              ) : (
                "Authorize Device"
              )}
            </Button>

            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              Authorizing as{" "}
              <strong className="text-foreground">
                @{(session.user as any)?.username || session.user?.name}
              </strong>
              . Not you?{" "}
              <a href="/api/auth/signout" className="text-primary">
                Sign out
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

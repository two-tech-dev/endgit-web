"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, Terminal, Loader2, AlertCircle } from "lucide-react";

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
    // Only uppercase alphanumeric, no ambiguous chars
    const clean = value
      .toUpperCase()
      .replace(/[^A-Z2-9]/g, "")
      .slice(0, 4);
    const next = [...segments];
    next[index] = clean;
    setSegments(next);
    setError("");

    // Auto-advance to second segment when first is full
    if (index === 0 && clean.length === 4) {
      secondRef.current?.focus();
    }
  }

  function handleSegmentKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    // Backspace on empty second segment moves focus back to first
    if (index === 1 && e.key === "Backspace" && segments[1] === "") {
      const input = e.currentTarget
        .previousElementSibling as HTMLInputElement | null;
      input?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").toUpperCase();
    // Strip everything except allowed chars and the separator
    const clean = pasted.replace(/[^A-Z2-9-]/g, "");
    const parts = clean.split("-");
    const first = (parts[0] || "").slice(0, 4);
    const second = (parts[1] || "").slice(0, 4);
    setSegments([first, second]);
    setError("");
    // Focus second input if first is complete
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="container py-12 min-h-[60vh] flex items-center justify-center mx-auto px-4">
      <div className="card max-w-[480px] w-full p-10 text-center">
        {/* Icon */}
        <div className="w-[72px] h-[72px] bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Terminal size={36} className="text-brand" />
        </div>

        <h1 className="heading-2 mb-2">Device Authorization</h1>
        <p className="text-text-secondary text-[0.9375rem] leading-relaxed mb-8">
          Authorize the EndGit CLI to access your account
        </p>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle size={48} className="text-success" />
            <p className="text-lg font-semibold text-text-primary">
              Device authorized!
            </p>
            <p className="text-text-secondary text-[0.9375rem]">
              You can close this page. The CLI will complete login
              automatically.
            </p>
          </div>
        ) : !session ? (
          /* Not signed in */
          <div className="flex flex-col items-center gap-6">
            <div className="p-4 bg-warning/10 rounded-md border border-warning/20 w-full">
              <div className="flex items-center gap-2 text-warning font-medium justify-center">
                <AlertCircle size={16} />
                You must be signed in to authorize a device
              </div>
            </div>
            <a
              href={`/api/auth/signin?callbackUrl=${encodeURIComponent("/oauth/device")}`}
              className="btn btn-primary inline-flex items-center gap-2 w-full justify-center"
            >
              Sign in with GitHub
            </a>
          </div>
        ) : (
          /* Signed in — show code entry form */
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium mb-3 text-text-secondary">
                Enter the code shown in your terminal
              </p>

              {/* Two-segment code input */}
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
                  className={`w-[120px] text-center tracking-widest text-2xl font-bold font-mono p-3 rounded-md border-2 bg-surface-secondary text-text-primary outline-none uppercase transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 ${
                    error ? "border-error" : "border-border"
                  }`}
                />
                <span className="text-2xl font-bold text-text-muted">—</span>
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
                  className={`w-[120px] text-center tracking-widest text-2xl font-bold font-mono p-3 rounded-md border-2 bg-surface-secondary text-text-primary outline-none uppercase transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 ${
                    error ? "border-error" : "border-border"
                  }`}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-error/10 rounded-md border border-error/20 flex items-center gap-2 text-error text-sm">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={userCode.length !== 9 || loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 text-base p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Authorizing...
                </>
              ) : (
                "Authorize Device"
              )}
            </button>

            <p className="text-[0.8125rem] text-text-muted leading-relaxed">
              Authorizing as{" "}
              <strong className="text-text-primary">
                @{(session.user as any)?.username || session.user?.name}
              </strong>
              . Not you?{" "}
              <a
                href="/api/auth/signout"
                className="text-brand hover:underline"
              >
                Sign out
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

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
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Loader2
                    size={32}
                    style={{
                        animation: "spin 1s linear infinite",
                        color: "var(--accent-cyan)",
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className="container"
            style={{
                padding: "var(--space-12) 0",
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="card"
                style={{
                    maxWidth: "480px",
                    width: "100%",
                    padding: "var(--space-10)",
                    textAlign: "center",
                }}
            >
                {/* Icon */}
                <div
                    style={{
                        width: "72px",
                        height: "72px",
                        background: "rgba(14, 165, 233, 0.1)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto var(--space-6)",
                    }}
                >
                    <Terminal size={36} color="var(--accent-cyan)" />
                </div>

                <h1
                    className="heading-2"
                    style={{ marginBottom: "var(--space-2)" }}
                >
                    Device Authorization
                </h1>
                <p
                    className="text-secondary"
                    style={{
                        fontSize: "0.9375rem",
                        lineHeight: 1.6,
                        marginBottom: "var(--space-8)",
                    }}
                >
                    Authorize the EndGit CLI to access your account
                </p>

                {/* Success state */}
                {success ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "var(--space-4)",
                        }}
                    >
                        <CheckCircle size={48} color="var(--status-success)" />
                        <p
                            style={{
                                fontSize: "1.125rem",
                                fontWeight: 600,
                                color: "var(--text-primary)",
                            }}
                        >
                            Device authorized!
                        </p>
                        <p
                            className="text-secondary"
                            style={{ fontSize: "0.9375rem" }}
                        >
                            You can close this page. The CLI will complete login
                            automatically.
                        </p>
                    </div>
                ) : !session ? (
                    /* Not signed in */
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "var(--space-6)",
                        }}
                    >
                        <div
                            style={{
                                padding: "var(--space-4)",
                                background: "rgba(251, 191, 36, 0.1)",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid rgba(251, 191, 36, 0.2)",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    color: "var(--accent-orange)",
                                    fontWeight: 500,
                                    justifyContent: "center",
                                }}
                            >
                                <AlertCircle size={16} />
                                You must be signed in to authorize a device
                            </div>
                        </div>
                        <a
                            href={`/api/auth/signin?callbackUrl=${encodeURIComponent("/oauth/device")}`}
                            className="btn btn-primary"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                width: "100%",
                                justifyContent: "center",
                            }}
                        >
                            Sign in with GitHub
                        </a>
                    </div>
                ) : (
                    /* Signed in — show code entry form */
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-6)",
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    marginBottom: "var(--space-3)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                Enter the code shown in your terminal
                            </p>

                            {/* Two-segment code input */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "12px",
                                }}
                            >
                                <input
                                    type="text"
                                    value={segments[0]}
                                    onChange={(e) =>
                                        handleSegmentChange(0, e.target.value)
                                    }
                                    maxLength={4}
                                    placeholder="XXXX"
                                    autoFocus
                                    autoComplete="off"
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                        letterSpacing: "0.25em",
                                        fontSize: "1.5rem",
                                        fontWeight: 700,
                                        fontFamily: "var(--font-mono)",
                                        padding: "0.75rem",
                                        borderRadius: "var(--radius-md)",
                                        border: `2px solid ${error ? "var(--status-error)" : "var(--border-color)"}`,
                                        background: "var(--bg-secondary)",
                                        color: "var(--text-primary)",
                                        outline: "none",
                                        textTransform: "uppercase",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: 700,
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    —
                                </span>
                                <input
                                    ref={secondRef}
                                    type="text"
                                    value={segments[1]}
                                    onChange={(e) =>
                                        handleSegmentChange(1, e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        handleSegmentKeyDown(1, e)
                                    }
                                    maxLength={4}
                                    placeholder="XXXX"
                                    autoComplete="off"
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                        letterSpacing: "0.25em",
                                        fontSize: "1.5rem",
                                        fontWeight: 700,
                                        fontFamily: "var(--font-mono)",
                                        padding: "0.75rem",
                                        borderRadius: "var(--radius-md)",
                                        border: `2px solid ${error ? "var(--status-error)" : "var(--border-color)"}`,
                                        background: "var(--bg-secondary)",
                                        color: "var(--text-primary)",
                                        outline: "none",
                                        textTransform: "uppercase",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div
                                style={{
                                    padding: "var(--space-3)",
                                    background: "rgba(239, 68, 68, 0.1)",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    color: "var(--status-error)",
                                    fontSize: "0.875rem",
                                }}
                            >
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={userCode.length !== 9 || loading}
                            className="btn btn-primary"
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                fontSize: "1rem",
                                padding: "0.75rem",
                                opacity:
                                    userCode.length !== 9 || loading ? 0.5 : 1,
                                cursor:
                                    userCode.length !== 9 || loading
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={16}
                                        style={{
                                            animation:
                                                "spin 1s linear infinite",
                                        }}
                                    />{" "}
                                    Authorizing...
                                </>
                            ) : (
                                "Authorize Device"
                            )}
                        </button>

                        <p
                            style={{
                                fontSize: "0.8125rem",
                                color: "var(--text-muted)",
                                lineHeight: 1.5,
                            }}
                        >
                            Authorizing as{" "}
                            <strong style={{ color: "var(--text-primary)" }}>
                                @
                                {(session.user as any)?.username ||
                                    session.user?.name}
                            </strong>
                            . Not you?{" "}
                            <a
                                href="/api/auth/signout"
                                style={{ color: "var(--accent-cyan)" }}
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

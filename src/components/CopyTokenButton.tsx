"use client";

import { useState } from "react";
import { Key, Copy, Check } from "lucide-react";

export default function CopyTokenButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="card"
      style={{
        padding: "var(--space-4) var(--space-6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        marginBottom: "var(--space-8)",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
      >
        <div
          style={{
            background: "rgba(124, 58, 237, 0.1)",
            padding: "8px",
            borderRadius: "8px",
            color: "var(--accent-primary)",
          }}
        >
          <Key size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
            CLI Access Token (PAT)
          </div>
          <div className="text-muted" style={{ fontSize: "0.85rem" }}>
            Use this token to authenticate with the EndGit CLI:{" "}
            <code>endgit login</code>
          </div>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="btn btn-secondary"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 16px",
        }}
      >
        {copied ? (
          <Check size={16} color="var(--status-success)" />
        ) : (
          <Copy size={16} />
        )}
        {copied ? "Copied!" : "Copy Token"}
      </button>
    </div>
  );
}

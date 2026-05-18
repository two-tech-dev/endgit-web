"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Server,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface CompatResult {
  version: string;
  status: "compatible" | "risky" | "incompatible";
  note: string;
}

const SERVER_VERSIONS = ["0.6.x", "0.5.x", "0.4.x", "0.3.x"];

export default function CompatibilityChecker({ slug }: { slug: string }) {
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState<CompatResult | null>(null);
  const [checking, setChecking] = useState(false);

  const checkCompat = (version: string) => {
    setSelected(version);
    setChecking(true);

    // Mock compatibility check — in production, calls API
    setTimeout(() => {
      const results: Record<string, CompatResult> = {
        "0.11.x": {
          version: "0.11.x",
          status: "compatible",
          note: "Fully tested and compatible with Endstone 0.11.x",
        },
        "0.10.x": {
          version: "0.10.x",
          status: "compatible",
          note: "Primary target version. All features supported.",
        },
      };
      setResult(results[version] || null);
      setChecking(false);
    }, 800);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "compatible":
        return <CheckCircle size={20} color="var(--status-success)" />;
      case "risky":
        return <AlertTriangle size={20} color="var(--status-warning)" />;
      case "incompatible":
        return <XCircle size={20} color="var(--status-error)" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "compatible":
        return "var(--status-success)";
      case "risky":
        return "var(--status-warning)";
      case "incompatible":
        return "var(--status-error)";
      default:
        return "var(--text-muted)";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "compatible":
        return "Compatible";
      case "risky":
        return "Risky";
      case "incompatible":
        return "Not Supported";
      default:
        return "";
    }
  };

  return (
    <div className="card" style={{ padding: "var(--space-5)" }}>
      <h3
        style={{
          fontWeight: 600,
          marginBottom: "var(--space-4)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "0.9375rem",
        }}
      >
        <Server size={16} color="var(--accent-cyan)" /> Compatibility Check
      </h3>

      <label
        style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          display: "block",
          marginBottom: "var(--space-2)",
        }}
      >
        Select your Endstone server version:
      </label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          marginBottom: "var(--space-4)",
        }}
      >
        {SERVER_VERSIONS.map((v) => (
          <button
            key={v}
            onClick={() => checkCompat(v)}
            style={{
              padding: "0.375rem 0.75rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              transition: "all 150ms",
              background:
                selected === v ? "var(--accent-purple)" : "var(--bg-secondary)",
              color: selected === v ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${selected === v ? "var(--accent-purple-hover)" : "var(--border-color)"}`,
              cursor: "pointer",
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {checking && (
        <div
          style={{
            padding: "var(--space-4)",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "var(--text-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Loader2
            size={16}
            style={{ animation: "spin 1s linear infinite" }}
          />
          Checking compatibility...
        </div>
      )}

      {result && !checking && (
        <div
          style={{
            padding: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            background: `${statusColor(result.status)}10`,
            border: `1px solid ${statusColor(result.status)}30`,
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--space-3)",
          }}
        >
          {statusIcon(result.status)}
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: statusColor(result.status),
                marginBottom: "4px",
              }}
            >
              {statusLabel(result.status)}
            </div>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {result.note}
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

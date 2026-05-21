"use client";

import { Shield, ExternalLink, Loader2, AlertTriangle } from "lucide-react";

interface VirusTotalCardProps {
  version: {
    vtStatus?: string | null;
    vtMalicious?: number | null;
    vtSuspicious?: number | null;
    vtUndetected?: number | null;
    vtTotal?: number | null;
    vtPermalink?: string | null;
    vtScanDate?: string | null;
  } | null;
}

export default function VirusTotalCard({ version }: VirusTotalCardProps) {
  if (!version) return null;

  const { vtStatus, vtMalicious, vtSuspicious, vtTotal, vtPermalink, vtScanDate } =
    version;

  const malicious = vtMalicious ?? 0;
  const suspicious = vtSuspicious ?? 0;

  const statusColor =
    vtStatus === "completed"
      ? malicious === 0 && suspicious === 0
        ? "var(--status-success)"
        : malicious > 0
          ? "var(--status-error)"
          : "var(--status-warning)"
      : vtStatus === "failed"
        ? "var(--text-muted)"
        : "var(--status-warning)";

  const statusLabel =
    vtStatus === "completed"
      ? malicious === 0 && suspicious === 0
        ? "Clean"
        : malicious > 0
          ? "Flagged"
          : "Suspicious"
      : vtStatus === "scanning" || vtStatus === "queued"
        ? "Scanning..."
        : vtStatus === "failed"
          ? "Scan Failed"
          : "Not Scanned";

  const formattedDate = vtScanDate
    ? new Date(vtScanDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      className="card"
      style={{
        padding: "var(--space-5)",
        background: "var(--bg-secondary)",
        borderColor: "var(--border-highlight)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-4)",
        }}
      >
        <h3
          style={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "0.875rem",
          }}
        >
          <Shield size={18} color={statusColor} /> VirusTotal Scan
        </h3>
        {!vtStatus && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontWeight: 400,
            }}
          >
            Pending
          </span>
        )}
        {(vtStatus === "queued" || vtStatus === "scanning") && (
          <Loader2
            size={16}
            color="var(--status-warning)"
            style={{ animation: "spin 1s linear infinite" }}
          />
        )}
      </div>

      {vtStatus === "completed" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.875rem",
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>Status</span>
            <span style={{ fontWeight: 600, color: statusColor }}>
              {statusLabel}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.875rem",
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>Detection</span>
            <span style={{ fontWeight: 600 }}>
              {malicious}/{vtTotal ?? 0} engines flagged
            </span>
          </div>
          {formattedDate && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>Scanned</span>
              <span style={{ fontWeight: 500 }}>{formattedDate}</span>
            </div>
          )}
          {vtPermalink && (
            <a
              href={vtPermalink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "var(--space-2)",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                textDecoration: "none",
                background: "rgba(139, 92, 246, 0.08)",
                color: "var(--accent-primary)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                transition: "all 200ms",
              }}
            >
              <ExternalLink size={14} /> View Full Report
            </a>
          )}
        </div>
      )}

      {(vtStatus === "queued" || vtStatus === "scanning") && (
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--status-warning)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Loader2
            size={14}
            style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}
          />
          Scan in progress — this may take a few minutes.
        </p>
      )}

      {vtStatus === "failed" && (
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          Scan could not be completed. It will be retried on the next submission.
        </p>
      )}

      {!vtStatus && (
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}
        >
          This version has not been scanned yet.
        </p>
      )}
    </div>
  );
}

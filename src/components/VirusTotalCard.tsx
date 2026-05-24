"use client";

import { ExternalLink, Loader2, AlertTriangle } from "lucide-react";

interface VirusTotalCardProps {
  version: {
    virustotal?: {
      status?: string | null;
      malicious?: number | null;
      suspicious?: number | null;
      undetected?: number | null;
      total?: number | null;
      permalink?: string | null;
      scanDate?: string | null;
    } | null;
  } | null;
}

export default function VirusTotalCard({ version }: VirusTotalCardProps) {
  if (!version?.virustotal) return null;

  const vt = version.virustotal;
  const malicious = vt.malicious ?? 0;
  const suspicious = vt.suspicious ?? 0;

  const statusColor =
    vt.status === "completed"
      ? malicious === 0 && suspicious === 0
        ? "var(--color-success)"
        : malicious > 0
          ? "var(--color-error)"
          : "var(--color-warning)"
      : vt.status === "failed"
        ? "var(--color-text-muted)"
        : "var(--color-warning)";

  const statusLabel =
    vt.status === "completed"
      ? malicious === 0 && suspicious === 0
        ? "Clean"
        : malicious > 0
          ? "Flagged"
          : "Suspicious"
      : vt.status === "scanning" || vt.status === "queued"
        ? "Scanning..."
        : vt.status === "failed"
          ? "Scan Failed"
          : "Not Scanned";

  const formattedDate = vt.scanDate
    ? new Date(vt.scanDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="card p-5 bg-surface-secondary border border-border-highlight overflow-hidden">
      <div className="grid grid-cols-[1fr_auto] items-center mb-4">
        <h3 className="font-semibold grid grid-flow-col auto-cols-max items-center gap-2 text-sm text-text-primary">
          VirusTotal Scan
        </h3>
        {!vt.status && (
          <span className="text-xs text-text-muted font-normal">Pending</span>
        )}
        {(vt.status === "queued" || vt.status === "scanning") && (
          <Loader2 size={16} className="text-warning animate-spin" />
        )}
      </div>

      {vt.status === "completed" && (
        <div className="grid gap-3">
          <div className="grid grid-cols-[1fr_auto] text-sm">
            <span className="text-text-muted">Status</span>
            <span className="font-semibold" style={{ color: statusColor }}>
              {statusLabel}
            </span>
          </div>
          <div className="grid grid-cols-[1fr_auto] text-sm gap-2">
            <span className="text-text-muted">Detection</span>
            <span className="font-semibold text-text-primary text-right wrap-break-word">
              {malicious}/{vt.total ?? 0} engines flagged
            </span>
          </div>
          {formattedDate && (
            <div className="grid grid-cols-[1fr_auto] text-sm">
              <span className="text-text-muted">Scanned</span>
              <span className="font-medium text-text-primary">
                {formattedDate}
              </span>
            </div>
          )}
          {vt.permalink && (
            <a
              href={vt.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="grid grid-flow-col place-items-center gap-1.5 mt-2 px-3 py-2 rounded-sm text-[0.8125rem] font-medium no-underline bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all duration-200"
            >
              <ExternalLink size={14} /> View Full Report
            </a>
          )}
        </div>
      )}

      {(vt.status === "queued" || vt.status === "scanning") && (
        <p className="text-[0.8125rem] text-warning flex items-start gap-1.5">
          <Loader2 size={14} className="animate-spin shrink-0 mt-0.5" />
          <span>Scan in progress — this may take a few minutes.</span>
        </p>
      )}

      {vt.status === "failed" && (
        <p className="text-[0.8125rem] text-text-muted flex items-start gap-1.5">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>
            Scan could not be completed. It will be retried on the next
            submission.
          </span>
        </p>
      )}

      {!vt.status && (
        <p className="text-[0.8125rem] text-text-muted">
          This version has not been scanned yet.
        </p>
      )}
    </div>
  );
}

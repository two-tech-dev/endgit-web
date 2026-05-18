"use client";

import { useSession } from "next-auth/react";
import { Send, Clock } from "lucide-react";
import Link from "next/link";

interface Props {
  buildId: string;
  buildNumber: number;
  buildStatus: string;
  isSubmitted?: boolean;
  canSubmit?: boolean;
}

export default function SubmitForReview({
  buildId,
  buildNumber,
  buildStatus,
  isSubmitted = false,
  canSubmit = true,
}: Props) {
  const { data: session } = useSession();

  if (buildStatus !== "SUCCESS") return null;
  if (!session) return null;

  if (isSubmitted) {
    return (
      <div
        className="card"
        style={{
          padding: "var(--space-4) var(--space-5)",
          marginTop: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderLeft: "4px solid var(--status-warning)",
          background: "rgba(245,158,11,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <Clock
            size={20}
            color="var(--status-warning)"
            style={{ flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--text-primary)",
              }}
            >
              ⏳ Submitted for Review
            </div>
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              Build #{buildNumber} is currently pending admin review.
            </div>
          </div>
        </div>
        <Link
          href={`/builds/${buildId}/submit`}
          className="btn btn-secondary"
          style={{
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            textDecoration: "none",
          }}
        >
          Edit Submission
        </Link>
      </div>
    );
  }

  if (!canSubmit) return null;

  return (
    <div
      className="card"
      style={{ padding: "var(--space-5)", marginTop: "var(--space-6)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3
            style={{
              fontWeight: 600,
              fontSize: "0.9375rem",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Send size={16} color="var(--accent-primary)" /> Submit for Review
          </h3>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginTop: "4px",
            }}
          >
            Submit Build #{buildNumber} for admin review to get it published on
            the marketplace.
          </p>
        </div>
        <Link
          href={`/builds/${buildId}/submit`}
          className="btn btn-primary"
          style={{
            padding: "0.5rem 1.25rem",
            fontSize: "0.875rem",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Send size={14} /> Publish Plugin
        </Link>
      </div>
    </div>
  );
}

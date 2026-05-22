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
      <div className="card px-4 md:px-5 py-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-l-4 border-warning bg-warning/5">
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-warning shrink-0" />
          <div>
            <div className="font-semibold text-sm text-text-primary">
              ⏳ Submitted for Review
            </div>
            <div className="text-[0.8125rem] text-text-muted mt-[2px]">
              Build #{buildNumber} is currently pending admin review.
            </div>
          </div>
        </div>
        <Link
          href={`/builds/${buildId}/submit`}
          className="btn btn-secondary px-3 py-1.5 text-xs no-underline w-full sm:w-auto justify-center"
        >
          Edit Submission
        </Link>
      </div>
    );
  }

  if (!canSubmit) return null;

  return (
    <div className="card p-4 md:p-5 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-semibold text-[0.9375rem] flex items-center gap-2">
            <Send size={16} className="text-brand" /> Submit for Review
          </h3>
          <p className="text-[0.8125rem] text-text-muted mt-1">
            Submit Build #{buildNumber} for admin review to get it published on
            the marketplace.
          </p>
        </div>
        <Link
          href={`/builds/${buildId}/submit`}
          className="btn btn-primary px-5 py-2 text-sm no-underline flex items-center gap-1.5 w-full sm:w-auto justify-center"
        >
          <Send size={14} /> Publish Plugin
        </Link>
      </div>
    </div>
  );
}

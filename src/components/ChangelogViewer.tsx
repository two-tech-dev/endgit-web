"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  changelog: string;
  version: string;
}

export default function ChangelogViewer({ changelog, version }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // We split by newline to see if the line count exceeds the limit,
  // or if the overall character count is large.
  const lines = changelog.split("\n");
  const isLong = changelog.length > 300 || lines.length > 5;

  return (
    <div className="card p-4 lg:p-5">
      <h3 className="font-semibold mb-3 text-base">What's New in v{version}</h3>
      <div className="relative">
        <div
          className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
            isLong && !isExpanded ? "max-h-[120px]" : "max-h-[2000px]"
          }`}
        >
          <p className="text-sm text-text-secondary whitespace-pre-wrap m-0 font-mono">
            {changelog}
          </p>
        </div>

        {/* Gradient overlay for truncation hint */}
        {isLong && !isExpanded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to top, var(--color-surface-card) 10%, transparent)",
            }}
          />
        )}
      </div>

      {isLong && (
        <div className="mt-3 flex justify-start">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors cursor-pointer bg-transparent border-none p-1 -ml-1 outline-none"
          >
            {isExpanded ? (
              <>
                Close <ChevronUp size={14} />
              </>
            ) : (
              <>
                Open <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

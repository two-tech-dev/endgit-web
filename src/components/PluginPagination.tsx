"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PluginPaginationProps {
  currentPage: number;
  totalPages: number;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  if (currentPage > 3) pages.push("...");
  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    pages.push(i);
  }
  if (currentPage < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

export default function PluginPagination({
  currentPage,
  totalPages,
}: PluginPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const btnStyle = (active: boolean, disabled: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    padding: "0.5rem 0.75rem",
    minHeight: "44px",
    minWidth: "44px",
    borderRadius: "var(--radius-md)",
    border: active
      ? "1px solid var(--accent-primary)"
      : "1px solid var(--border-color)",
    background: active
      ? "rgba(6, 182, 212, 0.1)"
      : disabled
        ? "var(--bg-secondary)"
        : "var(--bg-card)",
    color: active
      ? "var(--accent-primary)"
      : disabled
        ? "var(--text-muted)"
        : "var(--text-secondary)",
    fontSize: "0.875rem",
    fontWeight: active ? 700 : 500,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    transition: "all 150ms",
    textAlign: "center" as const,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "var(--space-2)",
        marginTop: "var(--space-6)",
        flexWrap: "wrap",
      }}
    >
      {currentPage > 1 ? (
        <button
          onClick={() => goToPage(currentPage - 1)}
          style={btnStyle(false, false)}
        >
          <ChevronLeft size={16} /> Prev
        </button>
      ) : (
        <span style={btnStyle(false, true)}>
          <ChevronLeft size={16} /> Prev
        </span>
      )}

      {getPageNumbers(currentPage, totalPages).map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            style={{
              padding: "0.5rem 0.25rem",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            style={btnStyle(p === currentPage, false)}
          >
            {p}
          </button>
        ),
      )}

      {currentPage < totalPages ? (
        <button
          onClick={() => goToPage(currentPage + 1)}
          style={btnStyle(false, false)}
        >
          Next <ChevronRight size={16} />
        </button>
      ) : (
        <span style={btnStyle(false, true)}>
          Next <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}

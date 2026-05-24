"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PluginPaginationProps {
  currentPage: number;
  totalPages: number;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
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

  const getBtnClassName = (active: boolean, disabled: boolean) => {
    const base =
      "inline-grid grid-flow-col place-items-center gap-1 px-3 py-2 min-h-[44px] min-w-[44px] rounded-sm text-sm transition-all text-center no-underline";
    if (active) {
      return `${base} border border-accent bg-accent/10 text-accent font-bold cursor-pointer`;
    }
    if (disabled) {
      return `${base} border border-border bg-surface-secondary text-text-muted font-medium cursor-not-allowed opacity-50`;
    }
    return `${base} border border-border bg-surface-card text-text-secondary font-medium cursor-pointer hover:bg-surface-secondary hover:text-text-primary`;
  };

  return (
    <div className="grid grid-flow-col auto-cols-max gap-2 mt-6 place-content-center">
      {currentPage > 1 ? (
        <button
          onClick={() => goToPage(currentPage - 1)}
          className={getBtnClassName(false, false)}
        >
          <ChevronLeft size={16} /> Prev
        </button>
      ) : (
        <span className={getBtnClassName(false, true)}>
          <ChevronLeft size={16} /> Prev
        </span>
      )}

      {getPageNumbers(currentPage, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 py-2 text-text-muted text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={getBtnClassName(p === currentPage, false)}
          >
            {p}
          </button>
        ),
      )}

      {currentPage < totalPages ? (
        <button
          onClick={() => goToPage(currentPage + 1)}
          className={getBtnClassName(false, false)}
        >
          Next <ChevronRight size={16} />
        </button>
      ) : (
        <span className={getBtnClassName(false, true)}>
          Next <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}

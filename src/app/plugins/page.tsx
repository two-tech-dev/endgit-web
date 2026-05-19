import {
  Star,
  Download,
  ShieldCheck,
  Search,
  Tag,
  Zap,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";
import PluginSearch from "@/components/PluginSearch";
import PluginSidebarFilters from "@/components/PluginSidebarFilters";
import PluginCardGrid from "@/components/PluginCardGrid";
import { fetchApi } from "@/lib/api";

import MobileFiltersWrapper from "@/components/MobileFiltersWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Endstone Plugins — EndGit",
  description: "Browse and discover the best plugins for your Endstone server.",
  alternates: {
    canonical: "/plugins",
  },
};

export default async function PluginsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = new URLSearchParams();
  const currentPage = parseInt(searchParams.page as string) || 1;
  query.set("page", currentPage.toString());
  query.set("pageSize", "20");
  if (searchParams.q) query.set("q", searchParams.q as string);
  if (searchParams.category)
    query.set("category", searchParams.category as string);
  if (searchParams.sort) query.set("sort", searchParams.sort as string);
  if (searchParams.type) query.set("type", searchParams.type as string);

  const { data: responseData } = await fetchApi(
    `/api/v1/plugins?${query.toString()}`,
    { revalidate: 120 },
  );
  const realPlugins = responseData?.data?.plugins || [];
  const pagination = responseData?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    pageSize: 20,
  };

  // Build pagination URL helper
  function pageUrl(page: number): string {
    const p = new URLSearchParams();
    p.set("page", page.toString());
    if (searchParams.q) p.set("q", searchParams.q as string);
    if (searchParams.category)
      p.set("category", searchParams.category as string);
    if (searchParams.sort) p.set("sort", searchParams.sort as string);
    if (searchParams.type) p.set("type", searchParams.type as string);
    return `/plugins?${p.toString()}`;
  }

  // Generate page numbers to display
  function getPageNumbers(): (number | "...")[] {
    const totalPages = pagination.totalPages;
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

  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-4)",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <h1 className="heading-2">Releases</h1>
          {pagination.total > 0 && (
            <p
              className="text-muted"
              style={{ fontSize: "0.875rem", marginTop: "var(--space-1)" }}
            >
              Showing {(currentPage - 1) * pagination.pageSize + 1}–
              {Math.min(currentPage * pagination.pageSize, pagination.total)} of{" "}
              {pagination.total} plugins
            </p>
          )}
        </div>
        <div className="desktop-only" style={{ maxWidth: "300px" }}>
          <PluginSearch />
        </div>
      </div>

      <div className="plugins-layout" style={{ display: "flex", gap: "var(--space-6)" }}>
        {/* Sidebar Filters */}
        <MobileFiltersWrapper searchComponent={<PluginSearch />}>
          <PluginSidebarFilters />
        </MobileFiltersWrapper>

        {/* Plugin Grid */}
        <div style={{ flex: 1 }}>
          <PluginCardGrid plugins={realPlugins} />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "var(--space-2)",
                marginTop: "var(--space-1)",
                flexWrap: "wrap",
              }}
            >
              {/* Previous */}
              {currentPage > 1 ? (
                <a
                  href={pageUrl(currentPage - 1)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-card)",
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 150ms",
                  }}
                >
                  <ChevronLeft size={16} /> Prev
                </a>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                >
                  <ChevronLeft size={16} /> Prev
                </span>
              )}

              {/* Page Numbers */}
              {getPageNumbers().map((p, i) =>
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
                  <a
                    key={p}
                    href={pageUrl(p)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      border:
                        p === currentPage
                          ? "1px solid var(--accent-primary)"
                          : "1px solid var(--border-color)",
                      background:
                        p === currentPage
                          ? "rgba(6, 182, 212, 0.1)"
                          : "var(--bg-card)",
                      color:
                        p === currentPage
                          ? "var(--accent-primary)"
                          : "var(--text-secondary)",
                      fontSize: "0.875rem",
                      fontWeight: p === currentPage ? 700 : 500,
                      textDecoration: "none",
                      transition: "all 150ms",
                      minWidth: "38px",
                      textAlign: "center",
                    }}
                  >
                    {p}
                  </a>
                ),
              )}

              {/* Next */}
              {currentPage < pagination.totalPages ? (
                <a
                  href={pageUrl(currentPage + 1)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-card)",
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 150ms",
                  }}
                >
                  Next <ChevronRight size={16} />
                </a>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                >
                  Next <ChevronRight size={16} />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Star, Download, ShieldCheck, Search, Tag, Zap, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import PluginImage from "@/components/PluginImage";
import PluginSearch from "@/components/PluginSearch";
import PluginSidebarFilters from "@/components/PluginSidebarFilters";
import { fetchApi } from "@/lib/api";

import MobileFiltersWrapper from "@/components/MobileFiltersWrapper";

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
  if (searchParams.category) query.set("category", searchParams.category as string);
  if (searchParams.sort) query.set("sort", searchParams.sort as string);
  if (searchParams.type) query.set("type", searchParams.type as string);

  const { data: responseData } = await fetchApi(`/api/v1/plugins?${query.toString()}`);
  const realPlugins = responseData?.data?.plugins || [];
  const pagination = responseData?.pagination || { page: 1, totalPages: 1, total: 0, pageSize: 20 };

  // Build pagination URL helper
  function pageUrl(page: number): string {
    const p = new URLSearchParams();
    p.set("page", page.toString());
    if (searchParams.q) p.set("q", searchParams.q as string);
    if (searchParams.category) p.set("category", searchParams.category as string);
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
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="container" style={{ padding: "var(--space-8) 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <h1 className="heading-2">Releases</h1>
          {pagination.total > 0 && (
            <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "var(--space-1)" }}>
              Showing {(currentPage - 1) * pagination.pageSize + 1}–{Math.min(currentPage * pagination.pageSize, pagination.total)} of {pagination.total} plugins
            </p>
          )}
        </div>
        <div className="desktop-only">
          <PluginSearch />
        </div>
      </div>

      <div className="plugins-layout" style={{ display: "flex", gap: "var(--space-8)" }}>
        {/* Sidebar Filters */}
        <MobileFiltersWrapper searchComponent={<PluginSearch />}>
          <PluginSidebarFilters />
        </MobileFiltersWrapper>

        {/* Plugin Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: "var(--space-6)", alignContent: "start" }}>
            {realPlugins.map((plugin: any) => {
              const avgRating = plugin.stars ? Math.round((plugin.stars / 20) * 10) / 10 : 0; // stars is 0-100 scale
              const isFeatured = plugin.downloads >= 100;

              return (
                <a href={`/plugins/${plugin.slug}`} key={plugin.id} className="card" style={{
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  background: "var(--bg-card)",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}>
                  <div style={{ padding: "var(--space-4)", display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
                    {/* Left: Icon */}
                    <div style={{
                      width: "64px", height: "64px", flexShrink: 0,
                      borderRadius: "var(--radius-md)", overflow: "hidden",
                      background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <PluginImage iconUrl={plugin.iconUrl} repoUrl={plugin.repoUrl} alt={`${plugin.displayName} icon`} />
                    </div>

                    {/* Middle: Title, Version, Author */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="heading-3" style={{ fontSize: "1.125rem", margin: "0 0 4px 0", color: "var(--accent-cyan)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {plugin.displayName}
                      </h3>
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span>v{plugin.latestVersion || "1.0.0"}</span>
                        <span>{plugin.author?.displayName || plugin.author?.username}</span>
                      </div>
                    </div>

                    {/* Right: Date & Stats */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      <span>{new Date(plugin.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      <span>{plugin.downloads.toLocaleString()} downloads</span>
                      {avgRating > 0 && (
                        <span style={{ color: "#f59e0b", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "3px" }}>
                          {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}
                          <span style={{ color: "var(--text-muted)", fontSize: "0.6875rem", marginLeft: "2px" }}>({avgRating})</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Featured Banner (only show if featured/trending) */}
                  {isFeatured && (
                    <div style={{
                      width: "100%",
                      padding: "5px 0",
                      textAlign: "center",
                      background: "linear-gradient(90deg, #059669, #0d9488)",
                      color: "white",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em"
                    }}>
                      ⚡ Featured
                    </div>
                  )}
                </a>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              gap: "var(--space-2)", marginTop: "var(--space-10)",
              flexWrap: "wrap"
            }}>
              {/* Previous */}
              {currentPage > 1 ? (
                <a href={pageUrl(currentPage - 1)} style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)", background: "var(--bg-card)",
                  color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500,
                  textDecoration: "none", transition: "all 150ms"
                }}>
                  <ChevronLeft size={16} /> Prev
                </a>
              ) : (
                <span style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)", background: "var(--bg-secondary)",
                  color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500,
                  opacity: 0.5, cursor: "not-allowed"
                }}>
                  <ChevronLeft size={16} /> Prev
                </span>
              )}

              {/* Page Numbers */}
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} style={{ padding: "0.5rem 0.25rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>…</span>
                ) : (
                  <a key={p} href={pageUrl(p)} style={{
                    padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)",
                    border: p === currentPage ? "1px solid var(--accent-cyan)" : "1px solid var(--border-color)",
                    background: p === currentPage ? "rgba(6, 182, 212, 0.1)" : "var(--bg-card)",
                    color: p === currentPage ? "var(--accent-cyan)" : "var(--text-secondary)",
                    fontSize: "0.875rem", fontWeight: p === currentPage ? 700 : 500,
                    textDecoration: "none", transition: "all 150ms",
                    minWidth: "38px", textAlign: "center"
                  }}>
                    {p}
                  </a>
                )
              )}

              {/* Next */}
              {currentPage < pagination.totalPages ? (
                <a href={pageUrl(currentPage + 1)} style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)", background: "var(--bg-card)",
                  color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500,
                  textDecoration: "none", transition: "all 150ms"
                }}>
                  Next <ChevronRight size={16} />
                </a>
              ) : (
                <span style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)", background: "var(--bg-secondary)",
                  color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500,
                  opacity: 0.5, cursor: "not-allowed"
                }}>
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

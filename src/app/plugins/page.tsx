import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PluginSearch from "@/components/PluginSearch";
import PluginSidebarFilters from "@/components/PluginSidebarFilters";
import PluginCardGrid from "@/components/PluginCardGrid";
import MobileFiltersWrapper from "@/components/MobileFiltersWrapper";
import { fetchApi } from "@/lib/api";
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
  query.set("pageSize", "10");
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
    pageSize: 10,
  };

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
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <Badge
              variant="secondary"
              className="h-6 px-3 text-[0.68rem] tracking-[0.14em] uppercase"
            >
              Endstone Plugins
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Releases
            </h1>
            {pagination.total > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pagination.pageSize + 1}–
                {Math.min(
                  currentPage * pagination.pageSize,
                  pagination.total,
                )}{" "}
                of {pagination.total} plugins
              </p>
            )}
          </div>
          <div className="hidden w-full max-w-xs sm:block">
            <PluginSearch />
          </div>
        </div>
      </header>

      <div className="grid gap-4 xl:h-[calc(100dvh-11rem)] xl:grid-cols-[240px_minmax(0,1fr)] xl:overflow-hidden">
        <aside className="space-y-4 xl:h-full xl:overflow-y-auto">
          <MobileFiltersWrapper searchComponent={<PluginSearch />}>
            <PluginSidebarFilters />
          </MobileFiltersWrapper>
        </aside>

        <main className="flex min-w-0 flex-col gap-4 xl:h-full xl:overflow-y-auto xl:pr-1">
          <PluginCardGrid plugins={realPlugins} />

          {pagination.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
              {currentPage > 1 ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={pageUrl(currentPage - 1)} scroll={false}>
                    <ChevronLeft className="size-3.5" />
                    Prev
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="size-3.5" />
                  Prev
                </Button>
              )}

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="px-1 text-xs text-muted-foreground"
                  >
                    …
                  </span>
                ) : p === currentPage ? (
                  <Button key={p} size="sm" disabled className="min-w-[32px]">
                    {p}
                  </Button>
                ) : (
                  <Button
                    key={p}
                    variant="outline"
                    size="sm"
                    asChild
                    className="min-w-[32px]"
                  >
                    <Link href={pageUrl(p)} scroll={false}>
                      {p}
                    </Link>
                  </Button>
                ),
              )}

              {currentPage < pagination.totalPages ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={pageUrl(currentPage + 1)} scroll={false}>
                    Next
                    <ChevronRight className="size-3.5" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next
                  <ChevronRight className="size-3.5" />
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

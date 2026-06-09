import PluginSearch from "@/components/PluginSearch";
import PluginSidebarFilters from "@/components/PluginSidebarFilters";
import PluginCardGrid from "@/components/PluginCardGrid";
import PluginPagination from "@/components/PluginPagination";
import { fetchApi } from "@/lib/api";

import MobileFiltersWrapper from "@/components/MobileFiltersWrapper";
import { Metadata } from "next";
import { Suspense } from "react";

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
  query.set("pageSize", "12");
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
    pageSize: 12,
  };

  return (
    <div className="container py-8 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] justify-between items-start mb-6 gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-brand">Marketplace</p>
          <h1 className="heading-2">Releases</h1>
          {pagination.total > 0 && (
            <p className="text-text-muted text-sm mt-1">
              Showing {(currentPage - 1) * pagination.pageSize + 1}–
              {Math.min(currentPage * pagination.pageSize, pagination.total)} of{" "}
              {pagination.total} plugins
            </p>
          )}
        </div>
        <div className="hidden lg:block w-full max-w-[360px]">
          <PluginSearch />
        </div>
      </div>

      <div className="plugins-layout grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        {/* Sidebar Filters */}
        <MobileFiltersWrapper searchComponent={<PluginSearch />}>
          <PluginSidebarFilters />
        </MobileFiltersWrapper>

        {/* Plugin Grid */}
        <div id="plugin-grid" className="flex-1">
          <PluginCardGrid plugins={realPlugins} />

          {pagination.totalPages > 1 && (
            <Suspense>
              <PluginPagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

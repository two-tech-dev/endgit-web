import { fetchApi } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { BuildsTableClient } from "./BuildsTableClient";

export const dynamic = "force-dynamic";

export default async function PluginBuildsPage({
  params,
}: {
  params: { slug: string };
}) {
  const [buildsRes, session] = await Promise.all([
    fetchApi(`/api/v1/builds/plugin/${params.slug}?page=1&pageSize=10`, {
      noAuth: true,
    }),
    getServerSession(authOptions),
  ]);

  const plugin = buildsRes.data?.data?.plugin || null;
  const builds = buildsRes.data?.data?.builds || [];
  const pagination = buildsRes.data?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    pageSize: 10,
  };

  if (!plugin) return notFound();

  const isOwner = session?.user?.id === plugin.authorId;

  return (
    <BuildsTableClient
      slug={params.slug}
      plugin={plugin}
      initialBuilds={builds}
      initialPagination={pagination}
      isOwner={isOwner}
    />
  );
}

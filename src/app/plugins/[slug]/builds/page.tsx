import { fetchApi } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { BuildsTableClient } from "./BuildsTableClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: `Builds - ${params.slug} - EndGit`,
    description: `View build history for the ${params.slug} plugin.`,
  };
}

export default async function PluginBuildsPage({
  params,
}: {
  params: { slug: string };
}) {
  const [buildsRes, session] = await Promise.all([
    fetchApi(`/api/v1/builds/plugin/${params.slug}?page=1&pageSize=10`),
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

  const sessionUsername = (session?.user as any)?.username;
  const pluginAuthorUsername = plugin.author?.username;
  const isOwner =
    !!sessionUsername &&
    !!pluginAuthorUsername &&
    sessionUsername === pluginAuthorUsername;

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

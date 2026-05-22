import { Search, Star, Download } from "lucide-react";
import PluginImage from "@/components/PluginImage";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `Plugins by ${params.username} - EndGit`,
    description: `Browse all Endstone plugins published by ${params.username}.`,
  };
}

function formatDownloads(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function AuthorPluginsPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  const { data: responseData } = await fetchApi(
    `/api/v1/plugins?author=${username}`,
    { revalidate: 120 },
  );
  const realPlugins = responseData?.data?.plugins || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Plugins by{" "}
          <span className="text-primary">{username}</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Viewing all {realPlugins.length} plugins created by this author.
        </p>
      </div>

      {realPlugins.length === 0 ? (
        <Card className="rounded-2xl border border-border/70 bg-card/80">
          <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
            <Search size={32} className="text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold">No plugins found</h3>
            <p className="text-muted-foreground">
              This author has not published any plugins yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid min-w-0 auto-rows-min content-start gap-4">
          {realPlugins.map((plugin: any) => {
            const repoOwner = plugin.repoUrl?.match(
              /github\.com\/([^/]+)/,
            )?.[1];

            return (
              <Link
                key={plugin.id}
                href={`/plugins/${plugin.slug}`}
                className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="flex h-full cursor-pointer flex-col rounded-2xl border border-border/70 bg-card/85 transition-all hover:-translate-y-0.5 hover:border-primary/35">
                  <CardHeader className="gap-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      <div className="flex items-center gap-2">
                        {plugin.iconUrl ? (
                          <div className="size-7 shrink-0 overflow-hidden rounded-md border border-border">
                            <PluginImage
                              iconUrl={plugin.iconUrl}
                              repoUrl={plugin.repoUrl}
                              alt={`${plugin.displayName} icon`}
                            />
                          </div>
                        ) : null}
                        <CardTitle className="wrap-break-word text-balance text-base sm:text-lg">
                          {plugin.displayName}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {plugin.latestVersion && (
                          <Badge variant="outline">
                            v{plugin.latestVersion}
                          </Badge>
                        )}
                        {plugin.isFeatured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                      <span>
                        {repoOwner ||
                          plugin.author?.displayName ||
                          plugin.author?.username}
                      </span>
                      <span>
                        {new Date(plugin.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3.5" />
                        {plugin.stars ?? 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Download className="size-3.5" />
                        {formatDownloads(plugin.downloads ?? 0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-primary">
                      Open
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

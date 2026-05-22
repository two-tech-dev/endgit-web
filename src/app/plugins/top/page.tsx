import { Trophy, Download } from "lucide-react";
import PluginImage from "@/components/PluginImage";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Top Plugins - EndGit",
  description: "The most downloaded Endstone plugins on EndGit.",
};

const rankColors: Record<number, string> = {
  0: "bg-yellow-400 text-yellow-950",
  1: "bg-slate-300 text-slate-900",
  2: "bg-amber-600 text-amber-50",
};

export default async function TopPluginsPage() {
  let plugins: any[] = [];
  try {
    const { data: responseData } = await fetchApi(
      "/api/v1/plugins?sort=downloads&order=desc&pageSize=50",
      { revalidate: 300 },
    );
    plugins = responseData?.data?.plugins || [];
  } catch {
    plugins = [];
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/plugins">← Back to Plugins</Link>
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Top Plugins
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          The most downloaded Endstone plugins of all time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plugins.map((plugin: any, index: number) => (
          <Link
            href={`/plugins/${plugin.slug}`}
            key={plugin.id}
            className="no-underline"
          >
            <Card className="flex h-full cursor-pointer flex-col rounded-2xl border border-border/70 bg-card/85 pb-0 transition-all hover:-translate-y-0.5 hover:border-primary/35">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  <PluginImage
                    iconUrl={plugin.iconUrl}
                    repoUrl={plugin.repoUrl}
                    alt={`${plugin.displayName} icon`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg leading-tight text-foreground">
                    {plugin.displayName}
                  </CardTitle>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {plugin.description}
                  </p>
                </div>
                <Badge
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankColors[index] ?? "bg-white/10 text-white"}`}
                >
                  {index + 1}
                </Badge>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between border-t border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Download size={14} />
                  {plugin.downloads?.toLocaleString() ?? 0}
                </span>
                <span>
                  By{" "}
                  {(() => {
                    const repoOwner =
                      plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
                    return (
                      repoOwner ||
                      plugin.author?.displayName ||
                      plugin.author?.username ||
                      "Unknown"
                    );
                  })()}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

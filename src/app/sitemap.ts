import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://endgit.dev";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Fetch all approved plugins — use revalidate instead of no-store
  // so the sitemap can be statically generated at build time
  let plugins: any[] = [];
  try {
    const res = await fetch(`${apiUrl}/api/v1/plugins?pageSize=1000`, {
      next: { revalidate: 3600 }, // re-generate hourly
    });
    const json = await res.json();
    if (json?.data?.plugins) {
      plugins = json.data.plugins;
    }
  } catch (error) {
    console.error("Failed to fetch plugins for sitemap:", error);
  }

  // Create entries for each plugin
  const pluginEntries: MetadataRoute.Sitemap = plugins.map((plugin) => ({
    url: `${baseUrl}/plugins/${plugin.slug}`,
    lastModified: new Date(plugin.updatedAt || plugin.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/plugins`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...pluginEntries,
  ];
}

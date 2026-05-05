import { MetadataRoute } from 'next';
import { fetchApi } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://endgit.dev';

  // Fetch all approved plugins
  let plugins: any[] = [];
  try {
    const { data } = await fetchApi('/api/v1/plugins?pageSize=1000');
    if (data?.data?.plugins) {
      plugins = data.data.plugins;
    }
  } catch (error) {
    console.error('Failed to fetch plugins for sitemap:', error);
  }

  // Create entries for each plugin
  const pluginEntries: MetadataRoute.Sitemap = plugins.map((plugin) => ({
    url: `${baseUrl}/plugins/${plugin.slug}`,
    lastModified: new Date(plugin.updatedAt || plugin.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/plugins`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...pluginEntries,
  ];
}

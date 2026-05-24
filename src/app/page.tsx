import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EndGit - Plugin Registry for Endstone",
  description:
    "Discover, build and distribute plugins for Endstone. The official plugin registry with automated CI/CD.",
};

function HomeSkeleton() {
  return (
    <div className="container py-10">
      <div className="space-y-4 mb-12">
        <div className="skeleton h-10 w-3/4 max-w-[500px]" />
        <div className="skeleton h-5 w-1/2 max-w-[400px]" />
        <div className="skeleton h-12 w-full max-w-[400px] mt-6" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="skeleton-card p-4 flex items-center gap-4">
              <div className="skeleton w-12 h-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-1/2" />
                <div className="skeleton h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card p-4 flex items-center gap-3">
              <div className="skeleton w-10 h-10 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function HomeData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  let hotPlugins: any[] = [];
  let newPlugins: any[] = [];
  let topPlugins: any[] = [];
  let featuredPlugins: any[] = [];

  try {
    const [hotRes, newRes, topRes, featuredRes] = await Promise.all([
      fetch(`${apiUrl}/api/v1/plugins?sort=hot&pageSize=4`, {
        next: { revalidate: 60 },
      }),
      fetch(`${apiUrl}/api/v1/plugins?sort=date&pageSize=5`, {
        next: { revalidate: 60 },
      }),
      fetch(`${apiUrl}/api/v1/plugins?sort=downloads&order=desc&pageSize=5`, {
        next: { revalidate: 60 },
      }),
      fetch(`${apiUrl}/api/v1/plugins?isFeatured=true&pageSize=4`, {
        next: { revalidate: 60 },
      }),
    ]);

    const [hotJson, newJson, topJson, featuredJson] = await Promise.all([
      hotRes.json(),
      newRes.json(),
      topRes.json(),
      featuredRes.json(),
    ]);

    hotPlugins = hotJson?.data?.plugins || [];
    newPlugins = newJson?.data?.plugins || [];
    topPlugins = topJson?.data?.plugins || [];
    featuredPlugins = featuredJson?.data?.plugins || [];
  } catch {}

  return (
    <HomeContent
      hotPlugins={hotPlugins}
      newPlugins={newPlugins}
      topPlugins={topPlugins}
      featuredPlugins={featuredPlugins}
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeData />
    </Suspense>
  );
}

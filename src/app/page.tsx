import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EndGit - Plugin Registry for Endstone",
  description:
    "Discover, build and distribute plugins for Endstone. The official plugin registry with automated CI/CD pipeline.",
  keywords: [
    "Endstone plugins",
    "Minecraft Bedrock plugins",
    "plugin registry",
    "Endstone CI/CD",
    "Bedrock server plugins",
    "EndGit",
  ],
  openGraph: {
    title: "EndGit - Plugin Registry for Endstone",
    description:
      "Discover, build and distribute plugins for Endstone. The official plugin registry with automated CI/CD pipeline.",
    type: "website",
    url: "https://endgit.dev",
  },
  twitter: {
    card: "summary",
    title: "EndGit - Plugin Registry for Endstone",
    description:
      "Discover, build and distribute plugins for Endstone. The official plugin registry with automated CI/CD pipeline.",
  },
  alternates: {
    canonical: "/",
  },
};

function HomeSkeleton() {
  return (
    <div className="container py-10">
      <div className="space-y-4 mb-12">
        <div className="skeleton h-10 w-3/4 max-w-125" />
        <div className="skeleton h-5 w-1/2 max-w-100" />
        <div className="skeleton h-12 w-full max-w-100 mt-6" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="skeleton-card p-4 flex items-center gap-4">
              <div className="skeleton w-12 h-12 shrink-0 rounded-sm" />
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
              <div className="skeleton w-10 h-10 shrink-0 rounded-sm" />
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

import { fetchGraphQL } from "@/lib/api";

const GET_HOME_PLUGINS = `
  query GetHomePlugins {
    homePlugins {
      hotPlugins { id name slug displayName description iconUrl pluginType downloads commentCount isFeatured isPreRelease latestVersion author { username displayName avatarUrl } }
      newPlugins { id name slug displayName description iconUrl pluginType downloads commentCount isFeatured isPreRelease latestVersion author { username displayName avatarUrl } }
      topPlugins { id name slug displayName description iconUrl pluginType downloads commentCount isFeatured isPreRelease latestVersion author { username displayName avatarUrl } }
      featuredPlugins { id name slug displayName description iconUrl pluginType downloads commentCount isFeatured isPreRelease latestVersion author { username displayName avatarUrl } }
    }
  }
`;

async function HomeData() {
  let hotPlugins: any[] = [];
  let newPlugins: any[] = [];
  let topPlugins: any[] = [];
  let featuredPlugins: any[] = [];

  try {
    const { data } = await fetchGraphQL(
      GET_HOME_PLUGINS,
      {},
      { revalidate: 60, noAuth: true },
    );
    if (data?.homePlugins) {
      hotPlugins = data.homePlugins.hotPlugins || [];
      newPlugins = data.homePlugins.newPlugins || [];
      topPlugins = data.homePlugins.topPlugins || [];
      featuredPlugins = data.homePlugins.featuredPlugins || [];
    }
  } catch (err) {
    console.error("Failed to load home plugins:", err);
  }

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

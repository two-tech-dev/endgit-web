import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";
import LatestPluginsSection from "@/components/LatestPluginsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EndGit - Plugin Registry for Endstone",
  description:
    "The official plugin registry for Endstone. Push to GitHub, get compiled builds, and install with one command.",
};

function HeroSkeleton() {
  return (
    <div className="grid">
      <section className="pt-15 pb-20 lg:pt-16 lg:pb-32 relative overflow-x-clip">
        <div className="absolute -top-[20%] -left-[10%] w-[1000px] h-[1400px] bg-brand/5 blur-[160px] rounded-full pointer-events-none" />
        <div className="container grid items-center gap-16 lg:gap-20 xl:gap-28 lg:grid-cols-[1.6fr_0.8fr] relative z-10">
          {/* Left skeleton */}
          <div className="min-w-0">
            <div className="skeleton w-24 h-5 mb-8" />
            <div className="space-y-3 mb-8">
              <div className="skeleton h-12 w-3/4" />
              <div className="skeleton h-12 w-1/2" />
              <div className="skeleton h-12 w-2/3" />
            </div>
            <div className="space-y-2 mb-10">
              <div className="skeleton h-5 w-full max-w-[500px]" />
              <div className="skeleton h-5 w-4/5 max-w-[400px]" />
            </div>
            <div className="flex gap-5">
              <div className="skeleton h-14 w-44" />
              <div className="skeleton h-14 w-36" />
            </div>
            <div className="flex gap-12 mt-12 pt-8 border-t border-white/5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-2">
                  <div className="skeleton h-9 w-16" />
                  <div className="skeleton h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
          {/* Right skeleton (carousel area, desktop only) */}
          <div className="hidden lg:flex flex-col gap-3">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex gap-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="skeleton-card w-[380px] shrink-0 p-4 flex items-center gap-4 rounded-sm"
                  >
                    <div className="skeleton w-14 h-14 shrink-0 rounded-sm" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-5 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

async function StatsSection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  let stats = {
    plugins: 0,
    downloads: "—" as string | number,
    builds: "—" as string | number,
  };
  let topPlugins: any[] = [];

  try {
    const [statsRes, pluginsRes] = await Promise.all([
      fetch(`${apiUrl}/api/v1/plugins/stats/global`, {
        next: { revalidate: 60 },
      }),
      fetch(`${apiUrl}/api/v1/plugins?sort=downloads&order=desc&pageSize=10`, {
        next: { revalidate: 60 },
      }),
    ]);
    const statsJson = await statsRes.json();
    stats = statsJson?.data || stats;
    const pluginsJson = await pluginsRes.json();
    topPlugins = pluginsJson?.data?.plugins || [];
  } catch {
    // use defaults
  }

  return (
    <HomeContent stats={stats} plugins={topPlugins}>
      <LatestPluginsSection />
    </HomeContent>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <StatsSection />
    </Suspense>
  );
}

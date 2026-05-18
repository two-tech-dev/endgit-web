import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";
import HomeSkeleton from "@/components/HomeSkeleton";

async function StatsSection() {
  let stats = {
    plugins: 0,
    downloads: "—" as string | number,
    builds: "—" as string | number,
  };
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/plugins/stats/global`, {
      cache: "no-store",
    });
    const json = await res.json();
    stats = json?.data || stats;
  } catch {
    // use defaults
  }
  return <HomeContent stats={stats} />;
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <StatsSection />
    </Suspense>
  );
}

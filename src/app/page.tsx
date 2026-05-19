import HomeContent from "@/components/HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EndGit - Plugin Registry for Endstone",
  description:
    "The official plugin registry for Endstone. Push to GitHub, get compiled builds, and install with one command.",
};

async function StatsSection() {
  let stats = {
    plugins: 0,
    downloads: "—" as string | number,
    builds: "—" as string | number,
  };
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/plugins/stats/global`, {
      next: { revalidate: 60 },
    });
    const json = await res.json();
    stats = json?.data || stats;
  } catch {
    // use defaults
  }
  return <HomeContent stats={stats} />;
}

export default function Home() {
  return <StatsSection />;
}

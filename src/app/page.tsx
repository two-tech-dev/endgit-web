import HomeContent from "@/components/HomeContent";

async function getStats() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/plugins/stats/global`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json?.data || { plugins: 0, downloads: "—", builds: "—" };
  } catch {
    return { plugins: 0, downloads: "—", builds: "—" };
  }
}

export default async function Home() {
  const stats = await getStats();
  return <HomeContent stats={stats} />;
}

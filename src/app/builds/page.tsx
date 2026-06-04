import BuildsList from "@/components/BuildList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Builds - EndGit",
  description: "View recent plugin builds across the Endstone ecosystem.",
  alternates: {
    canonical: "/builds",
  },
};

async function getTodayBuilds() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const res = await fetch(`${apiUrl}/api/v1/builds/recent?limit=50`, {
      next: { revalidate: 10 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function utcDateStr(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function BuildsPage() {
  const allBuilds = await getTodayBuilds();
  const today = todayUTC();

  return (
    <div className="container pt-8 lg:pt-10 pb-16">
      <BuildsList builds={allBuilds} today={today} />
    </div>
  );
}

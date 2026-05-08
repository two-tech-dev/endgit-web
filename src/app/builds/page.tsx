import BuildsList from "@/components/BuildList";

async function getTodayBuilds() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const res = await fetch(
      `${apiUrl}/api/v1/builds/recent?limit=50`,
      { cache: "no-store" }
    );

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

  const builds = allBuilds.filter(
    (b: any) => utcDateStr(b.createdAt) === today
  );

  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-16)",
      }}
    >
      <BuildsList builds={builds} today={today} />
    </div>
  );
}
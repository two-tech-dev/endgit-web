"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface AnalyticsData {
  date: string;
  downloads: number;
  views: number;
}

export default function PluginAnalyticsChart({ slug }: { slug: string }) {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/plugins/${slug}/analytics`,
        );
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          setData(
            json.data.map((d: any) => ({
              date: new Date(d.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              downloads: d.downloads,
              views: d.views || 0,
            })),
          );
        }
      } catch {
        // No data available
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [slug]);

  if (loading) {
    return (
      <div
        className="card"
        style={{
          padding: "var(--space-6)",
          height: "280px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Loading analytics...
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className="card"
        style={{ padding: "var(--space-6)", textAlign: "center" }}
      >
        <BarChart3
          size={24}
          color="var(--text-muted)"
          style={{ margin: "0 auto var(--space-2)" }}
        />
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          No download analytics available yet
        </p>
      </div>
    );
  }

  const totalDownloads = data.reduce((sum, d) => sum + d.downloads, 0);

  return (
    <div className="card" style={{ padding: "var(--space-6)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-5)",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            color: "var(--text-primary)",
          }}
        >
          <BarChart3 size={18} color="var(--accent-cyan)" /> Downloads (Last 30
          Days)
        </h3>
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--accent-cyan)",
          }}
        >
          {totalDownloads.toLocaleString()}
        </span>
      </div>

      <div style={{ width: "100%", height: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "none",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "0.8125rem",
                padding: "8px 12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
            />
            <Area
              type="monotone"
              dataKey="downloads"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#colorDownloads)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#0ea5e9",
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

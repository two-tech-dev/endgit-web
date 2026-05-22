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
  const [error, setError] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(false);
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
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [slug]);

  if (loading) {
    return (
      <div className="card p-6 h-[280px] flex items-center justify-center">
        <p className="text-text-muted text-sm">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card p-6 text-center">
        <BarChart3
          size={24}
          className="text-text-muted mx-auto mb-2"
        />
        <p className="text-text-muted text-sm">
          {error
            ? "Failed to load analytics data."
            : "No download analytics available yet"}
        </p>
        {error && (
          <button
            onClick={fetchAnalytics}
            className="btn btn-secondary mt-3 text-[0.8125rem] py-1.5 px-4"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  const totalDownloads = data.reduce((sum, d) => sum + d.downloads, 0);

  return (
    <div className="card p-6">
      <div className="chart-header flex justify-between items-center mb-5 flex-wrap gap-2">
        <h3 className="text-base font-semibold flex items-center gap-2 text-text-primary">
          <BarChart3 size={18} className="text-accent" /> Downloads (Last 30 Days)
        </h3>
        <span className="text-xl font-bold text-accent">
          {totalDownloads.toLocaleString()}
        </span>
      </div>

      <div className="w-full h-[220px]">
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

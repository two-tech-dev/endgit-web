"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PluginSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (search !== currentQ) {
        const params = new URLSearchParams(searchParams.toString());
        if (search) params.set("q", search);
        else params.delete("q");
        params.delete("page");
        router.push(`?${params.toString()}`, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, router, searchParams]);

  // Sync state with URL when it changes externally (e.g. from another search input or back button)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== search) {
      setSearch(q);
    }
  }, [searchParams]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Search
        style={{
          position: "absolute",
          left: "var(--space-3)",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
        }}
        size={18}
      />
      <input
        className="input"
        placeholder="Search plugins..."
        style={{ paddingLeft: "var(--space-10)", width: "100%" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

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
      if (search !== (searchParams.get("q") || "")) {
        const params = new URLSearchParams(searchParams.toString());
        if (search) params.set("q", search);
        else params.delete("q");
        params.delete("page");
        router.push(`?${params.toString()}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, router, searchParams]);

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <Search style={{ position: "absolute", left: "var(--space-3)", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
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

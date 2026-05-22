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
    <div className="relative w-full">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        size={18}
      />
      <input
        className="input pl-10 w-full"
        placeholder="Search plugins..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

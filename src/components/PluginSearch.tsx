"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function PluginSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const isTyping = useRef(false);

  // Sync external URL changes to local state, ONLY if user is not actively typing
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== search && !isTyping.current) {
      setSearch(q);
    }
  }, [searchParams]);

  // Handle typing with a simple debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      isTyping.current = false; // Reset typing flag after debounce finishes
      const currentQ = searchParams.get("q") || "";
      
      // Only push to router if the value actually changed
      if (search !== currentQ) {
        const params = new URLSearchParams(searchParams.toString());
        if (search) params.set("q", search);
        else params.delete("q");
        params.delete("page"); // Reset to page 1 on new search
        router.push(`?${params.toString()}`, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search, router]); // Remove searchParams from dependencies to avoid loop

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isTyping.current = true;
    setSearch(e.target.value);
  };

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
        onChange={handleChange}
      />
    </div>
  );
}

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { PLUGIN_CATEGORIES } from "@/lib/constants";

export default function PluginSidebarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "downloads";
  const currentType = searchParams.get("type") || "";

  const sortOptions = [
    { value: "trending", label: "Trending" },
    { value: "downloads", label: "Most Downloaded" },
    { value: "stars", label: "Highest Rated" },
    { value: "date", label: "Newest" },
    { value: "name", label: "A-Z" },
  ];

  return (
    <aside className="sidebar-filters w-[250px] shrink-0 grid gap-6">
      <div className="card p-4">
        <h3 className="font-semibold mb-3 text-text-primary">Categories</h3>
        <select
          className="input w-full p-2 rounded-sm border border-border bg-surface-secondary text-text-primary cursor-pointer"
          value={currentCategory}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {PLUGIN_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3 text-text-primary">Sort By</h3>
        <ul className="grid gap-2 p-0 m-0">
          {sortOptions.map((opt) => (
            <li
              key={opt.value}
              onClick={() => updateFilter("sort", opt.value)}
              className={`cursor-pointer transition-colors ${
                currentSort === opt.value
                  ? "text-brand font-semibold"
                  : "text-text-secondary font-normal hover:text-brand"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3 text-text-primary">Type</h3>
        <ul className="grid gap-2 p-0 m-0">
          <li className="flex items-center gap-2 text-text-secondary">
            <input
              type="radio"
              name="type"
              id="type-all"
              checked={currentType === ""}
              onChange={() => updateFilter("type", "")}
              className="accent-brand"
            />
            <label htmlFor="type-all" className="cursor-pointer">
              All Types
            </label>
          </li>
          <li className="flex items-center gap-2 text-text-secondary">
            <input
              type="radio"
              name="type"
              id="type-python"
              checked={currentType === "PYTHON"}
              onChange={() => updateFilter("type", "PYTHON")}
              className="accent-brand"
            />
            <label htmlFor="type-python" className="cursor-pointer">
              Python (.whl)
            </label>
          </li>
          <li className="flex items-center gap-2 text-text-secondary">
            <input
              type="radio"
              name="type"
              id="type-cpp"
              checked={currentType === "CPP"}
              onChange={() => updateFilter("type", "CPP")}
              className="accent-brand"
            />
            <label htmlFor="type-cpp" className="cursor-pointer">
              C++ (.so)
            </label>
          </li>
        </ul>
      </div>
    </aside>
  );
}

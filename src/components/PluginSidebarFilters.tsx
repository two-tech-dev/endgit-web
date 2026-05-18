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
    <aside
      className="sidebar-filters"
      style={{
        width: "250px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div className="card" style={{ padding: "var(--space-4)" }}>
        <h3
          style={{
            fontWeight: 600,
            marginBottom: "var(--space-3)",
            color: "var(--text-primary)",
          }}
        >
          Categories
        </h3>
        <select
          className="input"
          value={currentCategory}
          onChange={(e) => updateFilter("category", e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          <option value="">All Categories</option>
          {PLUGIN_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="card" style={{ padding: "var(--space-4)" }}>
        <h3
          style={{
            fontWeight: 600,
            marginBottom: "var(--space-3)",
            color: "var(--text-primary)",
          }}
        >
          Sort By
        </h3>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {sortOptions.map((opt) => (
            <li
              key={opt.value}
              onClick={() => updateFilter("sort", opt.value)}
              style={{
                color:
                  currentSort === opt.value
                    ? "var(--accent-primary)"
                    : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: currentSort === opt.value ? 600 : 400,
                transition: "color 0.2s",
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ padding: "var(--space-4)" }}>
        <h3
          style={{
            fontWeight: 600,
            marginBottom: "var(--space-3)",
            color: "var(--text-primary)",
          }}
        >
          Type
        </h3>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <li
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              color: "var(--text-secondary)",
            }}
          >
            <input
              type="radio"
              name="type"
              id="type-all"
              checked={currentType === ""}
              onChange={() => updateFilter("type", "")}
              style={{ accentColor: "var(--accent-primary)" }}
            />
            <label htmlFor="type-all" style={{ cursor: "pointer" }}>
              All Types
            </label>
          </li>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              color: "var(--text-secondary)",
            }}
          >
            <input
              type="radio"
              name="type"
              id="type-python"
              checked={currentType === "PYTHON"}
              onChange={() => updateFilter("type", "PYTHON")}
              style={{ accentColor: "var(--accent-primary)" }}
            />
            <label htmlFor="type-python" style={{ cursor: "pointer" }}>
              Python (.whl)
            </label>
          </li>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              color: "var(--text-secondary)",
            }}
          >
            <input
              type="radio"
              name="type"
              id="type-cpp"
              checked={currentType === "CPP"}
              onChange={() => updateFilter("type", "CPP")}
              style={{ accentColor: "var(--accent-primary)" }}
            />
            <label htmlFor="type-cpp" style={{ cursor: "pointer" }}>
              C++ (.so)
            </label>
          </li>
        </ul>
      </div>
    </aside>
  );
}

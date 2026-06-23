"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { PLUGIN_CATEGORIES } from "@/lib/constants";
import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="card overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="grid w-full grid-cols-[1fr_auto] items-center border-b border-border px-4 py-3 text-left font-semibold text-text-primary"
      >
        {title}
        <ChevronDown
          size={15}
          className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="p-4">{children}</div>}
    </section>
  );
}

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
    { value: "hot", label: "Hottest" },
    { value: "downloads", label: "Most Downloaded" },
    { value: "comments", label: "Most Discussed" },
    { value: "date", label: "Newest" },
    { value: "name", label: "A-Z" },
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "PYTHON", label: "Python (.whl)" },
    { value: "CPP", label: "C++ (.so)" },
  ];

  return (
    <aside className="sidebar-filters grid w-full shrink-0 gap-3 lg:w-[250px] lg:max-h-full lg:overflow-y-auto lg:pr-1 lg:[scrollbar-width:thin]">
      <FilterSection title="Categories">
        <select
          className="input w-full cursor-pointer rounded-sm border border-border bg-surface-secondary p-2 text-text-primary"
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
      </FilterSection>

      <FilterSection title="Sort By">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {sortOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => updateFilter("sort", opt.value)}
              className={`rounded-sm border px-3 py-2 text-left text-sm transition-colors ${
                currentSort === opt.value
                  ? "border-[#1890ff]/45 bg-[#1890ff]/15 text-[#1890ff] "
                  : "border-border bg-surface text-text-secondary hover:border-[#1890ff]/40 hover:bg-[#1890ff]/10 hover:text-text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Type">
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((opt) => (
            <button
              type="button"
              key={opt.value || "all"}
              onClick={() => updateFilter("type", opt.value)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                currentType === opt.value
                  ? "border-[#1890ff]/50 bg-[#1890ff]/15 text-[#1890ff] "
                  : "border-border bg-surface text-text-secondary hover:border-[#1890ff]/40 hover:bg-[#1890ff]/10 hover:text-text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}

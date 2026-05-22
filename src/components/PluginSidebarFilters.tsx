"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Zap } from "lucide-react";
import { PLUGIN_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    { value: "downloads", label: "Downloads" },
    { value: "stars", label: "Stars" },
    { value: "date", label: "Newest" },
    { value: "name", label: "A-Z" },
  ];

  const typeOptions = [
    { value: "", label: "All" },
    { value: "PYTHON", label: "Python" },
    { value: "CPP", label: "C++" },
  ];

  return (
    <>
      <Card className="border border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Filter className="size-4" />
            Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
            {typeOptions.map((type) => (
              <Button
                key={type.value}
                type="button"
                size="sm"
                variant={currentType === type.value ? "default" : "ghost"}
                onClick={() => updateFilter("type", type.value)}
                className="h-8 justify-center xl:justify-start"
              >
                {type.label}
              </Button>
            ))}
          </div>
          <div className="space-y-1 pt-1">
            <p className="text-xs text-muted-foreground">Sort</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
              {sortOptions.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  size="sm"
                  variant={currentSort === opt.value ? "default" : "ghost"}
                  onClick={() => updateFilter("sort", opt.value)}
                  className="h-8 justify-center"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Zap className="size-4" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-64 space-y-3 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1">
            <Button
              type="button"
              size="sm"
              variant={!currentCategory ? "default" : "ghost"}
              onClick={() => updateFilter("category", "")}
              className="h-8 justify-center xl:justify-start"
            >
              All
            </Button>
            {PLUGIN_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                type="button"
                size="sm"
                variant={currentCategory === cat ? "default" : "ghost"}
                onClick={() => updateFilter("category", cat)}
                className="h-8 justify-center xl:justify-start"
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

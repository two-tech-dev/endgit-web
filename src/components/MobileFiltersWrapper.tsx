"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileFiltersWrapper({
  children,
  searchComponent,
}: {
  children: React.ReactNode;
  searchComponent?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mb-4 w-full sm:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 w-full gap-2"
        >
          <SlidersHorizontal className="size-4" />
          {isOpen ? "Hide Filters" : "Filters & Search"}
        </Button>
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } space-y-4 sm:block`}
      >
        {searchComponent && (
          <div className="mb-4 w-full sm:hidden">{searchComponent}</div>
        )}
        {children}
      </div>
    </>
  );
}

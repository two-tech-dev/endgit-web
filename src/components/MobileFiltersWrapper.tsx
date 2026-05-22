"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

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
      <div className="md:hidden mb-4 w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-secondary flex items-center gap-2 w-full justify-center p-3"
        >
          <SlidersHorizontal size={18} />{" "}
          {isOpen ? "Hide Filters & Search" : "Show Filters & Search"}
        </button>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} md:block w-full md:w-[250px] shrink-0`}>
        {searchComponent && (
          <div className="md:hidden mb-4 w-full">
            {searchComponent}
          </div>
        )}
        {children}
      </div>
    </>
  );
}

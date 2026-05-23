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
      <div className="lg:hidden mb-6 mt-2 w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-secondary grid grid-flow-col place-items-center gap-2 w-full p-3"
        >
          <SlidersHorizontal size={18} />{" "}
          {isOpen ? "Hide Filters & Search" : "Show Filters & Search"}
        </button>
      </div>

      <div
        className={`${isOpen ? "block" : "hidden"} lg:block w-full lg:w-[250px] shrink-0`}
      >
        {searchComponent && (
          <div className="lg:hidden mb-6 w-full">{searchComponent}</div>
        )}
        {children}
      </div>
    </>
  );
}

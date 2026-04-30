"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function MobileFiltersWrapper({ 
  children, 
  searchComponent 
}: { 
  children: React.ReactNode, 
  searchComponent?: React.ReactNode 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mobile-only" style={{ marginBottom: "var(--space-4)", width: "100%" }}>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="btn btn-secondary" 
          style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center", padding: "0.75rem" }}
        >
          <SlidersHorizontal size={18} /> {isOpen ? "Hide Filters & Search" : "Show Filters & Search"}
        </button>
      </div>
      
      <div className={`mobile-filters-container ${isOpen ? "open" : ""}`}>
        {searchComponent && (
          <div className="mobile-only mobile-search" style={{ marginBottom: "var(--space-4)", width: "100%" }}>
            {searchComponent}
          </div>
        )}
        {children}
      </div>
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Version {
  id: string;
  version: string;
  fileSize: number;
  createdAt: string | number;
}

const parseDate = (dateVal: string | number) => {
  if (!dateVal) return "Unknown";
  const d = new Date(Number.isNaN(Number(dateVal)) ? dateVal : Number(dateVal));
  return isNaN(d.getTime()) ? "Unknown" : d.toLocaleDateString();
};

interface Props {
  slug: string;
  pluginType?: string;
  versions: Version[];
}

export default function VersionSelector({
  slug,
  pluginType = "PYTHON",
  versions,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeVersionStr = searchParams.get("v");
  const [selectedVersionStr, setSelectedVersionStr] = useState(
    activeVersionStr || versions[0]?.version,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  if (!versions || versions.length === 0) {
    return (
      <div className="grid gap-2 justify-items-end">
        <button className="btn btn-primary opacity-50" disabled>
          No versions available
        </button>
      </div>
    );
  }

  const selectedVersion =
    versions.find((v) => v.version === selectedVersionStr) || versions[0];

  const handleVersionChange = (newVersionStr: string) => {
    setSelectedVersionStr(newVersionStr);
    const params = new URLSearchParams(searchParams.toString());
    params.set("v", newVersionStr);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col items-end gap-1.5 w-full shrink-0">
      <div className="flex items-center gap-2">
        <select
          value={selectedVersion.version}
          onChange={(e) => handleVersionChange(e.target.value)}
          className="hidden md:block px-4 py-2.5 rounded-full border border-border bg-surface-secondary text-text-primary text-sm font-medium cursor-pointer outline-none min-w-[120px]"
        >
          {versions.map((v, i) => (
            <option key={v.version} value={v.version}>
              v{v.version} {i === 0 ? "(Latest)" : ""}
            </option>
          ))}
        </select>
        {pluginType === "CPP" ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="btn btn-primary grid grid-flow-col place-items-center gap-2 text-sm lg:text-base px-5 lg:px-6 py-2.5 rounded-full font-semibold no-underline cursor-pointer"
            >
              <Download size={18} /> Download
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full min-w-[180px] bg-surface-secondary border border-border rounded-lg shadow-xl z-50 flex flex-col p-1.5">
                <a
                  href={`/api/v1/download/${slug}/${selectedVersion.version}?platform=windows`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="px-3 py-2 hover:bg-surface-card rounded-md flex items-center gap-2 text-sm text-text-primary no-underline whitespace-nowrap transition-colors"
                >
                  <Download size={16} /> Windows (.dll)
                </a>
                <a
                  href={`/api/v1/download/${slug}/${selectedVersion.version}?platform=linux`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="px-3 py-2 hover:bg-surface-card rounded-md flex items-center gap-2 text-sm text-text-primary no-underline whitespace-nowrap transition-colors"
                >
                  <Download size={16} /> Linux (.so)
                </a>
              </div>
            )}
          </div>
        ) : (
          <a
            href={`/api/v1/download/${slug}/${selectedVersion.version}`}
            className="btn btn-primary grid grid-flow-col place-items-center gap-2 text-sm lg:text-base px-5 lg:px-6 py-2.5 rounded-full font-semibold no-underline"
          >
            <Download size={18} /> Download
          </a>
        )}
      </div>
      <div className="version-info-text text-[11px] text-text-muted flex items-center justify-end gap-3 w-full opacity-80">
        <span>
          Size:{" "}
          {selectedVersion.fileSize
            ? `${(selectedVersion.fileSize / (1024 * 1024)).toFixed(2)} MB`
            : "—"}
        </span>
        <span>Uploaded: {parseDate(selectedVersion.createdAt)}</span>
      </div>
    </div>
  );
}

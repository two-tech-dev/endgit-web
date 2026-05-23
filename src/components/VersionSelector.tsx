"use client";

import { useState } from "react";
import { Download, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Version {
  id: string;
  version: string;
  fileSize: number;
  createdAt: string;
}

interface Props {
  slug: string;
  pluginType?: string;
  versions: Version[];
  averageRating?: number;
  downloads?: number;
  activeVersionDownloads?: number;
}

export default function VersionSelector({
  slug,
  pluginType = "PYTHON",
  versions,
  averageRating,
  downloads,
  activeVersionDownloads,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeVersionStr = searchParams.get("v");
  const [selectedVersionStr, setSelectedVersionStr] = useState(
    activeVersionStr || versions[0]?.version,
  );

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
    <div className="grid gap-3 w-full">
      <div className="flex flex-col sm:flex-row gap-2.5 w-full">
        <select
          value={selectedVersion.version}
          onChange={(e) => handleVersionChange(e.target.value)}
          className="px-4 py-2.5 rounded-md border border-border bg-surface-secondary text-text-primary text-[0.9375rem] cursor-pointer outline-none min-w-0 sm:flex-[1_1_140px]"
        >
          {versions.map((v, i) => (
            <option key={v.version} value={v.version}>
              v{v.version} {i === 0 ? "(Latest)" : ""}
            </option>
          ))}
        </select>
        {pluginType === "CPP" ? (
          <div className="flex flex-col sm:flex-row gap-2 min-w-0 w-full sm:w-auto">
            <a
              href={`/api/v1/download/${slug}/${selectedVersion.version}?platform=linux`}
              className="btn btn-primary flex items-center justify-center gap-2 text-[0.9375rem] px-5 py-2.5 bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-md font-semibold text-white hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors duration-150 no-underline min-w-0 w-full sm:w-auto"
            >
              <Download size={16} /> Linux (.so)
            </a>
            <a
              href={`/api/v1/download/${slug}/${selectedVersion.version}?platform=windows`}
              className="btn btn-primary flex items-center justify-center gap-2 text-[0.9375rem] px-5 py-2.5 rounded-md font-semibold no-underline min-w-0 w-full sm:w-auto"
            >
              <Download size={16} /> Windows (.dll)
            </a>
          </div>
        ) : (
          <a
            href={`/api/v1/download/${slug}/${selectedVersion.version}`}
            className="btn btn-primary flex items-center justify-center gap-2 text-sm lg:text-base px-5 lg:px-6 py-2.5 font-semibold no-underline w-full sm:w-auto"
          >
            <Download size={16} /> Download
          </a>
        )}
      </div>
      <div className="version-info-text text-xs text-text-muted flex flex-wrap gap-x-3.5 gap-y-1 justify-center md:justify-end items-center w-full">
        {averageRating !== undefined && (
          <div className="flex items-center gap-1 font-semibold text-text-primary">
            <Star size={14} className="text-warning fill-warning" />
            {averageRating.toLocaleString(undefined, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </div>
        )}
        {downloads !== undefined && (
          <div
            className="flex items-center gap-1 font-semibold text-text-primary"
            title="Total Downloads"
          >
            <Download size={14} className="text-text-muted" />
            {downloads.toLocaleString()}
            {activeVersionDownloads !== undefined &&
              activeVersionDownloads > 0 && (
                <span className="text-[10.5px] text-text-muted font-normal ml-0.5">
                  ({activeVersionDownloads.toLocaleString()} v
                  {selectedVersion.version})
                </span>
              )}
          </div>
        )}
        <span>
          Size:{" "}
          {selectedVersion.fileSize
            ? `${(selectedVersion.fileSize / 1024).toFixed(0)} KB`
            : "—"}
        </span>
        <span>
          Uploaded: {new Date(selectedVersion.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

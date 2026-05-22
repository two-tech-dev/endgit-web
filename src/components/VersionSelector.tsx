"use client";

import { useState } from "react";
import { Download } from "lucide-react";
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

  if (!versions || versions.length === 0) {
    return (
      <div className="flex flex-col gap-2 items-end">
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
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-stretch gap-2.5 flex-wrap w-full">
        <select
          value={selectedVersion.version}
          onChange={(e) => handleVersionChange(e.target.value)}
          className="px-4 py-2.5 rounded-md border border-border bg-surface-secondary text-text-primary text-[0.9375rem] cursor-pointer outline-none flex-[1_1_140px] min-w-0"
        >
          {versions.map((v, i) => (
            <option key={v.version} value={v.version}>
              v{v.version} {i === 0 ? "(Latest)" : ""}
            </option>
          ))}
        </select>
        {pluginType === "CPP" ? (
          <div className="flex gap-2 flex-wrap">
            <a
              href={`/api/v1/download/${slug}/${selectedVersion.version}?platform=linux`}
              className="btn btn-primary flex items-center gap-2 text-[0.9375rem] px-5 py-2.5 bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-md font-semibold text-white hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors duration-150 no-underline flex-[1_1_auto] min-w-[120px] justify-center"
            >
              <Download size={16} /> Linux (.so)
            </a>
            <a
              href={`/api/v1/download/${slug}/${selectedVersion.version}?platform=windows`}
              className="btn btn-primary flex items-center gap-2 text-[0.9375rem] px-5 py-2.5 rounded-md font-semibold no-underline flex-[1_1_auto] min-w-[120px] justify-center"
            >
              <Download size={16} /> Windows (.dll)
            </a>
          </div>
        ) : (
          <a
            href={`/api/v1/download/${slug}/${selectedVersion.version}`}
            className="btn btn-primary flex items-center justify-center gap-2 text-base px-6 py-2.5 font-semibold no-underline flex-[1_1_auto]"
          >
            <Download size={18} /> Download
          </a>
        )}
      </div>
      <div className="text-xs text-text-muted text-right">
        <span>
          Size:{" "}
          {selectedVersion.fileSize
            ? `${(selectedVersion.fileSize / 1024).toFixed(0)} KB`
            : "—"}
        </span>
        <span className="ml-3">
          Uploaded: {new Date(selectedVersion.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

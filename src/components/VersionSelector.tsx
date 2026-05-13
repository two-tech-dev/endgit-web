"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Version {
  id: string;
  version: string;
  fileSize: number;
  createdAt: string;
  isLatest: boolean;
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          alignItems: "flex-end",
        }}
      >
        <button className="btn btn-primary" disabled style={{ opacity: 0.5 }}>
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={selectedVersion.version}
          onChange={(e) => handleVersionChange(e.target.value)}
          style={{
            padding: "0.625rem 1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            fontSize: "0.9375rem",
            cursor: "pointer",
            outline: "none",
            minWidth: "140px",
          }}
        >
          {versions.map((v) => (
            <option key={v.version} value={v.version}>
              v{v.version} {v.isLatest ? "(Latest)" : ""}
            </option>
          ))}
        </select>
        {pluginType === "CPP" ? (
          <div className="cpp-download-buttons" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <a
              href={`/api/v1/download/${slug}/${selectedVersion.version}?platform=linux`}
              className="btn btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.9375rem",
                padding: "0.625rem 1.25rem",
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                color: "white",
                textDecoration: "none",
                flex: "1 1 auto",
                minWidth: "120px",
                justifyContent: "center",
              }}
            >
              <Download size={16} /> Linux (.so)
            </a>
            <a
              href={`/api/v1/download/${slug}/${selectedVersion.version}?platform=windows`}
              className="btn btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.9375rem",
                padding: "0.625rem 1.25rem",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                textDecoration: "none",
                flex: "1 1 auto",
                minWidth: "120px",
                justifyContent: "center",
              }}
            >
              <Download size={16} /> Windows (.dll)
            </a>
          </div>
        ) : (
          <a
            href={`/api/v1/download/${slug}/${selectedVersion.version}`}
            className="btn btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1rem",
              padding: "0.625rem 1.5rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Download size={18} /> Download
          </a>
        )}
      </div>
      <div
        className="version-info-text"
        style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          textAlign: "right",
        }}
      >
        <span>
          Size:{" "}
          {selectedVersion.fileSize
            ? `${(selectedVersion.fileSize / 1024).toFixed(0)} KB`
            : "—"}
        </span>
        <span style={{ marginLeft: "12px" }}>
          Uploaded: {new Date(selectedVersion.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

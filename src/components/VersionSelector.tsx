"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface Version {
  id: string;
  version: string;
  fileSize: number;
  createdAt: string;
  isLatest: boolean;
}

interface Props {
  slug: string;
  versions: Version[];
}

export default function VersionSelector({ slug, versions }: Props) {
  const [selectedVersionId, setSelectedVersionId] = useState(versions[0]?.id);

  if (!versions || versions.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", alignItems: "flex-end" }}>
        <button className="btn btn-primary" disabled style={{ opacity: 0.5 }}>
          No versions available
        </button>
      </div>
    );
  }

  const selectedVersion = versions.find(v => v.id === selectedVersionId) || versions[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", alignItems: "flex-end" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: "8px" }}>
        <select 
          value={selectedVersion.id}
          onChange={(e) => setSelectedVersionId(e.target.value)}
          style={{
            padding: "0 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            fontWeight: 500,
            cursor: "pointer",
            outline: "none"
          }}
        >
          {versions.map(v => (
            <option key={v.id} value={v.id}>
              v{v.version} {v.isLatest ? "(Latest)" : ""}
            </option>
          ))}
        </select>
        <a href={`/api/v1/download/${slug}/${selectedVersion.version}`} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1rem" }}>
          <Download size={18} /> Download
        </a>
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "right" }}>
        <span>Size: {selectedVersion.fileSize ? `${(selectedVersion.fileSize / 1024).toFixed(0)} KB` : "—"}</span>
        <span style={{ marginLeft: "12px" }}>Uploaded: {new Date(selectedVersion.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

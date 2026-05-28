"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MarkdownTabs = dynamic(() => import("@/components/MarkdownTabs"), {
  loading: () => (
    <div className="p-6 text-text-muted text-sm">Loading description...</div>
  ),
});

interface VersionDescriptionProps {
  slug: string;
  version: string | null;
  fallbackDescription: string;
  repoUrl?: string;
  commitHash?: string;
}

export default function VersionDescription({
  slug,
  version,
  fallbackDescription,
  repoUrl,
  commitHash,
}: VersionDescriptionProps) {
  const [description, setDescription] = useState<string>(fallbackDescription);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!version) {
      setDescription(fallbackDescription);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    fetch(
      `${baseUrl}/api/v1/plugins/${slug}/versions/${encodeURIComponent(version)}/description`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        if (!cancelled && json.success && json.data) {
          const versionDesc = json.data.longDescription;
          if (versionDesc) {
            setDescription(versionDesc);
          } else {
            setDescription(fallbackDescription);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDescription(fallbackDescription);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, version, fallbackDescription]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-surface-card/50 grid place-items-center z-10 rounded-sm">
          <p className="text-text-muted text-sm">Loading description...</p>
        </div>
      )}
      <MarkdownTabs
        markdown={description}
        repoUrl={repoUrl}
        commitHash={commitHash}
      />
    </div>
  );
}

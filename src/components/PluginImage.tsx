"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  iconUrl?: string | null;
  repoUrl?: string | null;
  alt: string;
}

function getSrc(iconUrl?: string | null, repoUrl?: string | null): string {
  if (iconUrl) return iconUrl.replace(/\/\.\//g, "/");
  if (repoUrl) {
    const repoPath = repoUrl
      .replace("https://github.com/", "")
      .replace(/\/$/, "");
    return `https://raw.githubusercontent.com/${repoPath}/main/icon.png`;
  }
  return "/logo.png";
}

export default function PluginImage({ iconUrl, repoUrl, alt }: Props) {
  const [errored, setErrored] = useState(false);
  const src = errored ? "/logo.png" : getSrc(iconUrl, repoUrl);
  const isFallback = src === "/logo.png";

  return (
    <Image
      src={src}
      alt={isFallback ? "EndGit Logo" : alt}
      width={64}
      height={64}
      loading="lazy"
      decoding="async"
      unoptimized
      onError={() => setErrored(true)}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "var(--radius-lg)",
        objectFit: "cover",
        padding: "0",
      }}
    />
  );
}

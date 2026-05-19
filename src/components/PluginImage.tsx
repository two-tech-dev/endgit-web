"use client";
import { useState, useEffect } from "react";

interface Props {
  iconUrl?: string | null;
  repoUrl?: string | null;
  alt: string;
}

export default function PluginImage({ iconUrl, repoUrl, alt }: Props) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    let targetSrc = iconUrl;
    if (!targetSrc && repoUrl) {
      const repoPath = repoUrl
        .replace("https://github.com/", "")
        .replace(/\/$/, "");
      targetSrc = `https://raw.githubusercontent.com/${repoPath}/main/icon.png`;
    }

    if (!targetSrc) {
      setImgSrc("/logo.png");
      return;
    }

    const img = new Image();
    img.onload = () => setImgSrc(targetSrc as string);
    img.onerror = () => setImgSrc("/logo.png");
    img.src = targetSrc;
  }, [iconUrl, repoUrl]);

  if (!imgSrc) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "var(--bg-secondary)",
        }}
      />
    );
  }

  const isFallback = imgSrc === "/logo.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={isFallback ? "EndGit Logo" : alt}
      loading="lazy"
      decoding="async"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "var(--radius-lg)",
        objectFit: "cover",
        padding: "0",
        transition: "opacity 0.2s",
      }}
    />
  );
}

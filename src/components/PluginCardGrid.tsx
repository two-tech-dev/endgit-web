"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Check,
  Copy,
  Download,
  Flame,
  Grid2X2,
  List,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import PluginImage from "@/components/PluginImage";
import { VERIFIED_ORGS } from "@/lib/constants";
import { useState } from "react";

interface Plugin {
  id: string;
  slug: string;
  displayName: string;
  description?: string;
  iconUrl?: string;
  repoUrl?: string;
  latestVersion?: string;
  stars?: number;
  downloads?: number;
  commentCount?: number;
  heatScore?: number;
  createdAt?: string;
  isFeatured?: boolean;
  isPreRelease?: boolean;
  author?: { displayName?: string; username?: string };
}

function PluginBadge({ kind }: { kind: "pre" | "verified" | "featured" }) {
  if (kind === "featured") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-amber-400/45 bg-linear-to-r from-amber-400/20 via-success/15 to-emerald-400/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.18)]">
        <Sparkles size={11} className="text-amber-300" />
        Featured
      </span>
    );
  }

  const styles = {
    pre: "border-error/25 bg-error/15 text-error",
    verified: "border-brand/25 bg-brand/15 text-brand",
  };
  const labels = {
    pre: "Pre-release",
    verified: "Verified",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[kind]}`}
    >
      {kind === "verified" && <BadgeCheck size={11} />}
      {labels[kind]}
    </span>
  );
}

function CopyInstallButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const command = `endgit install ${slug}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-sm border border-border bg-surface/90 text-text-muted opacity-0 transition-all hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/10 hover:text-[#a78bfa] group-hover:opacity-100 group-focus-within:opacity-100"
      title={copied ? "Copied install command" : `Copy: ${command}`}
      aria-label={
        copied ? "Copied install command" : `Copy install command for ${slug}`
      }
    >
      {copied ? (
        <Check size={15} className="text-success" />
      ) : (
        <Copy size={15} />
      )}
    </button>
  );
}

function PluginCard({
  plugin,
  index,
  view,
}: {
  plugin: Plugin;
  index: number;
  view: "grid" | "list";
}) {
  const isFeatured = plugin.isFeatured;
  const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
  const isVerified = repoOwner ? VERIFIED_ORGS.includes(repoOwner) : false;
  const author =
    repoOwner || plugin.author?.displayName || plugin.author?.username;

  if (view === "list") {
    return (
      <article
        className="group relative grid gap-4 border border-border bg-surface-card p-4 transition-all hover:border-[#7c3aed]/50 hover:bg-surface-secondary hover:shadow-[0_0_28px_rgba(124,58,237,0.18)] md:grid-cols-[auto_1fr_auto] md:items-center"
        style={{
          animation: `fadeSlideUp 0.22s ease ${Math.min(index * 0.025, 0.2)}s both`,
        }}
      >
        <CopyInstallButton slug={plugin.slug} />
        <Link
          href={`/plugins/${plugin.slug}`}
          className="flex items-center gap-4 no-underline md:contents"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-secondary">
            <PluginImage
              iconUrl={plugin.iconUrl}
              repoUrl={plugin.repoUrl}
              alt={`${plugin.displayName} icon`}
            />
          </div>

          <div className="min-w-0 pr-10">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="m-0 truncate text-lg font-bold leading-tight text-text-primary">
                {plugin.displayName}
              </h3>
              {plugin.isPreRelease && <PluginBadge kind="pre" />}
              {isVerified && <PluginBadge kind="verified" />}
              {isFeatured && <PluginBadge kind="featured" />}
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-text-secondary">
              {plugin.description || author || "No description"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted md:justify-end">
            <span className="inline-flex items-center gap-1 font-semibold text-text-secondary">
              <Download size={13} /> {plugin.downloads?.toLocaleString() ?? 0}
            </span>
            {(plugin.heatScore || 0) > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-warning">
                <Flame size={12} /> {plugin.heatScore}
              </span>
            )}
            {(plugin.commentCount || 0) > 0 && (
              <span className="inline-flex items-center gap-1">
                <MessageCircle size={12} /> {plugin.commentCount}
              </span>
            )}
            <code className="rounded-sm border border-border bg-surface-secondary px-1.5 py-0.5 font-mono">
              v{plugin.latestVersion || "1.0.0"}
            </code>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className="card group relative flex flex-col self-start overflow-hidden bg-surface-card p-0 transition-all hover:border-[#7c3aed]/50 hover:bg-surface-secondary hover:shadow-[0_0_30px_rgba(124,58,237,0.18)]"
      style={{
        animation: `fadeSlideUp 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${Math.min(index * 0.04, 0.3)}s both`,
      }}
    >
      <CopyInstallButton slug={plugin.slug} />
      <Link
        href={`/plugins/${plugin.slug}`}
        className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 p-4 no-underline"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-secondary">
          <PluginImage
            iconUrl={plugin.iconUrl}
            repoUrl={plugin.repoUrl}
            alt={`${plugin.displayName} icon`}
          />
        </div>

        <div className="grid min-w-0 content-start pr-7">
          <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold leading-tight text-text-primary">
            {plugin.displayName}
          </h3>
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
            {plugin.isPreRelease && <PluginBadge kind="pre" />}
            {isVerified && <PluginBadge kind="verified" />}
            {isFeatured && <PluginBadge kind="featured" />}
          </div>
          <div className="mt-1 text-xs text-text-muted">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {author}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
            <span className="flex items-center gap-1 font-semibold text-text-secondary">
              <Download size={13} /> {plugin.downloads?.toLocaleString() ?? 0}
            </span>
            {(plugin.heatScore || 0) > 0 && (
              <span className="flex items-center gap-0.5 font-medium text-warning">
                <Flame size={12} /> {plugin.heatScore}
              </span>
            )}
            {(plugin.commentCount || 0) > 0 && (
              <span className="flex items-center gap-0.5 font-medium text-text-muted">
                <MessageCircle size={12} /> {plugin.commentCount}
              </span>
            )}
            <code className="font-mono text-text-muted">
              v{plugin.latestVersion || "1.0.0"}
            </code>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function PluginCardGrid({ plugins }: { plugins: Plugin[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <p className="m-0 text-sm text-text-muted">
          {plugins.length} plugin{plugins.length === 1 ? "" : "s"} loaded
        </p>
        <div className="grid grid-cols-2 overflow-hidden rounded-sm border border-border bg-surface-card">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`grid h-9 grid-cols-[auto_1fr] items-center gap-1.5 px-3 text-sm transition-colors ${
              view === "grid"
                ? "bg-brand/10 text-brand"
                : "text-text-muted hover:bg-surface-secondary hover:text-text-primary"
            }`}
          >
            <Grid2X2 size={14} /> Grid
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`grid h-9 grid-cols-[auto_1fr] items-center gap-1.5 border-l border-border px-3 text-sm transition-colors ${
              view === "list"
                ? "bg-brand/10 text-brand"
                : "text-text-muted hover:bg-surface-secondary hover:text-text-primary"
            }`}
          >
            <List size={14} /> List
          </button>
        </div>
      </div>

      <div
        className={
          view === "grid"
            ? "grid flex-1 grid-cols-1 content-start items-start gap-4 overflow-y-auto pr-2 [scrollbar-width:thin] lg:grid-cols-2 xl:grid-cols-3"
            : "grid flex-1 content-start gap-3 overflow-y-auto pr-2 [scrollbar-width:thin]"
        }
      >
        {plugins.map((plugin, i) => (
          <PluginCard key={plugin.id} plugin={plugin} index={i} view={view} />
        ))}
      </div>
    </div>
  );
}

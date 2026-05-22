"use client";

import { useState, useEffect } from "react";
import {
  GitBranch,
  ChevronRight,
  ChevronDown,
  Package,
  Loader2,
} from "lucide-react";

interface DepNode {
  name: string;
  version: string;
  required: boolean;
  children?: DepNode[];
}

export default function DependencyGraph({ slug }: { slug: string }) {
  const [deps, setDeps] = useState<DepNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${apiUrl}/api/v1/plugins/${slug}/dependencies`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const { version, dependencies } = json.data;
          // Build tree: root is the plugin itself, children are its dependencies
          const root: DepNode = {
            name: slug,
            version: version,
            required: true,
            children: (dependencies || []).map((d: any) => ({
              name: d.name,
              version: d.version,
              required: true,
            })),
          };
          setDeps([root]);
        } else {
          setDeps([]);
        }
      })
      .catch(() => setError("Failed to load dependencies"))
      .finally(() => setLoading(false));
  }, [slug]);

  // Don't render the card at all if there are no dependencies
  if (
    !loading &&
    !error &&
    (deps.length === 0 || (deps[0]?.children?.length ?? 0) === 0)
  ) {
    return null;
  }

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold flex items-center gap-2 text-text-primary mb-4">
        <GitBranch size={18} className="text-accent" /> Dependency Graph
      </h3>

      {loading ? (
        <div className="text-center py-4">
          <Loader2 size={20} className="text-text-muted animate-spin mx-auto" />
        </div>
      ) : error ? (
        <p className="text-text-muted text-sm">{error}</p>
      ) : (
        <div className="font-mono text-[0.8125rem]">
          {deps.map((dep, i) => (
            <TreeNode key={i} node={dep} isRoot depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeNode({
  node,
  isRoot,
  depth,
}: {
  node: DepNode;
  isRoot?: boolean;
  depth: number;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={isRoot ? "" : "ml-5"}>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-sm ${
          hasChildren
            ? "cursor-pointer hover:bg-surface-secondary"
            : "cursor-default"
        } transition-colors duration-100 mb-[2px]`}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown size={14} className="text-text-muted" />
          ) : (
            <ChevronRight size={14} className="text-text-muted" />
          )
        ) : (
          <span className="w-3.5 inline-block text-center text-border-highlight">
            •
          </span>
        )}
        <Package
          size={13}
          color={
            isRoot
              ? "var(--color-accent)"
              : node.required
                ? "var(--color-accent)"
                : "var(--color-text-muted)"
          }
        />
        <span
          className={
            isRoot
              ? "text-accent font-semibold"
              : "text-text-primary font-normal"
          }
        >
          {node.name}
        </span>
        <span className="text-text-muted text-xs">{node.version}</span>
        {!node.required ? (
          <span className="text-xs text-text-muted bg-surface-secondary px-1 py-0 rounded border border-border">
            optional
          </span>
        ) : null}
      </div>
      {hasChildren && open ? (
        <div className="border-l border-border ml-[7px]">
          {node.children!.map((child, i) => (
            <TreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

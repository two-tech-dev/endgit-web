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
    <div className="card" style={{ padding: "var(--space-6)" }}>
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          color: "var(--text-primary)",
          marginBottom: "var(--space-4)",
        }}
      >
        <GitBranch size={18} color="var(--accent-primary)" /> Dependency Graph
      </h3>

      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
          <Loader2
            size={20}
            color="var(--text-muted)"
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>
      ) : error ? (
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          {error}
        </p>
      ) : (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem" }}>
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
    <div style={{ marginLeft: isRoot ? 0 : "1.25rem" }}>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          padding: "0.25rem 0.5rem",
          borderRadius: "var(--radius-sm)",
          cursor: hasChildren ? "pointer" : "default",
          transition: "background 100ms",
          marginBottom: "2px",
        }}
        onMouseEnter={(e) => {
          if (hasChildren)
            e.currentTarget.style.background = "var(--bg-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown size={14} color="var(--text-muted)" />
          ) : (
            <ChevronRight size={14} color="var(--text-muted)" />
          )
        ) : (
          <span
            style={{
              width: "14px",
              display: "inline-block",
              textAlign: "center",
              color: "var(--border-highlight)",
            }}
          >
            •
          </span>
        )}
        <Package
          size={13}
          color={
            isRoot
              ? "var(--accent-primary)"
              : node.required
                ? "var(--accent-primary)"
                : "var(--text-muted)"
          }
        />
        <span
          style={{
            color: isRoot ? "var(--accent-primary)" : "var(--text-primary)",
            fontWeight: isRoot ? 600 : 400,
          }}
        >
          {node.name}
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
          {node.version}
        </span>
        {!node.required ? (
          <span
            style={{
              fontSize: "0.625rem",
              color: "var(--text-muted)",
              background: "var(--bg-secondary)",
              padding: "0 4px",
              borderRadius: "3px",
              border: "1px solid var(--border-color)",
            }}
          >
            optional
          </span>
        ) : null}
      </div>
      {hasChildren && open ? (
        <div
          style={{
            borderLeft: "1px solid var(--border-color)",
            marginLeft: "0.4375rem",
          }}
        >
          {node.children!.map((child, i) => (
            <TreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

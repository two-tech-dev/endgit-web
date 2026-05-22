"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import clike from "react-syntax-highlighter/dist/esm/languages/prism/clike";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("clike", clike);

interface Tab {
  title: string;
  content: string;
}

const markdownSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "img",
    "details",
    "summary",
    "kbd",
    "br",
    "hr",
    "sup",
    "sub",
  ],
  attributes: {
    ...defaultSchema.attributes,

    a: [...(defaultSchema.attributes?.a || []), "href", "target", "rel"],

    img: ["src", "alt", "title", "width", "height"],

    "*": ["title", "align"],
  },
};

/**
 * Rewrite relative image/link URLs in markdown to absolute GitHub raw URLs.
 * Handles:
 *   - ![alt](assets/foo.png) → ![alt](https://raw.githubusercontent.com/owner/repo/main/assets/foo.png)
 *   - <img src="assets/foo.png"> → <img src="https://raw.githubusercontent.com/...">
 *   - Skips URLs that are already absolute (http/https/data:)
 */
function rewriteRelativeUrls(
  markdown: string,
  repoUrl?: string,
  commitHash?: string,
): string {
  if (!repoUrl || !markdown) return markdown;

  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return markdown;

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");
  const ref = commitHash || "main";
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}`;

  // Rewrite markdown image syntax: ![alt](relative/path)
  let result = markdown.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/|data:)([^)]+)\)/g,
    (_, alt, path) => `![${alt}](${rawBase}/${path.replace(/^\.\//, "")})`,
  );

  // Rewrite HTML img src: <img src="relative/path">
  result = result.replace(
    /(<img\s[^>]*src=["'])(?!https?:\/\/|data:)([^"']+)(["'])/gi,
    (_, prefix, path, suffix) =>
      `${prefix}${rawBase}/${path.replace(/^\.\//, "")}${suffix}`,
  );

  return result;
}

function parseMarkdownTabs(markdown: string): Tab[] {
  // Split by H2 (## ) at the start of a line
  const parts = markdown.split(/^##\s+(.*)$/gm);
  const tabs: Tab[] = [];

  const firstPart = parts[0].trim();
  if (firstPart || parts.length === 1) {
    tabs.push({ title: "General", content: parts[0] });
  }

  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i].trim();
    const content = parts[i + 1] || "";
    if (title) {
      tabs.push({ title, content });
    }
  }

  return tabs;
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, () => rehypeSanitize(markdownSchema)]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function MarkdownTabs({
  markdown,
  repoUrl,
  commitHash,
}: {
  markdown: string;
  repoUrl?: string;
  commitHash?: string;
}) {
  const processedMarkdown = rewriteRelativeUrls(
    markdown || "",
    repoUrl,
    commitHash,
  );
  const tabs = parseMarkdownTabs(processedMarkdown);
  const [activeTab, setActiveTab] = useState(0);

  // Fallback if no content
  if (tabs.length === 0) {
    return (
      <div
        className="markdown-body"
        style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
      >
        <em>No description provided.</em>
      </div>
    );
  }

  // If there's only one tab, just render it normally without tabs UI
  if (tabs.length === 1) {
    return (
      <div
        className="markdown-body"
        style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
      >
        <MarkdownContent content={tabs[0].content} />
      </div>
    );
  }

  const currentTab = tabs[activeTab];

  return (
    <div
      style={{
        minWidth: 0,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Tabs Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: "100%",
          background: "transparent",
          borderBottom: "1px solid var(--border-color)",
          padding: "8px 8px 0 8px",
          gap: "4px",
        }}
      >
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          const displayTitle =
            tab.title.length > 20
              ? tab.title.substring(0, 20) + "..."
              : tab.title;

          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              style={{
                padding: "6px 12px",
                background: isActive ? "#007bff" : "var(--bg-card)",
                color: isActive ? "white" : "var(--text-primary)",
                border: "1px solid",
                borderColor: isActive ? "#007bff" : "var(--border-color)",
                borderBottomColor: isActive ? "#007bff" : "var(--border-color)",
                borderRadius: "4px 4px 0 0",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
              title={tab.title}
            >
              {displayTitle}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        className="markdown-body"
        style={{
          minWidth: 0,
          width: "100%",
          maxWidth: "100%",
          padding: "var(--space-6)",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          background: "var(--bg-card)",
        }}
      >
        <MarkdownContent content={currentTab.content} />
      </div>
    </div>
  );
}

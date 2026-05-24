"use client";
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

    code: [...(defaultSchema.attributes?.code || []), "className"],

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

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, () => rehypeSanitize(markdownSchema)]}
      components={{
        table({ children, ...props }: any) {
          return (
            <div
              className="table-wrapper"
              style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
            >
              <table {...props}>{children}</table>
            </div>
          );
        },
        code({ node, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          const isInline =
            !match ||
            (node?.position?.start?.line === node?.position?.end?.line &&
              !String(children).includes("\n"));
          return !isInline && match ? (
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

  if (!processedMarkdown.trim()) {
    return (
      <div className="markdown-body text-text-secondary leading-relaxed italic p-6 bg-surface-card rounded-lg border border-border">
        No description provided.
      </div>
    );
  }

  return (
    <div className="markdown-body min-w-0 w-full max-w-full p-6 text-text-secondary leading-relaxed">
      <MarkdownContent content={processedMarkdown} />
    </div>
  );
}

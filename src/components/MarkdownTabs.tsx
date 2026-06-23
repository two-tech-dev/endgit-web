"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
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
import { Check, Copy } from "lucide-react";
import { useState } from "react";

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
    "*": ["title", "align"],
  },
};

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

  let result = markdown.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/|data:)([^)]+)\)/g,
    (_, alt, path) => `![${alt}](${rawBase}/${path.replace(/^\.\//, "")})`,
  );

  result = result.replace(
    /(<img\s[^>]*src=["'])(?!https?:\/\/|data:)([^"']+)(["'])/gi,
    (_, prefix, path, suffix) =>
      `${prefix}${rawBase}/${path.replace(/^\.\//, "")}${suffix}`,
  );

  return result;
}

function splitMarkdownSections(markdown: string) {
  const lines = markdown.split("\n");
  const sections: { id: string; title: string; content: string }[] = [];
  let intro: string[] = [];
  let current: { id: string; title: string; lines: string[] } | null = null;
  const seen = new Map<string, number>();

  const makeId = (title: string) => {
    const base =
      title
        .toLowerCase()
        .trim()
        .replace(/[`*_~()[\]{}]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "section";
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };

  for (const line of lines) {
    const match = /^##\s+(.+?)\s*#*$/.exec(line.trim());
    if (match) {
      if (current) {
        sections.push({
          id: current.id,
          title: current.title,
          content: current.lines.join("\n").trim(),
        });
      }
      const title = match[1].replace(/[`*_~]/g, "").trim();
      current = { id: makeId(title), title, lines: [] };
      continue;
    }

    if (current) current.lines.push(line);
    else intro.push(line);
  }

  if (current) {
    sections.push({
      id: current.id,
      title: current.title,
      content: current.lines.join("\n").trim(),
    });
  }

  const introContent = intro.join("\n").trim();
  if (introContent || sections.length === 0) {
    sections.unshift({
      id: "overview",
      title: "Overview",
      content: introContent || markdown,
    });
  }

  return sections.filter((section) => section.content.trim());
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const displayLanguage = language || "text";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="my-6 overflow-hidden rounded-md border border-[#1890ff]/25 bg-[#111827] shadow-[0_0_24px_rgba(24,144,255,0.10)]">
      <div className="grid grid-cols-[1fr_auto] items-center border-b border-white/10 bg-white/[0.035] px-4 py-2">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1890ff]">
          {displayLanguage}
        </span>
        <button
          type="button"
          onClick={copy}
          className="grid h-7 grid-cols-[auto_1fr] items-center gap-1.5 rounded-sm border border-white/10 px-2 text-[11px] text-slate-300 transition-colors hover:border-[#1890ff]/50 hover:bg-[#1890ff]/15 hover:text-white"
        >
          {copied ? (
            <Check size={13} className="text-success" />
          ) : (
            <Copy size={13} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={displayLanguage}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "18px 20px",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: 1.7,
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-mono)",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, () => rehypeSanitize(markdownSchema)]}
      components={{
        h1({ children, ...props }: any) {
          return (
            <h1
              className="mb-5 mt-8 text-2xl font-bold leading-tight text-slate-50 first:mt-0"
              {...props}
            >
              {children}
            </h1>
          );
        },
        h2({ children, ...props }: any) {
          return (
            <h2
              className="mb-4 mt-8 border-b border-white/10 pb-2 text-xl font-bold leading-tight text-slate-50"
              {...props}
            >
              {children}
            </h2>
          );
        },
        h3({ children, ...props }: any) {
          return (
            <h3
              className="mb-3 mt-7 text-lg font-bold leading-snug text-slate-100"
              {...props}
            >
              {children}
            </h3>
          );
        },
        p({ children, ...props }: any) {
          return (
            <p className="mb-5 leading-8 text-slate-300" {...props}>
              {children}
            </p>
          );
        },
        a({ children, ...props }: any) {
          return (
            <a
              className="text-[#1890ff] underline underline-offset-4 hover:text-white"
              {...props}
            >
              {children}
            </a>
          );
        },
        ul({ children, ...props }: any) {
          return (
            <ul
              className="mb-6 grid list-disc gap-2 pl-6 text-slate-300"
              {...props}
            >
              {children}
            </ul>
          );
        },
        ol({ children, ...props }: any) {
          return (
            <ol
              className="mb-6 grid list-decimal gap-2 pl-6 text-slate-300"
              {...props}
            >
              {children}
            </ol>
          );
        },
        table({ children, ...props }: any) {
          return (
            <div className="my-6 overflow-x-auto rounded-md border border-white/10 bg-white/[0.025] [scrollbar-width:thin]">
              <table
                className="w-full min-w-[640px] border-collapse text-left"
                {...props}
              >
                {children}
              </table>
            </div>
          );
        },
        th({ children, ...props }: any) {
          return (
            <th
              className="border-b border-white/10 bg-white/[0.045] px-4 py-3 text-[11px] font-black uppercase tracking-wider text-slate-100"
              {...props}
            >
              {children}
            </th>
          );
        },
        td({ children, ...props }: any) {
          return (
            <td
              className="border-b border-white/10 px-4 py-3 align-top text-sm leading-7 text-slate-300 last:border-b-0"
              {...props}
            >
              {children}
            </td>
          );
        },
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          const code = String(children).replace(/\n$/, "");

          return !inline && match ? (
            <CodeBlock language={match[1]} code={code} />
          ) : (
            <code
              className="rounded-sm border border-[#1890ff]/25 bg-[#1890ff]/12 px-1.5 py-0.5 font-mono text-[0.88em] text-[#1890ff]"
              {...props}
            >
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
  const sections = splitMarkdownSections(processedMarkdown).slice(0, 10);
  const [activeSectionId, setActiveSectionId] = useState(
    sections[0]?.id || "overview",
  );
  const activeSection =
    sections.find((section) => section.id === activeSectionId) || sections[0];

  if (!processedMarkdown.trim()) {
    return (
      <div className="markdown-body plugin-readme rounded-sm border border-border bg-surface-card p-6 leading-8 text-slate-300 italic">
        No description provided.
      </div>
    );
  }

  return (
    <div className="markdown-body plugin-readme min-w-0 w-full max-w-full bg-[#111111]/40 text-slate-300">
      {sections.length > 1 && (
        <div className="border-b border-white/10 bg-transparent px-3 sm:px-4 lg:px-6">
          <div className="flex gap-4 overflow-x-auto [scrollbar-width:thin] sm:gap-6">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSectionId(section.id)}
                className={`shrink-0 border-b-2 px-0 py-3 text-sm font-semibold transition-colors ${
                  activeSection?.id === section.id
                    ? "border-brand text-slate-50"
                    : "border-transparent text-slate-400 hover:border-white/25 hover:text-slate-200"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 sm:p-6 lg:p-7">
        {activeSection && <MarkdownContent content={activeSection.content} />}
      </div>
    </div>
  );
}

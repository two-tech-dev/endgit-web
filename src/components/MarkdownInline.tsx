"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownInline({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={`markdown-inline ${className || ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <span>{children}</span>,
          a: ({ href, children }) => (
            <a href={href} className="text-brand hover:underline">
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-surface-secondary px-1 py-0.5 rounded text-[0.85em]">
              {children}
            </code>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-text-primary">
              {children}
            </strong>
          ),
          em: ({ children }) => <em>{children}</em>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

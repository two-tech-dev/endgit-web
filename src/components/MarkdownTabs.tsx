"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Tab {
  title: string;
  content: string;
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

export default function MarkdownTabs({ markdown }: { markdown: string }) {
  const tabs = parseMarkdownTabs(markdown || "");
  const [activeTab, setActiveTab] = useState(0);

  // Fallback if no content
  if (tabs.length === 0) {
    return (
      <div className="markdown-body" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        <em>No description provided.</em>
      </div>
    );
  }

  // If there's only one tab, just render it normally without tabs UI
  if (tabs.length === 1) {
    return (
      <div className="markdown-body" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {tabs[0].content}
        </ReactMarkdown>
      </div>
    );
  }

  const currentTab = tabs[activeTab];

  return (
    <div style={{
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      background: "var(--bg-secondary)"
    }}>
      {/* Tabs Header */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        background: "var(--bg-secondary)", // Use theme secondary background
        borderBottom: "1px solid var(--border-color)",
        padding: "8px 8px 0 8px",
        gap: "4px"
      }}>
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          // Truncate long tab titles
          const displayTitle = tab.title.length > 30 ? tab.title.substring(0, 30) + "..." : tab.title;
          
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              style={{
                padding: "8px 16px",
                background: isActive ? "var(--bg-card)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                border: "1px solid",
                borderColor: isActive ? "var(--border-color) var(--border-color) transparent var(--border-color)" : "transparent",
                borderRadius: "4px 4px 0 0",
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s"
              }}
              title={tab.title} // Show full title on hover
            >
              {displayTitle}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="markdown-body" style={{ 
        padding: "var(--space-6)", 
        color: "var(--text-secondary)", 
        lineHeight: 1.7,
        background: "var(--bg-card)"
      }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {currentTab.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

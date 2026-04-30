import React from "react";
import { Book, Code, Terminal, Zap, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Documentation — EndGit",
  description: "Learn how to build, publish, and use Endstone plugins on EndGit.",
};

const SECTIONS = [
  {
    title: "Getting Started",
    icon: <Zap className="w-5 h-5 text-accent" />,
    links: [
      { name: "Introduction to EndGit", href: "#" },
      { name: "Quickstart Guide", href: "#" },
      { name: "EndGit CLI Installation", href: "#" },
    ]
  },
  {
    title: "Plugin Development",
    icon: <Code className="w-5 h-5 text-accent" />,
    links: [
      { name: "Python Plugin API", href: "#" },
      { name: "C++ Plugin API", href: "#" },
      { name: "Best Practices", href: "#" },
    ]
  },
  {
    title: "CI/CD & Publishing",
    icon: <Terminal className="w-5 h-5 text-accent" />,
    links: [
      { name: "Connecting GitHub Repos", href: "#" },
      { name: "Automated Builds", href: "#" },
      { name: "Marketplace Guidelines", href: "#" },
    ]
  },
  {
    title: "API Reference",
    icon: <FileText className="w-5 h-5 text-accent" />,
    links: [
      { name: "REST API Docs", href: "#" },
      { name: "Authentication", href: "#" },
      { name: "Webhooks", href: "#" },
    ]
  }
];

export default function DocsPage() {
  return (
    <div className="container" style={{ padding: "4rem 0", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem", maxWidth: "700px", margin: "0 auto 4rem auto" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }} className="text-gradient">
          EndGit Documentation
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>
          Everything you need to know about building, distributing, and using plugins within the Endstone ecosystem.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem",
        marginBottom: "4rem"
      }}>
        {SECTIONS.map((section, idx) => (
          <div key={idx} className="card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{
                background: "var(--bg-secondary)",
                padding: "0.75rem",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {section.icon}
              </div>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>{section.title}</h2>
            </div>
            
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {section.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <Link href={link.href} className="docs-link" style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                    transition: "color 0.2s"
                  }}>
                    {link.name}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "3rem", textAlign: "center", background: "var(--bg-secondary)", border: "1px dashed var(--border-color)" }}>
        <Book className="w-12 h-12 text-accent mx-auto" style={{ margin: "0 auto 1.5rem auto" }} />
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Still have questions?</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem auto" }}>
          Join our Discord community or visit the Endstone official documentation for framework-specific questions.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button className="btn btn-primary">Join Discord</button>
          <button className="btn btn-secondary">Endstone Docs</button>
        </div>
      </div>
    </div>
  );
}

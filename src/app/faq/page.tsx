"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";

interface FAQItemType {
  q: string;
  category: string;
  a: React.ReactNode;
}

const FAQ_ITEMS: FAQItemType[] = [
  {
    q: "What is EndGit?",
    category: "general",
    a: (
      <p>
        EndGit is a modern CI/CD platform and plugin marketplace for the{" "}
        <strong className="text-text-primary">Endstone</strong> ecosystem. It
        automates building, reviewing, and distributing C++ and Python plugins
        for Bedrock Dedicated Servers. Think of it as a replacement for Poggit,
        built with GitHub-native workflows.
      </p>
    ),
  },
  {
    q: "How do I publish a plugin?",
    category: "publishing",
    a: (
      <div className="grid gap-3">
        <p>Publishing a plugin is fully automated via GitHub integration:</p>
        <ol className="grid gap-2 list-decimal pl-5">
          <li>
            Install the{" "}
            <strong className="text-text-primary">EndGit GitHub App</strong> on
            your repository.
          </li>
          <li>
            Enable CI for your repo in the{" "}
            <strong className="text-text-primary">Dev Dashboard</strong>.
          </li>
          <li>
            Push code to GitHub — our runner pipelines will automatically build
            your plugin.
          </li>
          <li>
            Once the build succeeds, click{" "}
            <strong className="text-text-primary">"Submit for Review"</strong>{" "}
            on the build detail page.
          </li>
          <li>
            Fill out the submission form with your metadata, categories, and
            license.
          </li>
          <li>
            A repository reviewer will verify it against the rules and approve
            it.
          </li>
        </ol>
      </div>
    ),
  },
  {
    q: "How does CI/CD work?",
    category: "publishing",
    a: (
      <p>
        When you push code to a GitHub repository with CI enabled, EndGit
        receives a webhook notification. It queues a runner build job that
        compiles your C++ code (using CMake) or packages your Python plugin.
        Build artifacts (<code>.whl</code> for Python, <code>.dll</code>/
        <code>.so</code> for C++) are stored and available for download
        immediately as development builds.
      </p>
    ),
  },
  {
    q: "What is the weekly build quota?",
    category: "publishing",
    a: (
      <p>
        Each user starts with a weekly build quota (default: 50 builds/week) to
        manage shared compute resources. The quota resets every 7 days. You can
        track your usage in the Dev Dashboard. If you require more resources,
        feel free to open a ticket or contact an admin to request an extension.
      </p>
    ),
  },
  {
    q: "How do I install the GitHub App?",
    category: "publishing",
    a: (
      <p>
        Go to the Dev Dashboard and click{" "}
        <strong className="text-text-primary">"Install GitHub App"</strong>. You
        will be redirected to GitHub where you can grant access to select
        repositories. The app only requests read access to repository contents
        and write access to commit status checks.
      </p>
    ),
  },
  {
    q: "What are the submission rules?",
    category: "publishing",
    a: (
      <p>
        All marketplace listings must comply with our submission standards. Key
        guidelines include: plugins must be purposeful, code cannot be
        obfuscated, documentation and descriptions must be in English, and a
        recognized open source license must be present. Read the complete
        checklist at our{" "}
        <Link
          href="/rules"
          className="text-accent hover:underline font-semibold"
        >
          Rules Page
        </Link>
        .
      </p>
    ),
  },
  {
    q: "How do I use the CLI?",
    category: "cli",
    a: (
      <div className="grid gap-3">
        <p>Install the CLI utility with the following setup commands:</p>
        <div>
          <div className="text-xs font-semibold text-text-primary mb-1">
            Windows (PowerShell):
          </div>
          <pre className="p-3 bg-surface-secondary border border-border rounded-md font-mono text-xs overflow-x-auto text-brand">
            irm https://endgit.dev/installer.ps1 | iex
          </pre>
        </div>
        <div>
          <div className="text-xs font-semibold text-text-primary mb-1">
            Linux / macOS (Bash):
          </div>
          <pre className="p-3 bg-surface-secondary border border-border rounded-md font-mono text-xs overflow-x-auto text-brand">
            curl -sSL https://endgit.dev/installer.sh | bash
          </pre>
        </div>
        <p className="mt-2">Common cli commands available:</p>
        <ul className="grid gap-1 list-disc pl-5">
          <li>
            <code>endgit install &lt;plugin&gt;</code> — Download and install a
            plugin
          </li>
          <li>
            <code>endgit search &lt;query&gt;</code> — Search the directory
          </li>
          <li>
            <code>endgit list</code> — List currently installed plugins
          </li>
          <li>
            <code>endgit update</code> — Update all packages on your server
          </li>
        </ul>
      </div>
    ),
  },
  {
    q: "What languages/frameworks are supported?",
    category: "general",
    a: (
      <div className="grid gap-2">
        <p>
          EndGit offers native support for two Endstone plugin architectures:
        </p>
        <ul className="grid gap-1.5 list-disc pl-5">
          <li>
            <strong>Python plugins</strong> — Packaged as <code>.whl</code>{" "}
            wheels and built using standard pip packaging.
          </li>
          <li>
            <strong>C++ plugins</strong> — Compiled natively using CMake for
            ultimate performance, generating Windows <code>.dll</code> and Linux{" "}
            <code>.so</code> binaries.
          </li>
        </ul>
        <p className="mt-1">
          Both models have first-class marketplace representation and automated
          CI runners.
        </p>
      </div>
    ),
  },
  {
    q: "Is EndGit free to use?",
    category: "general",
    a: (
      <p>
        Yes, EndGit is completely free. We do not charge developers for build
        minutes, hosting, or hosting resources. All marketplace packages are
        open source and freely downloadable for server administrators.
      </p>
    ),
  },
  {
    q: "How can I get support?",
    category: "general",
    a: (
      <div className="grid gap-2">
        <p>Get in touch or join community discussion on our chat servers:</p>
        <ul className="grid gap-1.5 list-disc pl-5">
          <li>
            <a
              href="https://discord.gg/TcY9vxx9fE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-semibold"
            >
              Discord: 2Tech Studio Support
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/JPNrk7Bgeb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-semibold"
            >
              Discord: Endstone Official
            </a>
          </li>
        </ul>
        <p className="mt-1">
          For software issues, pull requests, and features, visit our GitHub
          repositories.
        </p>
      </div>
    ),
  },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "publishing", label: "Publishing & CI" },
  { id: "cli", label: "CLI" },
];

function FAQItem({ item }: { item: FAQItemType }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border border-border bg-surface-card overflow-hidden transition-all duration-200 rounded-lg ${open ? "border-brand/30" : ""}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 grid grid-cols-[1fr_auto] items-center gap-4 bg-transparent border-0 cursor-pointer text-left focus:outline-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-semibold text-sm text-text-primary leading-snug">
            {item.q}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted px-1.5 py-0.5 rounded bg-surface-secondary border border-border shrink-0">
            {item.category === "cli"
              ? "CLI"
              : item.category === "publishing"
                ? "CI"
                : item.category}
          </span>
        </div>
        <div
          className={`grid shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={16} className="text-text-muted" />
        </div>
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
            {item.a}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-10 lg:py-14">
      {/* Header */}
      <div className="mb-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-text-secondary text-base lg:text-lg">
          Find answers to commonly asked questions about EndGit.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-3xl mx-auto">
        <div className="flex-1 relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-brand transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-surface-card text-text-primary border-border shadow-sm"
                  : "bg-transparent text-text-muted border-transparent hover:text-text-secondary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      {filteredItems.length === 0 ? (
        <div className="border border-border bg-surface-card rounded-lg p-8 text-center max-w-3xl mx-auto">
          <Search
            size={28}
            className="text-text-muted mx-auto mb-3 opacity-50"
          />
          <h3 className="text-base font-semibold text-text-primary">
            No matching questions found
          </h3>
          <p className="text-text-muted mt-1 text-sm">
            Try searching for something else, or select another category.
          </p>
        </div>
      ) : (
        <div className="grid gap-2 max-w-3xl mx-auto">
          {filteredItems.map((item) => (
            <FAQItem key={item.q} item={item} />
          ))}
        </div>
      )}

      {/* Still have questions? */}
      <div className="mt-12 pt-8 border-t border-border max-w-3xl mx-auto">
        <p className="font-semibold text-text-primary mb-1">
          Still have questions?
        </p>
        <p className="text-text-muted text-sm mb-4">
          Join our Discord communities for direct developer help.
        </p>
        <a
          href="https://discord.gg/9eZhP9y26Q"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary inline-grid grid-cols-[auto_1fr] items-center gap-2 text-sm"
        >
          Join Discord
        </a>
      </div>
    </div>
  );
}

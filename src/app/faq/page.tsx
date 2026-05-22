"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

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
      <div className="flex flex-col gap-3">
        <p>Publishing a plugin is fully automated via GitHub integration:</p>
        <ol className="flex flex-col gap-2 list-decimal pl-5">
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
      <div className="flex flex-col gap-3">
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
        <ul className="flex flex-col gap-1 list-disc pl-5">
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
      <div className="flex flex-col gap-2">
        <p>
          EndGit offers native support for two Endstone plugin architectures:
        </p>
        <ul className="flex flex-col gap-1.5 list-disc pl-5">
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
      <div className="flex flex-col gap-2">
        <p>Get in touch or join community discussion on our chat servers:</p>
        <ul className="flex flex-col gap-1.5 list-disc pl-5">
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
  { id: "all", label: "All Questions" },
  { id: "general", label: "General" },
  { id: "publishing", label: "Publishing & CI" },
  { id: "cli", label: "CLI & Install" },
];

function FAQItem({ item }: { item: FAQItemType }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`card overflow-hidden transition-all duration-200 ${open ? "border-brand/40 bg-surface-secondary/40 shadow-sm" : ""}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex justify-between items-center gap-4 bg-transparent border-0 cursor-pointer text-left focus:outline-none"
      >
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[15px] text-text-primary leading-snug">
            {item.q}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted px-2 py-0.5 rounded bg-surface-secondary border border-border w-fit">
            {item.category === "cli"
              ? "CLI & Setup"
              : item.category === "publishing"
                ? "CI & Publishing"
                : item.category}
          </span>
        </div>
        <div
          className={`flex shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={18} className="text-text-muted" />
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed border-t border-border/10 pt-4">
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
    <div className="container py-8 md:py-12 lg:py-16">
      {/* Header */}
      <FadeIn>
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-lg bg-cyan-500/10 flex items-center justify-center mx-auto mb-4 border border-cyan-500/15">
            <HelpCircle size={28} className="text-accent" />
          </div>
          <h1 className="heading-1 mb-2">Frequently Asked Questions</h1>
          <p className="text-text-secondary text-[17px]">
            Find answers to commonly asked questions about EndGit.
          </p>
        </div>
      </FadeIn>

      {/* Interactive Controls */}
      <FadeIn delay={0.1}>
        <div className="relative mb-6 max-w-lg mx-auto">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-secondary border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-brand text-white border-brand shadow-sm shadow-brand/10"
                  : "bg-surface-secondary text-text-secondary border-border hover:bg-surface-secondary/85"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* FAQ List */}
      {filteredItems.length === 0 ? (
        <FadeIn delay={0.2}>
          <div className="card p-8 text-center mt-6">
            <Search
              size={32}
              className="text-text-muted mx-auto mb-3 opacity-50"
            />
            <h3 className="text-base font-semibold text-text-primary">
              No matching questions found
            </h3>
            <p className="text-text-muted mt-1 text-sm">
              Try searching for something else, or select another category tab
              above.
            </p>
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer staggerDelay={0.04} className="flex flex-col gap-3">
          {filteredItems.map((item) => (
            <StaggerItem key={item.q}>
              <FAQItem item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Still have questions? */}
      <FadeIn delay={0.25}>
        <div className="mt-12 p-6 text-center bg-cyan-500/5 rounded-lg border border-cyan-500/10">
          <p className="font-semibold text-text-primary mb-2">
            Still have questions?
          </p>
          <p className="text-text-muted text-sm mb-4">
            Join our active Discord communities for direct developer help and
            server support.
          </p>
          <a
            href="https://discord.gg/9eZhP9y26Q"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary inline-flex items-center gap-2 text-sm"
          >
            Join Discord Community
          </a>
        </div>
      </FadeIn>
    </div>
  );
}

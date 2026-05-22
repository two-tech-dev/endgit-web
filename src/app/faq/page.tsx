"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const FAQ_ITEMS = [
  {
    q: "What is EndGit?",
    a: "EndGit is a modern CI/CD platform and plugin marketplace for the Endstone ecosystem. It automates building, reviewing, and distributing C++ and Python plugins for Bedrock Dedicated Servers. Think of it as a replacement for Poggit, built with GitHub-native workflows.",
  },
  {
    q: "How do I publish a plugin?",
    a: '1. Install the EndGit GitHub App on your repository.\n2. Enable CI for your repo in the Dev Dashboard.\n3. Push code to GitHub — EndGit will automatically build it.\n4. Once the build succeeds, click "Submit for Review" on the build page.\n5. Fill out the submission form with your plugin details, categories, and license.\n6. A reviewer will approve or reject your submission.',
  },
  {
    q: "How does CI/CD work?",
    a: "When you push code to a GitHub repository with CI enabled, EndGit receives a webhook notification. It then queues a build job that compiles your C++ code (using CMake) or packages your Python plugin. Build artifacts (.whl for Python, .dll/.so for C++) are stored and available for download immediately as dev builds.",
  },
  {
    q: "What is the weekly build quota?",
    a: "Each user has a weekly build quota (default: 50 builds/week) to manage GitHub Actions resources. The quota resets every 7 days. You can see your current usage in the Dev Dashboard. If you need more builds, contact an admin to increase your quota.",
  },
  {
    q: "How do I install the GitHub App?",
    a: 'Go to the Dev Dashboard and click "Install GitHub App". You\'ll be redirected to GitHub where you can choose which repositories to grant access to. The app only needs read access to your code and write access to create build status checks.',
  },
  {
    q: "What are the submission rules?",
    a: "All plugins must comply with our submission rules before being approved. Key requirements include: the plugin must serve a specific purpose, code must not be obfuscated, descriptions must be in English, and an open source license is required. See the full rules at /rules.",
  },
  {
    q: "How do I use the CLI?",
    a: "Install the CLI with:\n\nWindows:\n  irm https://endgit.dev/installer.ps1 | iex\n\nLinux:\n  curl -sSL https://endgit.dev/installer.sh | bash\n\nThen you can use commands like:\n  endgit install <plugin>  — Install a plugin\n  endgit search <query>    — Search for plugins\n  endgit list              — List installed plugins\n  endgit update            — Update all plugins",
  },
  {
    q: "What languages/frameworks are supported?",
    a: "EndGit supports two types of Endstone plugins:\n\n• Python plugins — Packaged as .whl files, built using standard Python tooling.\n• C++ plugins — Compiled using CMake with cross-platform support (Linux .so and Windows .dll).\n\nBoth types are first-class citizens and go through the same review process.",
  },
  {
    q: "Is EndGit free to use?",
    a: "Yes, EndGit is completely free for plugin developers and server operators. The build infrastructure is provided at no cost. All plugins on the marketplace are open source and free to download.",
  },
  {
    q: "How can I get support?",
    a: "Join our Discord communities for help, bug reports, and feature requests:\n\n• Discord 2Tech Studio: https://discord.gg/TcY9vxx9fE\n• Discord Endstone: https://discord.gg/JPNrk7Bgeb\n\nYou can also open issues on our GitHub repository.",
  },
];

function FAQItem({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="card"
      style={{
        overflow: "hidden",
        transition: "all 200ms",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "var(--space-5)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--space-4)",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "var(--text-primary)",
            lineHeight: 1.4,
          }}
        >
          {item.q}
        </span>
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          <ChevronDown size={18} color="var(--text-muted)" />
        </div>
      </button>
      <div
        style={{
          maxHeight: open ? "500px" : "0",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.25s ease, opacity 0.25s ease",
        }}
      >
        <div
          style={{
            padding: "0 var(--space-5) var(--space-5)",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {item.a}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-16)",
        maxWidth: "780px",
      }}
    >
      {/* Header */}
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(6,182,212,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-4)",
              border: "1px solid rgba(6,182,212,0.15)",
            }}
          >
            <HelpCircle size={28} color="var(--accent-primary)" />
          </div>
          <h1 className="heading-1" style={{ marginBottom: "var(--space-2)" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-muted" style={{ fontSize: "1.0625rem" }}>
            Everything you need to know about EndGit.
          </p>
        </div>
      </FadeIn>

      {/* FAQ List */}
      <StaggerContainer
        staggerDelay={0.06}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {FAQ_ITEMS.map((item, i) => (
          <StaggerItem key={i}>
            <FAQItem item={item} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Still have questions? */}
      <FadeIn delay={0.2}>
        <div
          style={{
            marginTop: "var(--space-10)",
            padding: "var(--space-6)",
            textAlign: "center",
            background: "rgba(6,182,212,0.04)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(6,182,212,0.12)",
          }}
        >
          <p
            style={{
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "var(--space-2)",
            }}
          >
            Still have questions?
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              marginBottom: "var(--space-4)",
            }}
          >
            Join our Discord community for help and discussion.
          </p>
          <a
            href="https://discord.gg/9eZhP9y26Q"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            Join Discord
          </a>
        </div>
      </FadeIn>
    </div>
  );
}

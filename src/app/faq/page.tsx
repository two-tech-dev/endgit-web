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
    <div className="card overflow-hidden transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex justify-between items-center gap-4 bg-transparent border-0 cursor-pointer text-left focus:outline-none"
      >
        <span className="font-semibold text-[15px] text-text-primary leading-snug">
          {item.q}
        </span>
        <div
          className={`flex shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={18} className="text-text-muted" />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-250 ease-in-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed whitespace-pre-line">
          {item.a}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="container max-w-3xl py-12 md:py-20">
      {/* Header */}
      <FadeIn>
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-lg bg-cyan-500/10 flex items-center justify-center mx-auto mb-4 border border-cyan-500/15">
            <HelpCircle size={28} className="text-accent" />
          </div>
          <h1 className="heading-1 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-text-secondary text-[17px]">
            Everything you need to know about EndGit.
          </p>
        </div>
      </FadeIn>

      {/* FAQ List */}
      <StaggerContainer
        staggerDelay={0.06}
        className="flex flex-col gap-3"
      >
        {FAQ_ITEMS.map((item, i) => (
          <StaggerItem key={i}>
            <FAQItem item={item} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Still have questions? */}
      <FadeIn delay={0.2}>
        <div className="mt-10 p-6 text-center bg-cyan-500/5 rounded-lg border border-cyan-500/10">
          <p className="font-semibold text-text-primary mb-2">
            Still have questions?
          </p>
          <p className="text-text-muted text-sm mb-4">
            Join our Discord community for help and discussion.
          </p>
          <a
            href="https://discord.gg/9eZhP9y26Q"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            Join Discord
          </a>
        </div>
      </FadeIn>
    </div>
  );
}

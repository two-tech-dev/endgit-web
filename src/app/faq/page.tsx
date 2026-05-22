"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent p-5 text-left"
      >
        <span className="text-[0.9375rem] font-semibold leading-snug text-foreground">
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex shrink-0"
        >
          <ChevronDown size={18} className="text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm leading-7 text-foreground whitespace-pre-line">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <FadeIn>
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-[1.0625rem]">
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
        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="mb-2 font-semibold text-foreground">
            Still have questions?
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Join our Discord community for help and discussion.
          </p>
          <Button asChild size="sm">
            <a
              href="https://discord.gg/9eZhP9y26Q"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}

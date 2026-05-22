"use client";

import { Activity, ArrowRight, GitFork, ShieldCheck, Terminal, BookOpen } from "lucide-react";
import Link from "next/link";
import LatestPluginsSection from "@/components/LatestPluginsSection";
import CLITerminal from "@/components/CLITerminal";
import FadeIn from "@/components/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface HomeContentProps {
  stats: {
    plugins: number | string;
    downloads: number | string;
    builds: number | string;
  };
}

const FEATURES = [
  {
    icon: <ShieldCheck size={20} />,
    title: "Reviewed & Trusted",
    desc: "Every plugin is reviewed against our submission rules before being published to the marketplace.",
  },
  {
    icon: <Terminal size={20} />,
    title: "CLI Tooling",
    desc: "Install plugins, fetch dev builds, and manage versions from your terminal with the endgit CLI.",
  },
  {
    icon: <BookOpen size={20} />,
    title: "Open & Transparent",
    desc: "All plugins must be open source. Full source code and build logs are publicly available.",
  },
];

const STEPS = [
  {
    number: 1,
    title: "Push your code",
    desc: "Connect your GitHub repo. Every push triggers an automated build pipeline.",
  },
  {
    number: 2,
    title: "We compile & review",
    desc: "Our CI workers build your C++ or Python plugin and run it through our review process.",
  },
  {
    number: 3,
    title: "Users install instantly",
    desc: "Published to the registry. Anyone can install with endgit install <plugin>.",
  },
];

export default function HomeContent({ stats }: HomeContentProps) {
  return (
    <div className="flex flex-col">
      {/* ── Header card ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <header className="rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary" className="h-6 px-3 text-[0.68rem] tracking-[0.14em] uppercase">
                EndGit Plugin Registry
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ship plugins for Endstone in minutes
              </h1>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Push to GitHub, get compiled builds, and install with one command.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-1.5">
                <span className="font-semibold">{stats.plugins || "0"}</span> plugins
              </div>
              <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-1.5">
                <span className="font-semibold">{stats.downloads}</span> downloads
              </div>
              <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-1.5">
                <span className="font-semibold">{stats.builds}</span> builds
              </div>
            </div>
          </div>
        </header>
      </section>

      {/* ── Plugin preview ── */}
      <LatestPluginsSection />

      {/* ── CLI ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-10 lg:p-8">
          <div>
            <Badge variant="secondary" className="mb-3 h-5 px-2.5 text-[0.6rem] tracking-[0.14em] uppercase">
              EndGit CLI
            </Badge>
            <h2 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
              Install plugins from your terminal
            </h2>
            <p className="mb-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              One command to search, install, and manage Endstone plugins. No browser needed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-9 gap-2 px-4 text-xs font-semibold">
                <a
                  href="https://github.com/two-tech-dev/endgit-cli#installation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Terminal size={14} /> Install CLI
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-9 gap-2 px-4 text-xs">
                <a
                  href="https://github.com/two-tech-dev/endgit-cli"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub <ArrowRight size={14} />
                </a>
              </Button>
            </div>
          </div>

          {/* Terminal */}
          <CLITerminal />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            How it works
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            From code to users in three steps
          </h2>
        </div>
        <StaggerContainer className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <StaggerItem key={step.number}>
              <Card className="h-full border-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/35">
                <CardContent className="p-5">
                  <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {step.number}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-10 text-center">
            <span className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Why EndGit
            </span>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Built for the Endstone ecosystem
            </h2>
          </div>
        </FadeIn>

        <FadeIn className="mb-4">
          <Card className="border-border/70">
            <CardContent className="flex flex-wrap items-center gap-6 p-6 sm:p-8">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Activity size={26} />
              </div>
              <div className="min-w-[240px] flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Automated CI/CD Pipeline
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Push to GitHub and our workers compile your C++ or Python code
                  into ready-to-use artifacts automatically. No manual builds, no
                  configuration files to maintain — just push and ship.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <StaggerItem key={i}>
              <Card className="h-full border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader>
                  <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {f.icon}
                  </div>
                  <CardTitle className="text-sm font-semibold">{f.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {f.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FadeIn direction="none">
          <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center sm:px-8">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Ready to publish your plugin?
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Connect your GitHub, push your code, and let EndGit handle the rest.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="h-10 gap-2 px-5 text-sm font-semibold">
                  <Link href="/dashboard/dev">
                    <GitFork size={16} /> Start Publishing
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-10 gap-2 px-5 text-sm">
                  <Link href="/plugins">
                    Explore Plugins
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    </div>
  );
}

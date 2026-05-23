"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Terminal,
  Upload,
  Activity,
  ShieldCheck,
  GitFork,
  BookOpen,
  Cpu,
  Download,
  Star,
  BadgeCheck,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";
import AnimatedNumber from "@/components/AnimatedNumber";
import FadeIn from "@/components/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import PluginImage from "@/components/PluginImage";

interface Plugin {
  id: string;
  slug: string;
  displayName: string;
  iconUrl?: string;
  repoUrl?: string;
  latestVersion?: string;
  stars?: number;
  downloads?: number;
  isPreRelease?: boolean;
  author?: { displayName?: string; username?: string };
}

interface HomeContentProps {
  stats: {
    plugins: number | string;
    downloads: number | string;
    builds: number | string;
  };
  plugins?: Plugin[];
  children?: React.ReactNode;
}

const VERIFIED_ORGS = ["EndstoneMC", "two-tech-dev"];

function PluginCard({ plugin }: { plugin: Plugin }) {
  const repoOwner = plugin.repoUrl?.match(/github\.com\/([^/]+)/)?.[1];
  const isVerified = repoOwner ? VERIFIED_ORGS.includes(repoOwner) : false;
  const avgRating = plugin.stars
    ? Math.round((plugin.stars / 20) * 10) / 10
    : 0;

  return (
    <Link
      href={`/plugins/${plugin.slug}`}
      className="flex items-center gap-4 p-4 rounded-sm bg-white/[0.03] border border-white/[0.06] hover:border-brand/30 hover:bg-white/[0.06] transition-all duration-300 no-underline group w-[320px] lg:w-[380px] shrink-0 shadow-none lg:shadow-md"
    >
      <div className="w-14 h-14 shrink-0 rounded-sm overflow-hidden bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
        <PluginImage
          iconUrl={plugin.iconUrl}
          repoUrl={plugin.repoUrl}
          alt={`${plugin.displayName} icon`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold text-white/90 truncate group-hover:text-brand transition-colors">
            {plugin.displayName}
          </span>
          {isVerified && <BadgeCheck size={13} className="text-brand shrink-0" />}
          {plugin.isPreRelease && <FlaskConical size={12} className="text-error shrink-0" />}
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-white/30">
          <span className="flex items-center gap-1">
            <Download size={12} />
            {plugin.downloads?.toLocaleString() ?? 0}
          </span>
          {avgRating > 0 && (
            <span className="flex items-center gap-0.5 text-amber-400/70">
              <Star size={12} className="fill-current" />
              {avgRating.toFixed(1)}
            </span>
          )}
          <span>v{plugin.latestVersion || "1.0.0"}</span>
        </div>
      </div>
    </Link>
  );
}

function PluginCarousel({ plugins }: { plugins: Plugin[] }) {
  if (plugins.length === 0) return null;

  const row1 = plugins.filter((_, i) => i % 3 === 0);
  const row2 = plugins.filter((_, i) => i % 3 === 1);
  const row3 = plugins.filter((_, i) => i % 3 === 2);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
      <div className="flex flex-col gap-3">
        <div className="carousel-track-left flex gap-3">
          {[...row1, ...row1].map((p, i) => (
            <PluginCard key={`a-${i}`} plugin={p} />
          ))}
        </div>
        <div className="carousel-track-right flex gap-3">
          {[...row2, ...row2].map((p, i) => (
            <PluginCard key={`b-${i}`} plugin={p} />
          ))}
        </div>
        <div className="carousel-track-left-slow flex gap-3">
          {[...row3, ...row3].map((p, i) => (
            <PluginCard key={`c-${i}`} plugin={p} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .carousel-track-left {
          animation: scroll-left 30s linear infinite;
        }
        .carousel-track-left-slow {
          animation: scroll-left 40s linear infinite;
        }
        .carousel-track-right {
          animation: scroll-right 35s linear infinite;
        }
        .carousel-track-left:hover,
        .carousel-track-left-slow:hover,
        .carousel-track-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
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
    icon: <Upload size={20} />,
    title: "Push your code",
    desc: "Connect your GitHub repo. Every push triggers an automated build pipeline.",
  },
  {
    number: 2,
    icon: <Cpu size={20} />,
    title: "We compile & review",
    desc: "Our CI workers build your C++ or Python plugin and run it through our review process.",
  },
  {
    number: 3,
    icon: <Download size={20} />,
    title: "Users install instantly",
    desc: "Published to the registry. Anyone can install with endgit install <plugin>.",
  },
];

export default function HomeContent({ stats, plugins = [], children }: HomeContentProps) {
  return (
    <div className="grid">
      {/* ── Hero ── */}
      <section className="pt-15 pb-20 lg:pt-16 lg:pb-32 relative overflow-x-clip">
        {/* Massive Background Accent */}
        <div className="absolute -top-[20%] -left-[10%] w-[1000px] h-[1400px] rounded-full pointer-events-none" />

        <div className="container grid items-center gap-16 lg:gap-20 xl:gap-28 lg:grid-cols-[1.6fr_0.8fr] relative z-10">
          {/* Left: Copy */}
          <div className="min-w-0">
            <FadeIn delay={0} direction="down">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase px-4 py-1.5 rounded-full bg-white/5 text-brand border border-white/10 backdrop-blur-md">
                  Public Beta
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} direction="none">
              <h1 className="heading-1 mb-8">
                The next <br />
                <span className="text-brand">GENERATION</span> <br/>
                of plugins.
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed mb-10 font-medium">
                Ship high-performance Endstone plugins with our automated
                pipeline. Connect, push, and deploy to the world's most advanced
                registry.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-wrap gap-5">
                <Link
                  href="/plugins"
                  className="btn !bg-brand !text-black font-extrabold uppercase tracking-wide py-4 px-10 text-lg hover:scale-105 transition-transform no-underline"
                >
                  Explore Registry
                </Link>
                <a
                  href="https://github.com/two-tech-dev/endgit-cli#installation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn !bg-surface-secondary !text-text-primary border border-border font-extrabold uppercase tracking-wide py-4 px-10 text-lg hover:!bg-border transition-all no-underline"
                >
                  Get the CLI
                </a>
              </div>
            </FadeIn>

            {/* Inline stats */}
            <FadeIn delay={0.3}>
              <div className="grid grid-flow-col auto-cols-auto gap-8 lg:gap-12 mt-12 pt-8 border-t border-white/5 w-fit">
                {[
                  { label: "Plugins", value: stats.plugins || "0" },
                  { label: "Downloads", value: stats.downloads },
                  { label: "Builds", value: stats.builds },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-text-primary leading-none mb-1.5 tracking-tight">
                      <AnimatedNumber value={s.value} />
                    </div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Plugin Carousel */}
          {plugins.length > 0 && (
            <div className="min-w-0">
              <FadeIn delay={0.3} direction="none" duration={0.6}>
                <PluginCarousel plugins={plugins} />
              </FadeIn>
            </div>
          )}
        </div>
      </section>
      {children}
      {/* ── How it works ── */}
      <section className="container pb-10 lg:pb-16">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-wider uppercase text-text-muted block mb-2">
              How it works
            </span>
            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-text-primary m-0">
              From code to users in three steps
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((step) => (
            <StaggerItem
              key={step.number}
              className="step-card grid grid-cols-[auto_1fr] items-start gap-4 p-5 lg:p-6 bg-surface-card border border-border rounded-sm shadow-sm transition-all cursor-default sm:last:col-span-2 lg:last:col-span-1"
            >
              <div className="w-10 h-10 rounded-md bg-brand-light grid place-items-center text-brand font-bold text-sm shrink-0">
                {step.number}
              </div>
            <div className="min-w-0">
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed m-0">
                  {step.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── Features ── */}
      <section className="container pb-10 lg:pb-16">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-wider uppercase text-text-muted block mb-2">
              Why EndGit
            </span>
            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-text-primary m-0">
              Built for the Endstone ecosystem
            </h2>
          </div>
        </FadeIn>

        {/* CI/CD hero feature */}
        <FadeIn className="mb-5">
          <div className="card p-5 lg:p-8 grid grid-cols-[auto_1fr] gap-5 lg:gap-6 items-center">
            <div className="w-14 h-14 rounded-lg bg-brand-light grid place-items-center text-brand shrink-0">
              <Activity size={26} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Automated CI/CD Pipeline
              </h3>
              <p className="text-text-secondary text-base leading-relaxed m-0 max-w-[560px]">
                Push to GitHub and our workers compile your C++ or Python code
                into ready-to-use artifacts automatically. No manual builds, no
                configuration files to maintain — just push and ship.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Smaller feature cards */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <StaggerItem key={i} className="card p-6 grid gap-3">
              <div className="w-10 h-10 rounded-md bg-brand-light grid place-items-center text-brand">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-text-primary m-0">
                {f.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed m-0">
                {f.desc}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── CTA ── */}
      <section className="container pb-16 lg:pb-24">
        <FadeIn direction="none">
          <div className="bg-slate-900 dark:bg-zinc-900 rounded-xl p-6 lg:p-12 text-center grid justify-items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.08)_0%,transparent_60%)] pointer-events-none" />
            <h2 className="text-xl lg:text-3xl font-bold m-0 text-white relative">
              Ready to publish your plugin?
            </h2>
            <p className="text-slate-300 dark:text-zinc-300 text-base max-w-[420px] m-0 leading-relaxed relative">
              Connect your GitHub, push your code, and let EndGit handle the
              rest.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2 relative">
              <Link
                href="/dashboard/dev"
                className="btn bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-6 inline-grid grid-cols-[auto_1fr] items-center gap-2 no-underline"
              >
                <GitFork size={16} /> Start Publishing
              </Link>
              <Link
                href="/plugins"
                className="btn bg-white/10 hover:bg-white/15 text-white border border-white/20 py-3 px-6 inline-grid grid-cols-[auto_1fr] items-center gap-2 no-underline"
              >
                Explore Plugins
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      <style>{`
        .step-card {
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .step-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        @media (max-width: 768px) {
          .step-card:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

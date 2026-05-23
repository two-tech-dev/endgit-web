"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Zap,
  Terminal,
  Upload,
  Activity,
  ShieldCheck,
  GitFork,
  BookOpen,
  Cpu,
  Download,
} from "lucide-react";
import Link from "next/link";
import AnimatedNumber from "@/components/AnimatedNumber";
import FadeIn from "@/components/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

interface HomeContentProps {
  stats: {
    plugins: number | string;
    downloads: number | string;
    builds: number | string;
  };
  children?: React.ReactNode;
}

const COMMAND_TEXT = "endgit install endstone-warps";
const OUTPUT_LINES = [
  { text: "→ Saved to: plugins/endstone_warps-1.0.5-py3-none-any.whl" },
  { text: "✓ Installed endstone-warps@1.0.5", success: true },
];

function TerminalMock() {
  const [typedChars, setTypedChars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("terminal-seen")
    ) {
      setTypedChars(COMMAND_TEXT.length);
      setVisibleLines(OUTPUT_LINES.length);
      setShowCursor(false);
      setShowPrompt(true);
      return;
    }

    const t = timerRef.current;
    t.length = 0;

    const charDelay = 45;
    const lineDelay = 400;
    let offset = COMMAND_TEXT.length * charDelay + 400;

    for (let i = 1; i <= COMMAND_TEXT.length; i++) {
      t.push(setTimeout(() => setTypedChars(i), i * charDelay));
    }

    t.push(setTimeout(() => setShowCursor(false), offset));

    for (let i = 0; i < OUTPUT_LINES.length; i++) {
      offset += lineDelay;
      t.push(setTimeout(() => setVisibleLines(i + 1), offset));
    }

    offset += 600;
    t.push(
      setTimeout(() => {
        setShowCursor(false);
        setShowPrompt(true);
        sessionStorage.setItem("terminal-seen", "1");
      }, offset),
    );

    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <FadeIn
      delay={0.3}
      direction="right"
      duration={0.6}
      className="w-full h-[200px] lg:h-[260px] lg:max-w-[480px] xl:max-w-[560px] shrink-0"
    >
      <div className="bg-[#0c0c14] rounded-xl border border-[#1e1e2e] overflow-hidden shadow-lg w-full h-full">
        <div className="grid grid-flow-col auto-cols-max items-center gap-2 px-4 py-3 border-b border-[#1e1e2e] bg-[#11111b]">
          <div className="w-3 h-3 rounded-full bg-[#f38ba8]" />
          <div className="w-3 h-3 rounded-full bg-[#f9e2af]" />
          <div className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
          <span className="ml-2 text-xs text-[#585b70] font-mono">
            endgit-cli
          </span>
        </div>
        <div className="p-3 lg:p-5 font-mono text-xs lg:text-sm leading-relaxed h-[140px] lg:h-[200px] overflow-hidden">
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
            <span className="text-[#f38ba8] select-none">$</span>
            <span className="text-[#cdd6f4]">
              {COMMAND_TEXT.slice(0, typedChars)}
            </span>
            {showCursor && (
              <span className="inline-block w-2 h-[1.2em] bg-[#cdd6f4] animate-[blink_1s_step-end_infinite]" />
            )}
          </div>

          {OUTPUT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i}>
              <span
                className={line.success ? "text-[#a6e3a1]" : "text-[#89dceb]"}
              >
                {line.text}
              </span>
            </div>
          ))}

          {showPrompt && (
            <div className="mt-1 grid grid-cols-[auto_1fr] gap-2 items-center">
              <span className="text-[#f38ba8] select-none">$</span>
              <span className="inline-block w-2 h-[1.2em] bg-[#cdd6f4] animate-[blink_1s_step-end_infinite]" />
            </div>
          )}
        </div>
        <style>{`@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      </div>
    </FadeIn>
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

export default function HomeContent({ stats, children }: HomeContentProps) {
  return (
    <div className="grid">
      {/* ── Hero ── */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Massive Background Accent */}
        <div className="absolute -top-[20%] -left-[10%] w-[1000px] h-[1000px] bg-brand/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="container grid items-center gap-16 lg:gap-24 xl:gap-32 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
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
              <p className="text-xl text-text-secondary leading-relaxed max-w-[540px] mb-10 font-medium">
                Ship high-performance Endstone plugins with our automated
                pipeline. Connect, push, and deploy to the world’s most advanced
                registry.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-wrap gap-5">
                <Link
                  href="/plugins"
                  className="btn !bg-brand !text-black font-black uppercase tracking-tighter py-4 px-10 text-lg hover:scale-105 transition-transform no-underline"
                >
                  Explore Registry
                </Link>
                <a
                  href="https://github.com/two-tech-dev/endgit-cli#installation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn !bg-surface-secondary !text-text-primary border border-border font-black uppercase tracking-tighter py-4 px-10 text-lg hover:!bg-border transition-all no-underline"
                >
                  Get the CLI
                </a>
              </div>
            </FadeIn>

            {/* Inline stats */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-3 gap-6 lg:gap-8 mt-12 pt-8 border-t border-white/5">
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

          {/* Right: Terminal */}
          <div className="hidden lg:grid justify-items-center min-w-0">
            <TerminalMock />
          </div>
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
              className="step-card grid grid-cols-[auto_1fr] items-start gap-4 p-5 lg:p-6 bg-surface-card border border-border rounded-lg shadow-sm transition-all cursor-default sm:last:col-span-2 lg:last:col-span-1"
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

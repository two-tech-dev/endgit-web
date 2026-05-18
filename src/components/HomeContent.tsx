"use client";

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
import AnimatedNumber from "@/components/AnimatedNumber";
import LatestPluginsSection from "@/components/LatestPluginsSection";
import FadeIn from "@/components/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

interface HomeContentProps {
  stats: {
    plugins: number | string;
    downloads: number | string;
    builds: number | string;
  };
}

const TERMINAL_LINES = [
  { text: "endgit install endstone-warps", isCommand: true },
  { text: "→ Saved to: plugins/endstone_warps-1.0.5-py3-none-any.whl" },
  { text: "✓ Installed endstone-warps@1.0.5", success: true },
];

function TerminalMock() {
  return (
    <FadeIn delay={0.3} direction="right" duration={0.6}>
      <div
        style={{
          background: "#0c0c14",
          borderRadius: "var(--radius-xl)",
          border: "1px solid #1e1e2e",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          maxWidth: "520px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            borderBottom: "1px solid #1e1e2e",
            background: "#11111b",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "var(--radius-full)",
              background: "#f38ba8",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "var(--radius-full)",
              background: "#f9e2af",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "var(--radius-full)",
              background: "#a6e3a1",
            }}
          />
          <span
            style={{
              marginLeft: "8px",
              fontSize: "var(--text-xs)",
              color: "#585b70",
              fontFamily: "var(--font-mono)",
            }}
          >
            endgit-cli
          </span>
        </div>
        <div
          style={{
            padding: "20px",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            lineHeight: 1.8,
            minHeight: "200px",
          }}
        >
          {TERMINAL_LINES.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: "8px" }}>
              {line.isCommand ? (
                <>
                  <span style={{ color: "#f38ba8", userSelect: "none" }}>
                    ╰─λ
                  </span>
                  <span style={{ color: "#cdd6f4" }}>{line.text}</span>
                </>
              ) : (
                <span
                  style={{
                    color: line.success ? "#a6e3a1" : "#89dceb",
                    paddingLeft: "38px",
                  }}
                >
                  {line.text}
                </span>
              )}
            </div>
          ))}
          <div
            style={{
              marginTop: "4px",
              display: "flex",
              gap: "8px",
            }}
          >
            <span style={{ color: "#f38ba8", userSelect: "none" }}>╰─λ</span>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "16px",
                background: "#cdd6f4",
                animation: "blink 1s step-end infinite",
              }}
            />
          </div>
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

export default function HomeContent({ stats }: HomeContentProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* ── Hero ── */}
      <section
        style={{
          padding: "clamp(3.5rem, 10vw, 7rem) 0 clamp(3rem, 8vw, 5rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-10%",
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(2.5rem, 6vw, 5rem)",
            flexWrap: "wrap",
          }}
        >
          {/* Left: Copy */}
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <FadeIn delay={0} direction="down">
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.3rem 0.875rem",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-brand-light)",
                  color: "var(--accent-purple)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "var(--space-5)",
                }}
              >
                <Zap size={11} fill="currentColor" /> Public Beta
              </span>
            </FadeIn>

            <FadeIn delay={0.1} direction="none">
              <h1
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  margin: "0 0 var(--space-4) 0",
                  color: "var(--text-primary)",
                }}
              >
                Ship plugins for{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #4338ca)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Endstone
                </span>{" "}
                in minutes
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p
                style={{
                  fontSize: "var(--text-md)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  maxWidth: "480px",
                  margin: "0 0 var(--space-6) 0",
                }}
              >
                The plugin registry for Endstone — push to GitHub, get compiled
                builds, and install with one command.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <a
                  href="/plugins"
                  className="btn btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.75rem 1.75rem",
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                  }}
                >
                  Browse Plugins <ArrowRight size={16} />
                </a>
                <a
                  href="https://github.com/two-tech-dev/endgit-cli#installation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.75rem 1.5rem",
                    fontSize: "var(--text-base)",
                  }}
                >
                  <Terminal size={16} /> Install CLI
                </a>
              </div>
            </FadeIn>

            {/* Inline stats */}
            <FadeIn delay={0.3}>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-8)",
                  marginTop: "var(--space-8)",
                  paddingTop: "var(--space-5)",
                  borderTop: "1px solid var(--border-color)",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Plugins", value: stats.plugins || "0" },
                  { label: "Downloads", value: stats.downloads },
                  { label: "Builds", value: stats.builds },
                ].map((s, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontSize: "var(--text-xl)",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        lineHeight: 1,
                        marginBottom: "4px",
                      }}
                    >
                      <AnimatedNumber value={s.value} />
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right: Terminal */}
          <div
            style={{
              flex: "1 1 400px",
              display: "flex",
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            <TerminalMock />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        className="container"
        style={{ paddingBottom: "var(--space-16)" }}
      >
        <FadeIn>
          <div
            style={{
              textAlign: "center",
              marginBottom: "var(--space-10)",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "var(--space-2)",
              }}
            >
              How it works
            </span>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                margin: 0,
                color: "var(--text-primary)",
              }}
            >
              From code to users in three steps
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
            maxWidth: "640px",
            margin: "0 auto",
          }}
        >
          {STEPS.map((step) => (
            <StaggerItem
              key={step.number}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-5)",
                padding: "var(--space-5) var(--space-6)",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
                transition:
                  "transform var(--transition-base), box-shadow var(--transition-base)",
                cursor: "default",
              }}
              className="step-card"
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-brand-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-purple)",
                  flexShrink: 0,
                  fontWeight: 700,
                  fontSize: "var(--text-sm)",
                }}
              >
                {step.number}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    margin: "0 0 var(--space-1) 0",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── Recent Releases ── */}
      <LatestPluginsSection />

      {/* ── Features ── */}
      <section
        className="container"
        style={{ paddingBottom: "var(--space-16)" }}
      >
        <FadeIn>
          <div
            style={{
              textAlign: "center",
              marginBottom: "var(--space-10)",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "var(--space-2)",
              }}
            >
              Why EndGit
            </span>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                margin: 0,
                color: "var(--text-primary)",
              }}
            >
              Built for the Endstone ecosystem
            </h2>
          </div>
        </FadeIn>

        {/* CI/CD hero feature */}
        <FadeIn style={{ marginBottom: "var(--space-5)" }}>
          <div
            className="card"
            style={{
              padding: "var(--space-8)",
              display: "flex",
              gap: "var(--space-6)",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-brand-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-purple)",
                flexShrink: 0,
              }}
            >
              <Activity size={26} />
            </div>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <h3
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: "0 0 var(--space-2) 0",
                }}
              >
                Automated CI/CD Pipeline
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "var(--text-base)",
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: "560px",
                }}
              >
                Push to GitHub and our workers compile your C++ or Python code
                into ready-to-use artifacts automatically. No manual builds, no
                configuration files to maintain — just push and ship.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Smaller feature cards */}
        <StaggerContainer
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {FEATURES.map((f, i) => (
            <StaggerItem
              key={i}
              className="card"
              style={{
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-brand-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-purple)",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── CTA ── */}
      <section
        className="container"
        style={{ paddingBottom: "var(--space-16)" }}
      >
        <FadeIn direction="none">
          <div
            style={{
              background: "#0f172a",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-10) var(--space-8)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-4)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "600px",
                height: "300px",
                background:
                  "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <h2
              style={{
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                fontWeight: 700,
                margin: 0,
                color: "#ffffff",
                position: "relative",
              }}
            >
              Ready to publish your plugin?
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "var(--text-base)",
                maxWidth: "420px",
                margin: 0,
                lineHeight: 1.5,
                position: "relative",
              }}
            >
              Connect your GitHub, push your code, and let EndGit handle the
              rest.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "var(--space-2)",
                position: "relative",
              }}
            >
              <a
                href="/dashboard/dev"
                className="btn"
                style={{
                  background: "#ffffff",
                  color: "#0f172a",
                  border: "none",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.75rem 1.75rem",
                }}
              >
                <GitFork size={16} /> Start Publishing
              </a>
              <a
                href="/plugins"
                className="btn"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.75rem 1.5rem",
                }}
              >
                Explore Plugins
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      <style>{`
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

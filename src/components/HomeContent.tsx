"use client";

import {
  ArrowRight,
  Zap,
  Terminal,
  Upload,
  Activity,
  ShieldCheck,
  GitBranch,
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

function TerminalMock() {
  const lines = [
    { text: "endgit install endstone-warps", prefix: "$", isCommand: true },
    { text: "→ Saved to: plugins/endstone_warps-1.0.5-py3-none-any.whl" },
    { text: "✓ Installed endstone-warps@1.0.5", success: true },
  ];

  return (
    <FadeIn delay={0.3} direction="right" duration={0.6}>
      <div
        style={{
          background: "#0c0c14",
          borderRadius: "var(--radius-lg)",
          border: "1px solid #1e1e2e",
          overflow: "hidden",
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
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
              borderRadius: "50%",
              background: "#f38ba8",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#f9e2af",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#a6e3a1",
            }}
          />
          <span
            style={{
              marginLeft: "8px",
              fontSize: "0.75rem",
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
            fontSize: "0.8125rem",
            lineHeight: 1.8,
            minHeight: "200px",
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "8px",
                opacity: 1,
              }}
            >
              {line.isCommand ? (
                <>
                  <span style={{ color: "#89b4fa", userSelect: "none" }}>
                    {line.prefix}
                  </span>
                  <span style={{ color: "#cdd6f4" }}>{line.text}</span>
                </>
              ) : (
                <span style={{ color: line.success ? "#a6e3a1" : "#89dceb" }}>
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
            <span style={{ color: "#89b4fa", userSelect: "none" }}>$</span>
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

function StepCard({
  number,
  icon,
  title,
  desc,
  color,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <StaggerItem
      style={{
        flex: "1 1 280px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: `${color}12`,
          border: `2px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          marginBottom: "var(--space-4)",
          position: "relative",
        }}
      >
        {icon}
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: color,
            color: "#fff",
            fontSize: "0.6875rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {number}
        </span>
      </div>
      <h3
        style={{
          fontSize: "1.0625rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 var(--space-2) 0",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          margin: 0,
          maxWidth: "300px",
        }}
      >
        {desc}
      </p>
    </StaggerItem>
  );
}

export default function HomeContent({ stats }: HomeContentProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* ── Hero: Split layout ── */}
      <section
        style={{
          padding: "clamp(3rem, 8vw, 6rem) 0",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "-20%",
            width: "1100px",
            height: "800px",
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.03) 30%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-15%",
            width: "1200px",
            height: "900px",
            background:
              "radial-gradient(ellipse at center, rgba(6,182,212,0.05) 0%, rgba(6,182,212,0.02) 35%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(2rem, 6vw, 5rem)",
            flexWrap: "wrap",
          }}
        >
          {/* Left: Copy */}
          <div
            style={{
              flex: "1 1 420px",
              minWidth: 0,
            }}
          >
            <FadeIn delay={0} direction="down">
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.3rem 0.875rem",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(6,182,212,0.08)",
                  color: "var(--accent-cyan)",
                  border: "1px solid rgba(6,182,212,0.15)",
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
                className="heading-1"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  margin: "0 0 var(--space-4) 0",
                }}
              >
                Ship plugins for{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
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
                  fontSize: "clamp(0.9375rem, 2vw, 1.125rem)",
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
                    fontSize: "0.9375rem",
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
                    fontSize: "0.9375rem",
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
                  gap: "var(--space-6)",
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
                        fontSize: "1.5rem",
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
                        fontSize: "0.6875rem",
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
          <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent-purple)",
                display: "block",
                marginBottom: "var(--space-2)",
              }}
            >
              How it works
            </span>
            <h2
              className="heading-2"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              From code to users in three steps
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-8)",
            justifyContent: "center",
          }}
        >
          <StepCard
            number={1}
            icon={<Upload size={22} />}
            title="Push your code"
            desc="Connect your GitHub repo. Every push triggers an automated build pipeline."
            color="var(--accent-cyan)"
          />
          <StepCard
            number={2}
            icon={<Cpu size={22} />}
            title="We compile & review"
            desc="Our CI workers build your C++ or Python plugin and run it through our review process."
            color="var(--accent-purple)"
          />
          <StepCard
            number={3}
            icon={<Download size={22} />}
            title="Users install instantly"
            desc="Published to the registry. Anyone can install with endgit install <plugin>."
            color="var(--status-success)"
          />
        </StaggerContainer>
      </section>

      {/* ── Recent Releases ── */}
      <LatestPluginsSection />

      {/* ── Features: Asymmetric layout ── */}
      <section
        className="container"
        style={{ paddingBottom: "var(--space-16)" }}
      >
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent-cyan)",
                display: "block",
                marginBottom: "var(--space-2)",
              }}
            >
              Why EndGit
            </span>
            <h2
              className="heading-2"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Built for the Endstone ecosystem
            </h2>
          </div>
        </FadeIn>

        {/* Large feature card */}
        <FadeIn style={{ marginBottom: "var(--space-5)" }}>
          <div
            className="card"
            style={{
              padding: "var(--space-8)",
              display: "flex",
              gap: "var(--space-6)",
              alignItems: "center",
              flexWrap: "wrap",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(6,182,212,0.04))",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "var(--radius-lg)",
                background: "rgba(6,182,212,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-cyan)",
                flexShrink: 0,
              }}
            >
              <Activity size={28} />
            </div>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
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
                  fontSize: "0.9375rem",
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

        {/* Smaller feature cards grid */}
        <StaggerContainer
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {[
            {
              icon: <ShieldCheck size={22} />,
              bg: "rgba(16,185,129,0.1)",
              color: "var(--status-success)",
              title: "Reviewed & Trusted",
              desc: "Every plugin is reviewed against our submission rules before being published to the marketplace.",
            },
            {
              icon: <Terminal size={22} />,
              bg: "rgba(99,102,241,0.1)",
              color: "var(--accent-purple)",
              title: "CLI Tooling",
              desc: "Install plugins, fetch dev builds, and manage versions from your terminal with the endgit CLI.",
            },
            {
              icon: <BookOpen size={22} />,
              bg: "rgba(245,158,11,0.1)",
              color: "#f59e0b",
              title: "Open & Transparent",
              desc: "All plugins must be open source. Full source code and build logs are publicly available.",
            },
          ].map((f, i) => (
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
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-md)",
                  background: f.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: f.color,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.0625rem",
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
                  fontSize: "0.875rem",
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
              position: "relative",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "900px",
                height: "500px",
                background:
                  "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 40%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                padding: "var(--space-10) var(--space-8)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-4)",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                  fontWeight: 700,
                  margin: 0,
                  color: "white",
                }}
              >
                Ready to publish your plugin?
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "1rem",
                  maxWidth: "420px",
                  margin: 0,
                  lineHeight: 1.5,
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
                }}
              >
                <a
                  href="/dashboard/dev"
                  className="btn"
                  style={{
                    background: "white",
                    color: "#0f172a",
                    border: "none",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.75rem 1.75rem",
                  }}
                >
                  <GitBranch size={16} /> Start Publishing
                </a>
                <a
                  href="/plugins"
                  className="btn"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.15)",
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
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

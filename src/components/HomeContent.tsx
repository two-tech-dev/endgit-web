"use client";

import {
  ArrowRight,
  Zap,
  Terminal,
  Activity,
  ShieldCheck,
  GitBranch,
  BookOpen,
} from "lucide-react";
import TypewriterHeading from "@/components/TypewriterHeading";
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

export default function HomeContent({ stats }: HomeContentProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* ── Hero ── */}
      <section
        style={{
          padding: "clamp(4rem, 10vw, 8rem) 0 clamp(3rem, 8vw, 6rem)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "450px",
            background:
              "radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-5)",
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
              }}
            >
              <Zap size={11} fill="currentColor" /> Public Beta
            </span>
          </FadeIn>

          <FadeIn delay={0.1} direction="none">
            <TypewriterHeading />
          </FadeIn>

          <FadeIn delay={0.2}>
            <p
              className="text-muted"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.1875rem)",
                maxWidth: "540px",
                lineHeight: 1.65,
              }}
            >
              Discover, build, and deploy C++ &amp; Python plugins for Endstone
              — powered by GitHub CI/CD.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                marginTop: "var(--space-3)",
                flexWrap: "wrap",
                justifyContent: "center",
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
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Browse Releases <ArrowRight size={16} />
              </a>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#0f172a",
                  color: "#cbd5e1",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.875rem",
                }}
              >
                <span
                  style={{ color: "var(--accent-cyan)", userSelect: "none" }}
                >
                  $
                </span>
                <code>endgit install &lt;plugin&gt;</code>
              </div>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.4}>
          <div style={{ textAlign: "center", marginTop: "var(--space-3)" }}>
            <a
              href="https://github.com/two-tech-dev/endgit-cli#installation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted"
              style={{
                fontSize: "0.75rem",
                opacity: 0.6,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Install the Endgit CLI
            </a>
          </div>
        </FadeIn>
      </section>

      {/* ── Stats ── */}
      <section
        className="container"
        style={{ paddingBottom: "var(--space-12)" }}
      >
        <StaggerContainer
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            justifyContent: "center",
          }}
        >
          {[
            { label: "Plugins", value: stats.plugins || "0" },
            { label: "Downloads", value: stats.downloads },
            { label: "Builds", value: stats.builds },
          ].map((s, i) => (
            <StaggerItem
              key={i}
              style={{
                flex: "1 1 200px",
                maxWidth: "260px",
              }}
            >
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "var(--space-5) var(--space-6)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "2px",
                  }}
                >
                  <AnimatedNumber value={s.value} />
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: 0,
                  }}
                >
                  {s.label}
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
          <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
            <h2
              className="heading-2"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                letterSpacing: "-0.01em",
              }}
            >
              Everything you need to ship faster
            </h2>
            <p
              className="text-muted"
              style={{
                fontSize: "1.0625rem",
                marginTop: "var(--space-2)",
                maxWidth: "480px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              A modern alternative to Poggit — secure, fast, and built for
              Endstone.
            </p>
          </div>
        </FadeIn>

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
              icon: <Activity size={22} />,
              bg: "rgba(6,182,212,0.1)",
              color: "var(--accent-cyan)",
              title: "Automated CI/CD",
              desc: "Push to GitHub and our workers compile your C++ or Python code into ready-to-use artifacts automatically.",
            },
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
            className="card"
            style={{
              padding: "var(--space-10) var(--space-8)",
              textAlign: "center",
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              color: "white",
              border: "none",
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
                href="/plugins"
                className="btn btn-primary"
                style={{
                  background: "white",
                  color: "#0f172a",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Explore Releases
              </a>
              <a
                href="/dashboard/dev"
                className="btn btn-secondary"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid #334155",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <GitBranch size={16} /> Dev Dashboard
              </a>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

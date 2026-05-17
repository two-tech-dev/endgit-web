"use client";

import FadeIn from "@/components/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

export default function AnimatedFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-color)",
        padding: "3rem 0",
        marginTop: "auto",
        background: "var(--bg-secondary)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        {/* Brand */}
        <FadeIn delay={0} style={{ maxWidth: "280px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <img
              src="/logo.png"
              alt="EndGit"
              style={{ width: 24, height: 24, objectFit: "contain" }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "var(--text-primary)",
              }}
            >
              EndGit
            </span>
          </div>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            The modern CI/CD and plugin marketplace for the Endstone ecosystem.
          </p>
        </FadeIn>

        {/* Links */}
        <StaggerContainer
          staggerDelay={0.1}
          className="footer-links"
          style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}
        >
          <StaggerItem>
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: "var(--text-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.75rem",
                }}
              >
                Platform
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <a
                  href="/plugins"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Releases
                </a>
                <a
                  href="/builds"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Dev Builds
                </a>
                <a
                  href="/rules"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Submission Rules
                </a>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: "var(--text-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.75rem",
                }}
              >
                Community
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <a
                  href="https://discord.gg/9eZhP9y26Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Discord
                </a>
                <a
                  href="https://github.com/two-tech-dev/endgit-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Source code
                </a>
                <a
                  href="https://github.com/apps/endgit-local-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  GitHub App
                </a>
                <a
                  href="/faq"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  FAQ
                </a>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: "var(--text-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.75rem",
                }}
              >
                Legal
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <a
                  href="/terms"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Bottom bar */}
      <FadeIn delay={0.3}>
        <div
          className="container"
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              margin: 0,
            }}
          >
            &copy; {new Date().getFullYear()} EndGit. All rights reserved.
            {process.env.VERCEL_GIT_COMMIT_SHA && (
              <span
                style={{
                  marginLeft: "8px",
                  opacity: 0.7,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                }}
              >
                <a
                  href={`https://github.com/two-tech-dev/endgit-web/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  ({process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7)})
                </a>
              </span>
            )}
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              margin: 0,
            }}
          >
            Powered by{" "}
            <a
              href="https://discord.gg/9eZhP9y26Q"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--accent-cyan)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              2Tech
            </a>
          </p>
        </div>
      </FadeIn>
    </footer>
  );
}

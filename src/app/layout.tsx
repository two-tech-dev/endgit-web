import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EndGit — CI/CD & Plugin Marketplace for Endstone",
  description: "Discover, download, and publish Endstone plugins automatically from GitHub. The premier CI/CD and marketplace platform for Endstone servers.",
  keywords: ["endstone", "minecraft bedrock", "plugins", "ci/cd", "endstone plugins", "marketplace", "endgit"],
  openGraph: {
    title: "EndGit — Endstone Plugin Marketplace",
    description: "Discover, download, and publish Endstone plugins automatically from GitHub.",
    url: "https://endgit.dev",
    siteName: "EndGit",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "EndGit — CI/CD & Plugin Marketplace for Endstone",
    description: "Discover, download, and publish Endstone plugins automatically from GitHub.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="theme-color" content="#38BDF8" />
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var local = localStorage.getItem('theme');
                if (local === 'dark' || (local !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            })();
          `
        }} />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

import NavbarMobile from "@/components/NavbarMobile";

function Navbar() {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "#0a0a0a", // Standard dark theme background
      borderBottom: "1px solid #27272a", // Standard dark theme border
      padding: "1rem 0"
    }}>
      <div className="container navbar-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
        <a href="/" className="navbar-logo" style={{ fontSize: "1.5rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", flexShrink: 0 }}>
          <img src="/logo.png" alt="EndGit Logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <span style={{ color: "white" }}>EndGit</span>
        </a>
        <NavbarMobile />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border-color)", padding: "3rem 0", marginTop: "auto", background: "var(--bg-secondary)" }}>
      <div className="container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem" }}>
        {/* Brand */}
        <div style={{ maxWidth: "280px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <img src="/logo.png" alt="EndGit" style={{ width: 24, height: 24, objectFit: "contain" }} />
            <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)" }}>EndGit</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.6, margin: 0 }}>
            The modern CI/CD and plugin marketplace for the Endstone ecosystem.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Platform</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <a href="/plugins" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>Releases</a>
              <a href="/builds" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>Dev Builds</a>
              <a href="/rules" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>Submission Rules</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Community</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <a href="https://discord.gg/9eZhP9y26Q" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>Discord</a>
              <a href="https://github.com/two-tech-dev/endgit-web" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>Source code</a>
              <a href="https://github.com/apps/endgit-local-dev" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>GitHub App</a>
              <a href="/faq" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>FAQ</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Legal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <a href="/terms" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container" style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0 }}>
          &copy; {new Date().getFullYear()} EndGit. All rights reserved.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0 }}>
          Powered by <a href="https://discord.gg/9eZhP9y26Q" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 600 }}>2Tech</a>
        </p>
      </div>
    </footer>
  );
}

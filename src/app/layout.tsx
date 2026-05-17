import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EndGit — CI/CD & Plugin Marketplace for Endstone",
  description:
    "Discover, download, and publish Endstone plugins automatically from GitHub. The premier CI/CD and marketplace platform for Endstone servers.",
  keywords: [
    "endstone",
    "minecraft bedrock",
    "plugins",
    "ci/cd",
    "endstone plugins",
    "marketplace",
    "endgit",
  ],
  metadataBase: new URL("https://endgit.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EndGit — Endstone Plugin Marketplace",
    description:
      "Discover, download, and publish Endstone plugins automatically from GitHub.",
    url: "https://endgit.dev",
    siteName: "EndGit",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "EndGit — CI/CD & Plugin Marketplace for Endstone",
    description:
      "Discover, download, and publish Endstone plugins automatically from GitHub.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                var local = localStorage.getItem('theme');
                if (local === 'dark' || (local !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            })();
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <AnimatedFooter />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import NavbarMobile from "@/components/NavbarMobile";
import AnimatedFooter from "@/components/AnimatedFooter";

function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        padding: "1rem 0",
      }}
    >
      <div
        className="container navbar-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <a
          href="/"
          className="navbar-logo"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src="/logo.png"
            alt="EndGit Logo"
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
          <span style={{ color: "var(--text-primary)" }}>EndGit</span>
        </a>
        <NavbarMobile />
      </div>
    </header>
  );
}



import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: metadata = {
  title: "endgit — ci/cd & plugin marketplace for endstone",
  description:
    "discover, download, and publish endstone plugins automatically from github. the premier ci/cd and marketplace platform for endstone servers.",
  keywords: [
    "endstone",
    "minecraft bedrock",
    "plugins",
    "ci/cd",
    "endstone plugins",
    "marketplace",
    "endgit",
  ],
  metadatabase: new url("https://endgit.dev"),
  alternates: {
    canonical: "/",
  },
  opengraph: {
    title: "endgit — endstone plugin marketplace",
    description:
      "discover, download, and publish endstone plugins automatically from github.",
    url: "https://endgit.dev",
    sitename: "endgit",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "endgit — ci/cd & plugin marketplace for endstone",
    description:
      "discover, download, and publish endstone plugins automatically from github.",
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

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EndGit — CI/CD & Plugin Marketplace for Endstone",
  description: "Discover, download, and publish Endstone plugins automatically from GitHub.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
      background: "var(--bg-card)",
      borderBottom: "1px solid var(--border-color)",
      padding: "1rem 0"
    }}>
      <div className="container navbar-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
        <a href="/" className="navbar-logo" style={{ fontSize: "1.5rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", flexShrink: 0 }}>
          <img src="/logo.png" alt="EndGit Logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <span className="text-gradient">EndGit</span>
        </a>
        <NavbarMobile />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border-color)", padding: "3rem 0", marginTop: "auto", background: "var(--bg-secondary)" }}>
      <div className="container" style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <p>&copy; {new Date().getFullYear()} EndGit Platform. Built for the Endstone ecosystem.</p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
  metadataBase: new URL("https://endgit.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "endgit — endstone plugin marketplace",
    description:
      "discover, download, and publish endstone plugins automatically from github.",
    url: "https://endgit.dev",
    siteName: "endgit",
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
          <main className="">{children}</main>
          <Footer />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import NavbarMobile from "@/components/NavbarMobile";
import Footer from "@/components/Footer";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-surface-secondary/80 backdrop-blur-md border-b border-border py-3 xl:py-5">
      <div className="container flex justify-between items-center relative">
        <Link
          href="/"
          className="text-2xl font-bold flex items-center gap-3 no-underline shrink-0"
        >
          <Image
            src="/logo.png"
            alt="EndGit Logo"
            width={42}
            height={42}
            className="object-contain"
            priority
          />
          <span className="text-text-primary">
            endgit<span className="text-brand">.</span>{" "}
          </span>
        </Link>
        <NavbarMobile />
      </div>
    </header>
  );
}

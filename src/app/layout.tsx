import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  display: "swap",
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
      )}
    >
      <meta name="theme-color" content="#005F5A" />
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                var el = document.documentElement;
                var saved = localStorage.getItem('theme');
                var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  el.classList.add('dark');
                } else {
                  el.classList.remove('dark');
                }
                el.setAttribute('data-theme', isDark ? 'dark' : 'light');
              } catch (e) {}
            })();
          `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1 pt-16 sm:pt-20">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import { SiteNavbar } from "@/components/NavbarMobile";
import Footer from "@/components/Footer";

function Navbar() {
  return <SiteNavbar />;
}

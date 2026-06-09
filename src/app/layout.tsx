import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NavbarMobile from "@/components/NavbarMobile";
import Footer from "@/components/Footer";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
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
      <meta name="theme-color" content="#fdfcfc" />
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
      <body className={geistMono.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              document.body.classList.add('no-transitions');
              window.addEventListener('load', function() {
                setTimeout(function() {
                  document.body.classList.remove('no-transitions');
                }, 100);
              });
            })();
            `,
          }}
        />
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface py-3">
      <div className="container grid grid-cols-[1fr_auto] items-center gap-4">
        <Link
          href="/"
          className="font-mono text-base font-bold leading-none tracking-normal text-text-primary no-underline shrink-0"
          aria-label="EndGit home"
        >
          <span className="hidden sm:inline">[endgit]</span>
          <span className="sm:hidden">[eg]</span>
        </Link>
        <NavbarMobile />
      </div>
    </header>
  );
}

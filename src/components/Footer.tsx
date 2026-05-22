import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-background/35 px-4 py-8 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:px-6 lg:px-8 dark:border-white/8 dark:bg-black/20 dark:shadow-[0_-8px_30px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-wrap justify-between gap-8">
          {/* Brand */}
          <div className="max-w-[280px]">
            <div className="mb-3 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="EndGit"
                width={28}
                height={28}
                style={{ objectFit: "contain" }}
              />
              <span className="text-base font-semibold text-foreground">
                endgit<span style={{ color: "#2dd4bf" }}>.</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The modern CI/CD and plugin marketplace for the Endstone ecosystem.
            </p>
          </div>

          {/* Link Columns */}
          <div className="flex flex-wrap gap-12">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                Platform
              </h4>
              <div className="flex flex-col gap-2">
                <Link href="/plugins" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Releases
                </Link>
                <Link href="/builds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dev Builds
                </Link>
                <Link href="/rules" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Submission Rules
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                Community
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  href="https://discord.gg/9eZhP9y26Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discord
                </a>
                <a
                  href="https://github.com/two-tech-dev/endgit-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Source code
                </a>
                <a
                  href="https://github.com/apps/endgit-local-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub App
                </a>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                Legal
              </h4>
              <div className="flex flex-col gap-2">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-6 dark:border-white/6">
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} EndGit. All rights reserved.
            {process.env.VERCEL_GIT_COMMIT_SHA && (
              <span className="ml-2 font-mono text-[0.65rem] opacity-60">
                <a
                  href={`https://github.com/two-tech-dev/endgit-web/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  ({process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7)})
                </a>
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://2tech.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              2Tech Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

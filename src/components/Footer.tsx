import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 md:py-12 mt-auto bg-surface-secondary">
      <div className="container flex flex-wrap justify-between gap-6 md:gap-8">
        {/* Brand */}
        <div className="max-w-[280px]">
          <div className="flex items-center gap-2 mb-3">
            <Image
              src="/logo.png"
              alt="EndGit"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-bold text-lg text-text-primary">
              endgit<span className="text-brand">.</span>
            </span>
          </div>
          <p className="text-text-muted text-xs leading-relaxed m-0">
            The modern CI/CD and plugin marketplace for the Endstone ecosystem.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links flex gap-8 md:gap-12 flex-wrap">
          <div>
            <h4 className="font-semibold text-xs text-text-primary uppercase tracking-wider mb-3">
              Platform
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/plugins"
                className="text-text-muted text-sm hover:text-text-primary transition-colors no-underline"
              >
                Releases
              </Link>
              <Link
                href="/builds"
                className="text-text-muted text-sm hover:text-text-primary transition-colors no-underline"
              >
                Dev Builds
              </Link>
              <Link
                href="/rules"
                className="text-text-muted text-sm hover:text-text-primary transition-colors no-underline"
              >
                Submission Rules
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-text-primary uppercase tracking-wider mb-3">
              Community
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://discord.gg/9eZhP9y26Q"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted text-sm hover:text-text-primary transition-colors no-underline"
              >
                Discord
              </a>
              <a
                href="https://github.com/two-tech-dev/endgit-web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted text-sm hover:text-text-primary transition-colors no-underline"
              >
                Source code
              </a>
              <a
                href="https://github.com/apps/endgit-local-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted text-sm hover:text-text-primary transition-colors no-underline"
              >
                GitHub App
              </a>
              <Link
                href="/faq"
                className="text-text-muted text-sm hover:text-text-primary transition-colors no-underline"
              >
                FAQ
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-text-primary uppercase tracking-wider mb-3">
              Legal
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/terms"
                className="text-text-muted text-sm hover:text-text-primary transition-colors no-underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-text-muted text-sm hover:text-text-primary transition-colors no-underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container mt-8 pt-6 border-t border-border flex justify-between items-center flex-wrap gap-2">
        <p className="text-text-muted text-xs m-0" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} EndGit. All rights reserved.
          {process.env.VERCEL_GIT_COMMIT_SHA && (
            <span className="ml-2 opacity-70 font-mono text-[11px]">
              <a
                href={`https://github.com/two-tech-dev/endgit-web/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit no-underline"
              >
                ({process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7)})
              </a>
            </span>
          )}
        </p>
        <p className="text-text-muted text-xs m-0">
          Powered by{" "}
          <a
            href="https://2tech.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand no-underline font-semibold"
          >
            2Tech Studio
          </a>
        </p>
      </div>
    </footer>
  );
}

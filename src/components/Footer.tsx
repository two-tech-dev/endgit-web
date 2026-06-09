import Link from "next/link";

const footerLinks = [
  { href: "/plugins", label: "Plugins" },
  { href: "/builds", label: "Builds" },
  { href: "/faq", label: "FAQ" },
  { href: "https://discord.gg/9eZhP9y26Q", label: "Discord" },
  { href: "https://github.com/two-tech-dev/endgit-web", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface py-8 text-sm text-text-secondary lg:mt-32">
      <div className="container">
        <div className="grid grid-cols-1 border border-border sm:grid-cols-2 lg:grid-cols-5">
          {footerLinks.map((link) => {
            const external = link.href.startsWith("http");
            const className =
              "flex min-h-11 items-center justify-center border-b border-border px-4 py-3 text-center hover:bg-surface-secondary hover:text-text-primary hover:underline sm:[&:nth-child(2n-1)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0";

            if (external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link key={link.href} href={link.href} className={className}>
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 text-xs text-text-muted lg:grid-cols-[1fr_auto] lg:items-center">
          <p className="m-0" suppressHydrationWarning>
            © {new Date().getFullYear()} EndGit
            {process.env.VERCEL_GIT_COMMIT_SHA && (
              <span className="ml-2 opacity-70">
                <a
                  href={`https://github.com/two-tech-dev/endgit-web/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-inherit hover:underline"
                >
                  ({process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7)})
                </a>
              </span>
            )}
          </p>
          <p className="m-0">
            <Link
              href="/terms"
              className="hover:text-text-primary hover:underline"
            >
              Terms
            </Link>
            <span className="px-2">·</span>
            <Link
              href="/privacy"
              className="hover:text-text-primary hover:underline"
            >
              Privacy
            </Link>
            <span className="px-2">·</span>
            <a
              href="https://2tech.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary hover:underline"
            >
              2Tech Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Shield, BookOpen, Code, FileText, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submission Rules - EndGit",
  description:
    "Guidelines and rules for submitting plugins to the EndGit registry.",
};

const RULE_CATEGORIES = [
  {
    id: "purpose",
    label: "What We Accept",
    prefix: "A",
    icon: "shield",
    color: "#8b5cf6",
    description:
      "Plugins should be useful, honest, and appropriate for public servers.",
    rules: [
      {
        id: "A1",
        title: "Useful for server owners",
        text: "Your plugin should have a clear use case for Endstone servers. Small utilities, focused tools, and quality-of-life plugins are welcome as long as the description explains who it helps and why.",
      },
      {
        id: "A2",
        title: "Be honest about scope",
        text: "Experimental, beta, or server-specific features are allowed, but they must be clearly labeled. Do not present unfinished features as stable or production-ready.",
      },
      {
        id: "A3",
        title: "Original work or permitted forks",
        text: "Submit your own work, or a fork you are allowed to maintain. Forks and alternatives are allowed when they add meaningful changes, fix abandoned work, or explain how they differ from existing plugins.",
      },
      {
        id: "A4",
        title: "No harmful or deceptive behavior",
        text: "Plugins must not hide malicious behavior, mislead users, steal data, abuse permissions, or run code from remote sources to bypass EndGit review.",
      },
      {
        id: "A5",
        title: "External services are allowed when transparent",
        text: "Plugins may use external APIs or services if the dependency is clearly documented, failure is handled gracefully, and users can understand what data is sent outside their server.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical Quality",
    prefix: "B",
    icon: "code",
    color: "#06b6d4",
    description:
      "Code should be maintainable enough for review and safe enough to run.",
    rules: [
      {
        id: "B1",
        title: "Declare compatibility",
        text: "Declare the supported Endstone API version and any required dependencies in the manifest and submission form. If a dependency is optional, document what happens when it is missing.",
      },
      {
        id: "B2",
        title: "Readable source required",
        text: "Reviewers must be able to inspect the source code. Obfuscated code, bytecode-only Python submissions, or missing C++ source may be rejected.",
      },
      {
        id: "B3",
        title: "Keep startup output reasonable",
        text: "Console output is fine when it helps diagnose setup or errors. Avoid noisy banners, repeated logs, or promotional output on every startup.",
      },
      {
        id: "B4",
        title: "Use stable APIs when possible",
        text: "Prefer Endstone APIs over raw protocol manipulation or fragile internals. Low-level approaches are acceptable when there is no practical API alternative and the reason is explained.",
      },
      {
        id: "B5",
        title: "Names should not collide",
        text: "Use distinctive plugin names, permission names, package/module names, and database table names so your plugin does not conflict with other plugins.",
      },
    ],
  },
  {
    id: "docs",
    label: "Documentation",
    prefix: "D",
    icon: "book",
    color: "#10b981",
    description:
      "Users should understand what the plugin does before installing it.",
    rules: [
      {
        id: "D1",
        title: "Explain the plugin clearly",
        text: "Include what the plugin does, basic setup steps, important commands or permissions, and any known limitations. A short but clear README is better than a long vague one.",
      },
      {
        id: "D2",
        title: "English summary required",
        text: "The main description should include an English summary. Additional languages are welcome and encouraged.",
      },
      {
        id: "D3",
        title: "Changelogs should help users",
        text: "Updates should include user-readable changelogs for meaningful changes. Tiny maintenance-only updates can be brief.",
      },
      {
        id: "D4",
        title: "License required",
        text: "Include a license file so users know how the plugin may be used, shared, and modified. Open-source licenses are strongly preferred for marketplace trust.",
      },
      {
        id: "D5",
        title: "Default must be English",
        text: "It is great if your plugin supports other languages, but since English is the most common language that players in the community know, the default language must be set as English.",
      },
    ],
  },
  {
    id: "security",
    label: "Security & Performance",
    prefix: "S",
    icon: "lock",
    color: "#ef4444",
    description:
      "These are the rules most likely to block approval because they protect servers.",
    rules: [
      {
        id: "S1",
        title: "Do not freeze the server",
        text: "Long network calls, heavy file I/O, expensive database work, and large computations should not run on the main server thread.",
      },
      {
        id: "S2",
        title: "Protect user data and credentials",
        text: "Never log tokens, passwords, API keys, or private user data. Do not commit credentials to source code, and use encrypted connections for sensitive communication.",
      },
      {
        id: "S3",
        title: "Prevent injection vulnerabilities",
        text: "Use prepared statements or parameterized queries for SQL. Treat player input, config values, and external API responses as untrusted.",
      },
      {
        id: "S4",
        title: "Clean up resources",
        text: "Close database connections, cancel scheduled tasks, release file handles, and stop background workers when the plugin is disabled.",
      },
      {
        id: "S5",
        title: "Use permissions for protected actions",
        text: "Commands or actions that affect other players, economy, files, worlds, or server state should be protected by clear permissions.",
      },
    ],
  },
];

function CategoryIcon({ icon, color }: { icon: string; color: string }) {
  const style = { color };
  switch (icon) {
    case "shield":
      return <Shield size={20} style={style} />;
    case "code":
      return <Code size={20} style={style} />;
    case "file":
      return <FileText size={20} style={style} />;
    case "book":
      return <BookOpen size={20} style={style} />;
    case "lock":
      return <Lock size={20} style={style} />;
    default:
      return <Shield size={20} style={style} />;
  }
}

export default function RulesPage() {
  return (
    <div className="container max-w-4xl py-12 lg:py-20">
      {/* Hero Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-sm bg-linear-to-br from-purple-500/10 to-cyan-500/10 grid place-items-center mx-auto mb-5 border border-purple-500/15">
          <Shield size={32} className="text-accent" />
        </div>
        <h1 className="heading-1 mb-3">Plugin Submission Guidelines</h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-[17px] leading-relaxed">
          EndGit review focuses on safety, transparency, and usefulness. These
          guidelines are intentionally practical: they explain what reviewers
          look for, not how to write your plugin.
        </p>
      </div>

      {/* Rule Categories */}
      <div className="grid gap-12">
        {RULE_CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id}>
            {/* Category Header */}
            <div
              style={{ borderBottomColor: `${cat.color}30` }}
              className="grid grid-flow-col auto-cols-max items-center gap-3 mb-6 pb-3 border-b-2"
            >
              <div
                style={{ background: `${cat.color}15` }}
                className="w-9 h-9 rounded-sm grid place-items-center"
              >
                <CategoryIcon icon={cat.icon} color={cat.color} />
              </div>
              <div>
                <h2 className="heading-3 m-0 grid grid-flow-col auto-cols-max items-center gap-2">
                  <span
                    style={{ color: cat.color }}
                    className="font-mono text-sm"
                  >
                    {cat.prefix}
                  </span>
                  {cat.label}
                </h2>
                <p className="m-0 text-xs text-text-muted mt-0.5">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Rules List */}
            <div className="grid gap-4">
              {cat.rules.map((rule) => (
                <div
                  key={rule.id}
                  style={{ borderLeftColor: `${cat.color}60` }}
                  className="card p-5 border-l-3 transition-all duration-200"
                >
                  <div className="grid grid-cols-[auto_1fr] items-start gap-4">
                    <span
                      style={{
                        background: `${cat.color}12`,
                        color: cat.color,
                      }}
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm whitespace-nowrap shrink-0 mt-0.5"
                    >
                      {rule.id}
                    </span>
                    <div className="min-w-0">
                      <h3 className="m-0 text-[15px] font-semibold text-text-primary mb-1.5">
                        {rule.title}
                      </h3>
                      <p className="m-0 text-sm text-text-secondary leading-relaxed">
                        {rule.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-12 p-6 bg-error/5 rounded-sm border border-error/15 text-center">
        <p className="font-semibold text-text-primary mb-2">
          Review Philosophy
        </p>
        <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed m-0">
          Most issues can be fixed during review. Rejection is mainly for unsafe
          behavior, misleading submissions, missing source, or plugins that
          cannot reasonably be reviewed. If you are unsure about a guideline,
          ask on Discord before submitting.
        </p>
      </div>
    </div>
  );
}

import {
  Shield,
  BookOpen,
  Code,
  FileText,
  Lock,
  ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submission Rules - EndGit",
  description:
    "Guidelines and rules for submitting plugins to the EndGit registry.",
};

const RULE_CATEGORIES = [
  {
    id: "purpose",
    label: "Purpose & Ethics",
    prefix: "A",
    icon: "shield",
    color: "#8b5cf6",
    description: "Plugins must be purposeful, original, and ethical.",
    rules: [
      {
        id: "A1",
        title: "Must serve a purpose",
        count: 0,
        text: "Plugins must serve a purpose that cannot be replicated using Endstone's built-in features. Plugins that only provide command aliases or shortcuts to built-in functionality will not be approved.",
      },
      {
        id: "A2",
        title: "Serve a specific purpose",
        count: 0,
        text: 'The plugin must serve a **specific** purpose and be useful to the majority of server operators. Core/private-server-only plugins are not accepted. Plugins containing many mutually irrelevant features bundled together ("kitchen sink" plugins) are also not allowed.',
      },
      {
        id: "A3",
        title: "No duplicates",
        count: 0,
        text: "If an existing approved plugin covers every feature your plugin provides, you must not submit yours — unless the existing one has been unmaintained for **more than 30 days**. If submitting a competing plugin, explain why yours is better or different in the description.",
      },
      {
        id: "A4",
        title: "No remote code execution",
        count: 0,
        text: "Plugins must not execute code fetched from remote sources at runtime. If the plugin requires an external API, it must be from a reputable provider or have high transparency. Auto-updaters that bypass EndGit's CI/CD pipeline are strictly prohibited.",
      },
      {
        id: "A5a",
        title: "No artificial limitations",
        count: 0,
        text: "Artificially created limitations (e.g., feature-gating behind paid plans, license keys, or subscriptions to unlock self-imposed restrictions) are not allowed.",
      },
      {
        id: "A5b",
        title: "No unsolicited advertisement",
        count: 0,
        text: "Plugins must not be used as a medium to advertise external servers, products, or resources unless explicitly requested by the user (e.g., through a help command). Reasonable contact information in the description is permitted.",
      },
      {
        id: "A5c",
        title: "Use of external APIs",
        count: 0,
        text: "External APIs (especially HTTP/HTTPS requests) should only be used when reasonably necessary, such as when involving a public database or large dataset that cannot practically be distributed with the plugin.",
      },
      {
        id: "A5d",
        title: "Availability of external APIs",
        count: 0,
        text: "Any external API used by a plugin must offer a free tier with a reasonable rate limit. Plugins that depend entirely on paid-only APIs will not be approved.",
      },
      {
        id: "A6",
        title: "Libraries must be bundled",
        count: 0,
        text: 'Shared libraries must be bundled with the plugin (e.g., statically linked for C++ or included as Python packages). Standalone "API-only" plugins that serve no purpose on their own are not accepted — convert them to libraries.',
      },
      {
        id: "A7",
        title: "Only submit your own work",
        count: 0,
        text: "You may only submit plugins you have authored. To submit a fork of an abandoned plugin, you must provide proof of the original author's permission, or evidence that the original author did not respond within 14 days of a request to update. Forks must be submitted under a different name.",
      },
      {
        id: "A8",
        title: "Complete and functional",
        count: 0,
        text: "Plugins must be complete and functional. Partially implemented features must be clearly marked as experimental and must not be listed as stable features in the description.",
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
      "Code must meet quality, readability, and compatibility standards.",
    rules: [
      {
        id: "B1",
        title: "Supported Endstone versions",
        count: 0,
        text: "Plugins must declare the minimum supported Endstone API version. Only officially released Endstone versions are accepted — development/nightly API versions must not be declared as requirements.",
      },
      {
        id: "B2",
        title: "No obfuscation",
        count: 0,
        text: "Source code must be readable and not obfuscated. For C++ plugins, the source repository must contain the complete, readable source. For Python plugins, no bytecode-only submissions are allowed.",
      },
      {
        id: "B3",
        title: "No unnecessary console output",
        count: 0,
        text: 'Plugins must not output unnecessary status messages on startup/shutdown (e.g., "Plugin enabled!", "Author: Xxx", ASCII art banners). Console output is only acceptable if startup genuinely takes significant time (>1 second) or for critical error reporting.',
      },
      {
        id: "B4a",
        title: "Default language must be English",
        count: 0,
        text: "Multi-language support is encouraged, but the default language must be English. All command descriptions, help text, and console output must be available in English.",
      },
      {
        id: "B4b",
        title: "Political and religious neutrality",
        count: 0,
        text: "Plugins must not contain politically or religiously biased content.",
      },
      {
        id: "B5",
        title: "Declare dependencies",
        count: 0,
        text: "All plugin dependencies must be declared in both the plugin manifest (plugin.toml / plugin.yml) and the submission form. Required dependencies that are not available on EndGit must not be used.",
      },
      {
        id: "B6",
        title: "No hardcoded data",
        count: 0,
        text: "Plugins should use Endstone API methods and constants for vanilla game data where available. Hardcoded block/item IDs, entity type strings, etc. should be avoided in favor of API-provided constants.",
      },
      {
        id: "B7",
        title: "Clean plugin name",
        count: 0,
        text: 'Plugin names must not include version information (e.g., no "-v2", "-PM5" suffixes), must match the name declared in the plugin manifest exactly, and use only alphanumeric characters, hyphens, and underscores.',
      },
      {
        id: "B8",
        title: "Use API over protocol",
        count: 0,
        text: "Plugins must not use raw packet handling to implement features that can be accomplished using the Endstone API. Direct protocol manipulation is only acceptable when no API alternative exists.",
      },
    ],
  },
  {
    id: "structure",
    label: "Naming & Structure",
    prefix: "C",
    icon: "file",
    color: "#f59e0b",
    description: "Proper naming, namespacing, and structural conventions.",
    rules: [
      {
        id: "C1a",
        title: "Unique namespace (C++)",
        count: 0,
        text: "C++ plugins must use a unique namespace that will not collide with other plugins. The recommended format is author_name::plugin_name. The author/org name should correspond to the GitHub username or organization.",
      },
      {
        id: "C1b",
        title: "Unique module name (Python)",
        count: 0,
        text: "Python plugins must use a unique top-level module/package name. The recommended format is author_pluginname or a similarly distinctive name that avoids collision.",
      },
      {
        id: "C1c",
        title: "Stay in your namespace",
        count: 0,
        text: "All classes, types, and symbols declared by a plugin must reside within the plugin's own namespace/package. Do not pollute the global namespace or other plugins' namespaces.",
      },
      {
        id: "C2",
        title: "Command registration",
        count: 0,
        text: "All commands must be properly registered through the Endstone API. Commands must be associated with the registering plugin. Fallback prefixes must match the plugin name (no abbreviations or acronyms).",
      },
      {
        id: "C3",
        title: "Permission naming",
        count: 0,
        text: "All permissions must start with the plugin name (lowercase), use only lowercase letters, digits, hyphens, and dots, and be consistently declared in both the manifest and code.",
      },
      {
        id: "C4",
        title: "Data isolation",
        count: 0,
        text: "Plugin-specific data must be stored in the plugin's data folder. Entity/world-specific data must be stored in a namespaced compound tag. Database tables must use a plugin-prefixed naming convention to prevent collisions.",
      },
      {
        id: "C5",
        title: "No hardcoded command dispatch",
        count: 0,
        text: "Plugins must not use command dispatch (dispatchCommand) to invoke other plugins' functionality. Use the proper API or declare explicit dependencies instead.",
      },
    ],
  },
  {
    id: "docs",
    label: "Documentation",
    prefix: "D",
    icon: "book",
    color: "#10b981",
    description: "Clear, complete, and well-formatted documentation.",
    rules: [
      {
        id: "D1",
        title: "Detailed description",
        count: 0,
        text: "The description must explain what the plugin does, why it is useful, and how to configure/use it. Do not assume the reader already knows the context. Screenshots or videos alone are not sufficient.",
      },
      {
        id: "D2",
        title: "English description required",
        count: 0,
        text: "The plugin description must be available in English. Translations in other languages are welcome but English must come first.",
      },
      {
        id: "D3",
        title: "Clean description",
        count: 0,
        text: "Do not include irrelevant, duplicated, or misleading information. Do not advertise external products. A reasonable number of contact links (Discord, GitHub) is acceptable.",
      },
      {
        id: "D4",
        title: "Formatted description",
        count: 0,
        text: "Format your description using Markdown. Use headings, lists, code blocks, and screenshots to make the description easy to read and visually appealing.",
      },
      {
        id: "D5",
        title: "Informative changelog",
        count: 0,
        text: 'Every update must include a changelog with user-readable information about what changed. Do not include trivial entries like "fixed typo" or "updated README" without meaningful context.',
      },
      {
        id: "D6",
        title: "Open source license required",
        count: 0,
        text: "All plugins must be published under an OSI-approved open source license. A LICENSE file must be present in the root of the repository. Choose your license carefully — it cannot easily be changed after submission.",
      },
    ],
  },
  {
    id: "security",
    label: "Security & Performance",
    prefix: "S",
    icon: "lock",
    color: "#ef4444",
    description: "Plugins must be safe, efficient, and well-behaved.",
    rules: [
      {
        id: "S1",
        title: "Do not block the main thread",
        count: 0,
        text: "Plugins must not block the server's main thread with long-running operations such as network requests, heavy file I/O, or expensive algorithms. Use std::async / thread pools (C++) or asyncio / threading (Python).",
      },
      {
        id: "S2",
        title: "SQL injection prevention",
        count: 0,
        text: "All SQL queries must use parameterized queries or prepared statements. Never interpolate user input directly into SQL strings, even if the input appears to be validated.",
      },
      {
        id: "S3",
        title: "No unbounded memory growth",
        count: 0,
        text: "Plugins must not allocate memory proportional to persistent quantities (e.g., total registered players). Do not load entire player databases into memory. Use pagination and implement proper cleanup/expiration.",
      },
      {
        id: "S4",
        title: "Use permissions for access control",
        count: 0,
        text: "Do not intercept command events to block players from running commands. Use the permission system instead. Event-based command blocking is vulnerable to alias attacks and formatting exploits.",
      },
      {
        id: "S5",
        title: "Secure credential handling",
        count: 0,
        text: "Plugins must never log passwords, tokens, or API keys to console, include credentials in source code, or transmit credentials over unencrypted connections. Sensitive configuration should be loaded from config files excluded from version control.",
      },
      {
        id: "S6",
        title: "Resource cleanup",
        count: 0,
        text: "Plugins must properly clean up resources on disable: close database connections, cancel scheduled tasks, release file handles, and stop background threads. Failure to clean up can cause memory leaks and server instability.",
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
  const totalRules = RULE_CATEGORIES.reduce(
    (sum, c) => sum + c.rules.length,
    0,
  );

  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-16)",
      }}
    >
      {/* Hero Header */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "var(--radius-lg)",
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-5)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          <Shield size={32} color="var(--accent-primary)" />
        </div>
        <h1 className="heading-1" style={{ marginBottom: "var(--space-3)" }}>
          Plugin Submission Rules
        </h1>
        <p
          className="text-muted"
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            fontSize: "1.0625rem",
            lineHeight: 1.7,
          }}
        >
          All plugins submitted to the EndGit Marketplace must comply with the
          following rules. Violations may result in rejection during review.
        </p>
      </div>

      {/* Quick Navigation */}
      <div
        className="card"
        style={{
          padding: "var(--space-5) var(--space-6)",
          marginBottom: "var(--space-10)",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            marginRight: "var(--space-2)",
          }}
        >
          Jump to:
        </span>
        {RULE_CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.375rem 0.75rem",
              borderRadius: "var(--radius-full)",
              background: `${cat.color}10`,
              color: cat.color,
              fontSize: "0.8125rem",
              fontWeight: 600,
              textDecoration: "none",
              border: `1px solid ${cat.color}25`,
              transition: "all 150ms",
            }}
          >
            <CategoryIcon icon={cat.icon} color={cat.color} />
            {cat.label}
            <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>
              ({cat.rules.length})
            </span>
          </a>
        ))}
      </div>

      {/* Rule Categories */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-10)",
        }}
      >
        {RULE_CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id}>
            {/* Category Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-5)",
                paddingBottom: "var(--space-3)",
                borderBottom: `2px solid ${cat.color}30`,
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  background: `${cat.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CategoryIcon icon={cat.icon} color={cat.color} />
              </div>
              <div>
                <h2
                  className="heading-3"
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <span
                    style={{
                      color: cat.color,
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {cat.prefix}
                  </span>
                  {cat.label}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Rules List */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              {cat.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="card"
                  style={{
                    padding: "var(--space-4) var(--space-5)",
                    borderLeft: `3px solid ${cat.color}60`,
                    transition: "all 200ms",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--space-3)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        background: `${cat.color}12`,
                        color: cat.color,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {rule.id}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {rule.title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.65,
                        }}
                      >
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
      <div
        style={{
          marginTop: "var(--space-12)",
          padding: "var(--space-6)",
          background: "rgba(239, 68, 68, 0.04)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid rgba(239, 68, 68, 0.15)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "var(--space-2)",
          }}
        >
          ⚠️ Enforcement
        </p>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            margin: 0,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Violations of these rules may result in the plugin being rejected
          during review. Repeated or severe violations may lead to submission
          privileges being restricted. If you have questions about a specific
          rule, reach out on our Discord.
        </p>
      </div>
    </div>
  );
}

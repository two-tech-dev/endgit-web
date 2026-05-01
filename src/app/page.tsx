import { ArrowRight, Zap, Terminal, Activity, ShieldCheck, GitBranch, BookOpen } from "lucide-react";
import PluginImage from "@/components/PluginImage";

async function getStats() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/plugins?pageSize=1`, { cache: "no-store" });
    const json = await res.json();
    const total = json?.pagination?.total || 0;
    return { plugins: total, downloads: "—", builds: "—" };
  } catch {
    return { plugins: 0, downloads: "—", builds: "—" };
  }
}

async function getLatestPlugins() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/plugins/latest`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json?.data?.slice(0, 6) || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const stats = await getStats();
  const latestPlugins = await getLatestPlugins();
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── Hero ── */}
      <section style={{
        padding: "clamp(4rem, 10vw, 8rem) 0 clamp(3rem, 8vw, 6rem)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "450px",
          background: "radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-5)" }}>
          <span style={{
            fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "0.3rem 0.875rem", borderRadius: "var(--radius-full)",
            background: "rgba(6,182,212,0.08)", color: "var(--accent-cyan)",
            border: "1px solid rgba(6,182,212,0.15)", display: "inline-flex", alignItems: "center", gap: "6px"
          }}>
            <Zap size={11} fill="currentColor" /> Public Beta
          </span>

          <h1 className="heading-1" style={{
            maxWidth: "720px", lineHeight: 1.08, letterSpacing: "-0.025em",
            fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
          }}>
            The plugin registry for{" "}
            <span style={{ color: "var(--accent-cyan)" }}>Endstone</span>
          </h1>

          <p className="text-muted" style={{
            fontSize: "clamp(1rem, 2.5vw, 1.1875rem)", maxWidth: "540px", lineHeight: 1.65
          }}>
            Discover, build, and deploy C++ &amp; Python plugins for Bedrock Dedicated Server — powered by GitHub CI/CD.
          </p>

          <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/plugins" className="btn btn-primary" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "0.75rem 1.75rem", fontSize: "1rem", fontWeight: 600
            }}>
              Browse Releases <ArrowRight size={16} />
            </a>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "#0f172a", color: "#cbd5e1",
              padding: "0.75rem 1.5rem", borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-mono)", fontSize: "0.875rem"
            }}>
              <span style={{ color: "var(--accent-cyan)", userSelect: "none" }}>$</span>
              <code>endgit install &lt;plugin&gt;</code>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="container" style={{ paddingBottom: "var(--space-12)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", justifyContent: "center" }}>
          {[
            { label: "Plugins", value: stats.plugins || "0" },
            { label: "Downloads", value: stats.downloads },
            { label: "Builds", value: stats.builds },
          ].map((s, i) => (
            <div key={i} className="card" style={{
              flex: "1 1 200px", maxWidth: "260px", textAlign: "center", padding: "var(--space-5) var(--space-6)"
            }}>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{s.value}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent Releases ── */}
      {latestPlugins.length > 0 && (
        <section className="container" style={{ paddingBottom: "var(--space-16)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
            <div>
              <h2 className="heading-2" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", letterSpacing: "-0.01em", margin: 0 }}>
                Recent Releases
              </h2>
              <p className="text-muted" style={{ fontSize: "1.0625rem", marginTop: "var(--space-2)" }}>
                The latest additions to the Endstone ecosystem.
              </p>
            </div>
            <a href="/plugins" className="btn" style={{
              background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)",
              display: "inline-flex", alignItems: "center", gap: "6px"
            }}>
              View All <ArrowRight size={16} />
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: "var(--space-6)", alignContent: "start" }}>
            {latestPlugins.map((plugin: any) => {
              const avgRating = plugin.stars ? Math.round((plugin.stars / 20) * 10) / 10 : 0;

              return (
                <a href={`/plugins/${plugin.slug}`} key={plugin.id} className="card" style={{
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  background: "var(--bg-card)",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}>
                  <div style={{ padding: "var(--space-4)", display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
                    <div style={{
                      width: "64px", height: "64px", flexShrink: 0,
                      borderRadius: "var(--radius-md)", overflow: "hidden",
                      background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <PluginImage iconUrl={plugin.iconUrl} repoUrl={plugin.repoUrl} alt={`${plugin.displayName} icon`} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="heading-3" style={{ fontSize: "1.125rem", margin: "0 0 4px 0", color: "var(--accent-cyan)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {plugin.displayName}
                      </h3>
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span>v{plugin.latestVersion || "1.0.0"}</span>
                        <span>{plugin.author?.displayName || plugin.author?.username}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      <span>{new Date(plugin.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      <span>{plugin.downloads.toLocaleString()} downloads</span>
                      {avgRating > 0 && (
                        <span style={{ color: "#f59e0b", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "3px" }}>
                          {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}
                          <span style={{ color: "var(--text-muted)", fontSize: "0.6875rem", marginLeft: "2px" }}>({avgRating})</span>
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <section className="container" style={{ paddingBottom: "var(--space-16)" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <h2 className="heading-2" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", letterSpacing: "-0.01em" }}>
            Everything you need to ship faster
          </h2>
          <p className="text-muted" style={{ fontSize: "1.0625rem", marginTop: "var(--space-2)", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            A modern alternative to Poggit — secure, fast, and built for Endstone.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "var(--space-5)" }}>
          {[
            {
              icon: <Activity size={22} />,
              bg: "rgba(6,182,212,0.1)", color: "var(--accent-cyan)",
              title: "Automated CI/CD",
              desc: "Push to GitHub and our workers compile your C++ or Python code into ready-to-use artifacts automatically."
            },
            {
              icon: <ShieldCheck size={22} />,
              bg: "rgba(16,185,129,0.1)", color: "var(--status-success)",
              title: "Reviewed & Trusted",
              desc: "Every plugin is reviewed against our submission rules before being published to the marketplace."
            },
            {
              icon: <Terminal size={22} />,
              bg: "rgba(99,102,241,0.1)", color: "var(--accent-purple)",
              title: "CLI Tooling",
              desc: "Install plugins, fetch dev builds, and manage versions from your terminal with the endgit CLI."
            },
            {
              icon: <BookOpen size={22} />,
              bg: "rgba(245,158,11,0.1)", color: "#f59e0b",
              title: "Open & Transparent",
              desc: "All plugins must be open source. Full source code and build logs are publicly available."
            },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "var(--radius-md)",
                background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", color: f.color
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container" style={{ paddingBottom: "var(--space-16)" }}>
        <div className="card" style={{
          padding: "var(--space-10) var(--space-8)",
          textAlign: "center",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white",
          border: "none",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)"
        }}>
          <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 700, margin: 0 }}>Ready to publish your plugin?</h2>
          <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "420px", margin: 0, lineHeight: 1.5 }}>
            Connect your GitHub, push your code, and let EndGit handle the rest.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center", marginTop: "var(--space-2)" }}>
            <a href="/plugins" className="btn btn-primary" style={{ background: "white", color: "#0f172a", border: "none", fontWeight: 600 }}>
              Explore Releases
            </a>
            <a href="/dashboard/dev" className="btn btn-secondary" style={{
              background: "transparent", color: "white", border: "1px solid #334155",
              display: "inline-flex", alignItems: "center", gap: "8px"
            }}>
              <GitBranch size={16} /> Dev Dashboard
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

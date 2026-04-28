import { ArrowRight, Box, ShieldCheck, Zap, Terminal, Code, Activity, GitBranch } from "lucide-react";

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

export default async function Home() {
  const stats = await getStats();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-16)", paddingBottom: "var(--space-16)" }}>
      {/* Hero Section */}
      <section style={{ 
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-12)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle decorative background */}
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse at center, rgba(14, 165, 233, 0.08) 0%, rgba(248, 250, 252, 0) 70%)", zIndex: -1 }}></div>
        
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-6)" }}>
          <div className="badge badge-cyan" style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
            <Zap size={12} fill="currentColor" /> ENDGIT PUBLIC BETA
          </div>
          
          <h1 className="heading-1" style={{ maxWidth: "800px", fontSize: "3.5rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            The standard registry for <span style={{ color: "var(--accent-cyan)" }}>Endstone</span> plugins
          </h1>
          
          <p className="text-muted" style={{ fontSize: "1.25rem", maxWidth: "600px", lineHeight: 1.6 }}>
            Discover, build, and deploy high-performance C++ and Python plugins for your Bedrock Dedicated Server with zero friction.
          </p>
          
          <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-4)" }}>
            <a href="/plugins" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.75rem 1.5rem", fontSize: "1.125rem", fontWeight: 600 }}>
              Browse Plugins <ArrowRight size={18} />
            </a>
            <div style={{ 
              display: "flex", alignItems: "center", gap: "12px", background: "#0f172a", color: "#e2e8f0", 
              padding: "0.75rem 1.5rem", borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono)", 
              fontSize: "0.9375rem", boxShadow: "var(--shadow-sm)"
            }}>
              <span style={{ color: "var(--accent-cyan)", userSelect: "none" }}>$</span>
              <code>endgit install economy</code>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", justifyContent: "center" }}>
          {[
            { label: "Active Plugins", value: stats.plugins || "0" },
            { label: "Total Downloads", value: stats.downloads },
            { label: "Total Builds", value: stats.builds },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ flex: "1 1 250px", textAlign: "center", padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{stat.value}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container" style={{ marginTop: "var(--space-8)" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
          <h2 className="heading-2" style={{ fontSize: "2.5rem", letterSpacing: "-0.01em" }}>Everything you need to ship faster.</h2>
          <p className="text-muted" style={{ fontSize: "1.125rem", marginTop: "var(--space-3)" }}>EndGit replaces Poggit with a modern, secure, and blazingly fast ecosystem.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
          
          <div className="card" style={{ padding: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ background: "rgba(14, 165, 233, 0.1)", width: "48px", height: "48px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)" }}>
              <Activity size={24} />
            </div>
            <h3 className="heading-3" style={{ fontSize: "1.25rem" }}>Live CI/CD Builds</h3>
            <p className="text-secondary" style={{ lineHeight: 1.6 }}>Push to GitHub and let our worker fleet automatically compile your C++ or Python code into ready-to-use artifacts within seconds.</p>
          </div>

          <div className="card" style={{ padding: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.1)", width: "48px", height: "48px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--status-success)" }}>
              <ShieldCheck size={24} />
            </div>
            <h3 className="heading-3" style={{ fontSize: "1.25rem" }}>Safe Score & Security</h3>
            <p className="text-secondary" style={{ lineHeight: 1.6 }}>Every plugin undergoes rigorous static analysis and sandbox testing to generate a Trust Score, keeping malicious code off your servers.</p>
          </div>

          <div className="card" style={{ padding: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ background: "rgba(99, 102, 241, 0.1)", width: "48px", height: "48px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-purple)" }}>
              <Terminal size={24} />
            </div>
            <h3 className="heading-3" style={{ fontSize: "1.25rem" }}>Powerful CLI Tooling</h3>
            <p className="text-secondary" style={{ lineHeight: 1.6 }}>Install dependencies, fetch dev builds by commit hash, and publish new versions straight from your terminal with <code style={{ color: "var(--accent-purple)", background: "rgba(99, 102, 241, 0.1)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.875em" }}>endgit</code>.</p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="container" style={{ marginTop: "var(--space-8)" }}>
        <div className="card" style={{ 
          padding: "var(--space-12)", 
          textAlign: "center", 
          background: "linear-gradient(to right bottom, #0f172a, #1e293b)",
          color: "white",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-6)"
        }}>
          <h2 className="heading-2" style={{ color: "white", margin: 0 }}>Ready to upgrade your server?</h2>
          <p style={{ color: "#94a3b8", fontSize: "1.125rem", maxWidth: "500px" }}>Join hundreds of developers building the next generation of Bedrock Server plugins.</p>
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <a href="/plugins" className="btn btn-primary" style={{ background: "white", color: "#0f172a", border: "none" }}>Explore Marketplace</a>
            <a href="/dashboard" className="btn btn-secondary" style={{ background: "transparent", color: "white", border: "1px solid #334155" }}><GitBranch size={18} style={{ marginRight: "8px" }}/> Publish via GitHub</a>
          </div>
        </div>
      </section>
    </div>
  );
}

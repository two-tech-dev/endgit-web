import { Search } from "lucide-react";
import PluginImage from "@/components/PluginImage";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default async function AuthorPluginsPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  
  // Fetch plugins by this author
  const { data: responseData } = await fetchApi(`/api/v1/plugins?author=${username}`);
  const realPlugins = responseData?.data?.plugins || [];

  return (
    <div className="container" style={{ padding: "var(--space-8) 0" }}>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 className="heading-2" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          Plugins by <span style={{ color: "var(--accent-cyan)" }}>{username}</span>
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
          Viewing all {realPlugins.length} plugins created by this author.
        </p>
      </div>

      {realPlugins.length === 0 ? (
        <div className="card" style={{ padding: "var(--space-8)", textAlign: "center" }}>
          <Search size={32} color="var(--text-muted)" style={{ margin: "0 auto var(--space-4)", opacity: 0.5 }} />
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>No plugins found</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>This author has not published any plugins yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: "var(--space-6)" }}>
          {realPlugins.map((plugin: any) => {
            const avgRating = plugin.stars ? Math.round((plugin.stars / 20) * 10) / 10 : 0;
            const isFeatured = plugin.downloads >= 100;

            return (
              <Link href={`/plugins/${plugin.slug}`} key={plugin.id} className="card" style={{
                padding: "0",
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                background: "var(--bg-card)",
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}>
                <div style={{ padding: "var(--space-4)", display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
                  {/* Left: Icon */}
                  <div style={{
                    width: "64px", height: "64px", flexShrink: 0,
                    borderRadius: "var(--radius-md)", overflow: "hidden",
                    background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <PluginImage iconUrl={plugin.iconUrl} repoUrl={plugin.repoUrl} alt={`${plugin.displayName} icon`} />
                  </div>

                  {/* Middle: Title, Version, Author */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="heading-3" style={{ fontSize: "1.125rem", margin: "0 0 4px 0", color: "var(--accent-cyan)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {plugin.displayName}
                    </h3>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span>v{plugin.latestVersion || "1.0.0"}</span>
                      <span>{plugin.author?.displayName || plugin.author?.username}</span>
                    </div>
                  </div>

                  {/* Right: Date & Stats */}
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

                {/* Bottom: Featured Banner */}
                {isFeatured && (
                  <div style={{
                    width: "100%",
                    padding: "5px 0",
                    textAlign: "center",
                    background: "linear-gradient(90deg, #059669, #0d9488)",
                    color: "white",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em"
                  }}>
                    ⚡ Featured
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

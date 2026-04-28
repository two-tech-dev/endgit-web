import { Star, Download, ShieldCheck, Search, Tag, Zap, Activity } from "lucide-react";
import PluginImage from "@/components/PluginImage";
import PluginSearch from "@/components/PluginSearch";
import PluginSidebarFilters from "@/components/PluginSidebarFilters";
import { fetchApi } from "@/lib/api";

export default async function PluginsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = new URLSearchParams();
  if (searchParams.q) query.set("q", searchParams.q as string);
  if (searchParams.category) query.set("category", searchParams.category as string);
  if (searchParams.sort) query.set("sort", searchParams.sort as string);
  if (searchParams.type) query.set("type", searchParams.type as string);
  
  const { data: responseData } = await fetchApi(`/api/v1/plugins?${query.toString()}`);
  const realPlugins = responseData?.data?.plugins || [];

  return (
    <div className="container" style={{ padding: "var(--space-8) 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)" }}>
        <h1 className="heading-2">Plugins</h1>
        <PluginSearch />
      </div>

      <div style={{ display: "flex", gap: "var(--space-8)" }}>
        {/* Sidebar Filters */}
        <PluginSidebarFilters />

        {/* Plugin Grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-6)", alignContent: "start" }}>
          {realPlugins.map((plugin: any) => {
            const safeScore = plugin.trustScore || 0;
            const scoreClass = safeScore >= 90 ? 'safe-score-high' : 'safe-score-med';

            return (
              <a href={`/plugins/${plugin.slug}`} key={plugin.id} className="card" style={{ 
                padding: "0", 
                display: "flex", 
                flexDirection: "column", 
                textDecoration: "none",
                overflow: "hidden",
                position: "relative"
              }}>
                {/* Card Content */}
                <div style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)", flex: 1 }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                      <div style={{ 
                        width: "48px", height: "48px", borderRadius: "var(--radius-md)", 
                        background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid var(--border-color)", flexShrink: 0, overflow: "hidden"
                      }}>
                        <PluginImage iconUrl={plugin.iconUrl} repoUrl={plugin.repoUrl} alt={`${plugin.displayName} icon`} />
                      </div>
                      <div>
                        <h3 className="heading-3" style={{ fontSize: "1.125rem", margin: 0 }}>
                          {plugin.displayName}
                        </h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>{plugin.author.username}</p>
                      </div>
                    </div>
                    {/* Safe Score Badge */}
                    <div className={`safe-score ${scoreClass}`} title="Safe Score">
                      {safeScore}
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "4px" }}>
                    {plugin.qualityBadge === "VERIFIED" ? (
                      <span className="badge badge-cyan" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6875rem" }}>
                        <ShieldCheck size={12} /> VERIFIED
                      </span>
                    ) : null}
                    <span className="badge badge-outline" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6875rem" }}>
                      <Zap size={12} color="var(--status-warning)" /> FAST
                    </span>
                    <span className={`badge ${plugin.pluginType === "PYTHON" ? "badge-green" : "badge-purple"}`} style={{ fontSize: "0.6875rem" }}>
                      {plugin.pluginType}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", flex: 1, marginTop: "var(--space-2)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {plugin.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    {plugin.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "2px" }}>
                        <Tag size={12} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with Stats & Mini Chart */}
                <div style={{ 
                  background: "var(--bg-secondary)", 
                  padding: "var(--space-3) var(--space-5)", 
                  borderTop: "1px solid var(--border-color)",
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  position: "relative"
                }}>
                  <div style={{ display: "flex", gap: "var(--space-4)", color: "var(--text-primary)", fontSize: "0.875rem", fontWeight: 500, zIndex: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Download size={14} color="var(--text-muted)" /> {plugin.downloads.toLocaleString()}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Star size={14} color="var(--status-warning)" /> {(plugin.stars || 0).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem", zIndex: 2 }}>
                    v{plugin.versions?.[0]?.version || "1.0.0"}
                  </div>

                  {/* Decorative Mini Chart Background */}
                  <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", zIndex: 1, opacity: 0.1 }} preserveAspectRatio="none" viewBox="0 0 100 30">
                    <path d="M0,30 L0,20 Q10,10 20,25 T40,15 T60,25 T80,5 L100,20 L100,30 Z" fill="var(--accent-cyan)" />
                    <path d="M0,20 Q10,10 20,25 T40,15 T60,25 T80,5 L100,20" fill="none" stroke="var(--accent-cyan)" strokeWidth="1" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle, AlertTriangle, Download, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PLUGIN_CATEGORIES } from "@/lib/constants";

const COMMON_LICENSES = ["MIT", "GPL-3.0", "GPL-2.0", "Apache-2.0", "BSD-3-Clause", "BSD-2-Clause", "MPL-2.0", "AGPL-3.0", "Unlicense", "Proprietary", "Other"];
const ENDSTONE_APIS = ["0.5", "0.4", "0.3"];

interface Props {
  buildId: string;
  buildNumber: number;
  plugin: any;
}

export default function SubmitReviewForm({ buildId, buildNumber, plugin }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Form State — auto-increment version from latest
  const getNextVersion = () => {
    const latestVersion = plugin?.versions?.[0]?.version;
    if (!latestVersion) return "1.0.0";
    const parts = latestVersion.split(".").map(Number);
    if (parts.length === 3 && parts.every((n: number) => !isNaN(n))) {
      parts[2] += 1; // bump patch
      return parts.join(".");
    }
    return latestVersion;
  };
  const [version, setVersion] = useState(getNextVersion());
  const [displayName, setDisplayName] = useState(plugin?.displayName || plugin?.name || "");
  const [description, setDescription] = useState(plugin?.description || "");
  const [longDescription, setLongDescription] = useState(plugin?.longDescription || "");
  const [license, setLicense] = useState(plugin?.license || "");
  const [iconPath, setIconPath] = useState("");
  const [notes, setNotes] = useState("");
  const [changelog, setChangelog] = useState("");
  const [supportedApis, setSupportedApis] = useState<string[]>([]);
  const [isFetchingLicense, setIsFetchingLicense] = useState(false);
  const [isFetchingReadme, setIsFetchingReadme] = useState(false);
  
  // Producers State
  const [producers, setProducers] = useState<{githubUser: string, role: string}[]>([
    { githubUser: "", role: "COLLABORATOR" }
  ]);
  
  // Update producer if session loads after initial render
  useEffect(() => {
    // Priority: NextAuth session username -> Plugin author username -> Display name without spaces
    const username = (session?.user as any)?.username || plugin?.author?.username || (session?.user as any)?.name?.replace(/ /g, "");
    if (username && producers.length === 1 && producers[0].githubUser === "") {
      setProducers([{ githubUser: username, role: "COLLABORATOR" }]);
    }
  }, [session, plugin]);
  
  // Categories State
  const initialTags = plugin?.tags || [];
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialTags);

  useEffect(() => {
    if (!license) fetchLicense();
  }, []);

  const fetchLicense = async () => {
    if (!plugin?.repoUrl) return;
    setIsFetchingLicense(true);
    try {
      const match = plugin.repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [, owner, repo] = match;
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/license`);
        if (res.ok) {
          const data = await res.json();
          if (data.license?.spdx_id) {
            setLicense(data.license.spdx_id);
          } else if (data.license?.name) {
            setLicense(data.license.name);
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch license", e);
    } finally {
      setIsFetchingLicense(false);
    }
  };

  const fetchReadme = async () => {
    if (!plugin?.repoUrl) return;
    setIsFetchingReadme(true);
    setError("");
    try {
      const match = plugin.repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [, owner, repo] = match;
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: { Accept: "application/vnd.github.v3.raw" }
        });
        if (res.ok) {
          const text = await res.text();
          setLongDescription(text);
        } else {
          setError("README not found in repository");
        }
      }
    } catch (e) {
      console.error("Failed to fetch README", e);
      setError("Failed to fetch README");
    } finally {
      setIsFetchingReadme(false);
    }
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else {
      if (selectedCategories.length >= 5) {
        setError("You can only select up to 5 categories.");
        return;
      }
      setError("");
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError("Please select at least one category.");
      return;
    }
    
    // Validate Producers
    const emptyProducers = producers.filter(p => !p.githubUser.trim());
    if (emptyProducers.length > 0) {
      setError("Producer GitHub usernames cannot be empty.");
      return;
    }
    const hasCollaborator = producers.some(p => p.role === "COLLABORATOR");
    if (!hasCollaborator) {
      setError("There must be at least one COLLABORATOR.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const apiToken = (session?.user as any)?.apiToken;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/submit/${buildId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ 
          version, 
          displayName, 
          description, 
          longDescription, 
          tags: selectedCategories.join(","), // backend expects string or array, it handles comma split
          license, 
          iconPath,
          notes,
          changelog,
          supportedApis,
          producers 
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/plugins/${plugin.slug}/builds`);
        router.refresh();
      } else {
        setError(data.error || "Failed to submit");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return <div className="card" style={{ padding: "var(--space-6)", textAlign: "center" }}>Please sign in.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => router.back()} className="btn btn-secondary" style={{ marginBottom: "var(--space-6)" }}>
        <ArrowLeft size={16} /> Back to Build
      </button>

      <div className="card" style={{ padding: "var(--space-6)" }}>
        <h1 className="heading-2" style={{ marginBottom: "var(--space-2)" }}>Publish Plugin</h1>
        <p className="text-muted" style={{ marginBottom: "var(--space-6)" }}>
          Submit Build #{buildNumber} for review to publish it on the marketplace.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "6px" }}>Display Name</label>
              <input 
                type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)}
                className="input" style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "6px" }}>Version</label>
              <input 
                type="text" required value={version} onChange={e => setVersion(e.target.value)} placeholder="e.g. 1.0.0"
                className="input" style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "6px" }}>Short Description</label>
            <input 
              type="text" required value={description} onChange={e => setDescription(e.target.value)} maxLength={100}
              placeholder="A brief summary of what your plugin does..."
              className="input" style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "6px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500 }}>Long Description (Markdown)</label>
              {plugin?.repoUrl && (
                <button 
                  type="button" 
                  onClick={fetchReadme} 
                  disabled={isFetchingReadme}
                  style={{ 
                    display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", 
                    background: "rgba(14, 165, 233, 0.1)", color: "var(--accent-cyan)", 
                    border: "1px solid rgba(14, 165, 233, 0.2)", borderRadius: "var(--radius-sm)", 
                    padding: "4px 8px", cursor: "pointer", fontWeight: 500,
                    opacity: isFetchingReadme ? 0.6 : 1
                  }}
                >
                  <Download size={12} /> {isFetchingReadme ? "Importing..." : "Import from README"}
                </button>
              )}
            </div>
            <textarea 
              required value={longDescription} onChange={e => setLongDescription(e.target.value)} rows={8}
              placeholder="Detailed features, commands, permissions, and configuration instructions..."
              style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none", resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
            />
          </div>

          <div>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: "0.875rem", fontWeight: 500, marginBottom: "8px" }}>
              <span>Categories <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>(Max 5)</span></span>
              <span style={{ fontSize: "0.75rem", color: selectedCategories.length > 5 ? "var(--status-error)" : "var(--text-muted)" }}>{selectedCategories.length}/5</span>
            </label>
            <div style={{ 
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px",
              background: "var(--bg-secondary)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)"
            }}>
              {PLUGIN_CATEGORIES.map(cat => (
                <label key={cat} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.875rem" }}>
                  <input 
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    style={{ accentColor: "var(--accent-purple)", width: "16px", height: "16px" }}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "6px" }}>
              License {isFetchingLicense && <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>(Fetching from GitHub...)</span>}
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={license} onChange={e => setLicense(e.target.value)}
                style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", paddingRight: "40px", appearance: "auto" }}
              >
                <option value="">Select a license...</option>
                {COMMON_LICENSES.map(l => <option key={l} value={l}>{l}</option>)}
                {license && !COMMON_LICENSES.includes(license) && <option value={license}>{license} (Custom/Fetched)</option>}
              </select>
              {plugin?.repoUrl && (
                <button type="button" onClick={fetchLicense} disabled={isFetchingLicense} style={{ position: "absolute", right: "28px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--accent-cyan)", opacity: isFetchingLicense ? 0.5 : 1 }} title="Fetch from GitHub">
                  <Download size={16} />
                </button>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "8px" }}>
              Supported APIs (Endstone Versions)
            </label>
            <div style={{ 
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "8px",
              background: "var(--bg-secondary)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)"
            }}>
              {ENDSTONE_APIS.map(api => (
                <label key={api} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.875rem" }}>
                  <input 
                    type="checkbox"
                    checked={supportedApis.includes(api)}
                    onChange={() => {
                      if (supportedApis.includes(api)) {
                        setSupportedApis(prev => prev.filter(a => a !== api));
                      } else {
                        setSupportedApis(prev => [...prev, api]);
                      }
                    }}
                    style={{ accentColor: "var(--accent-purple)", width: "16px", height: "16px" }}
                  />
                  <span>{api}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "6px" }}>
              Icon Path (Optional)
            </label>
            <input 
              type="text" value={iconPath} onChange={e => setIconPath(e.target.value)} 
              placeholder="e.g. assets/icon.png (Default: icon.png)"
              className="input" style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Relative path to the icon file in your repository. If not found, the default EndGit logo will be used.
            </p>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "6px" }}>What's New (Changelog)</label>
            <textarea 
              value={changelog} onChange={e => setChangelog(e.target.value)} rows={4}
              placeholder="Describe what changed in this version. This will be visible to users on the plugin's page..."
              style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none", resize: "vertical" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                Producers
              </label>
              <button 
                type="button" 
                onClick={() => setProducers([...producers, { githubUser: "", role: "CONTRIBUTOR" }])}
                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", background: "none", border: "1px dashed var(--border-color)", padding: "4px 8px", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", cursor: "pointer" }}
              >
                <Plus size={12} /> Add Producer
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {producers.map((producer, index) => (
                <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input 
                    type="text" 
                    placeholder="GitHub Username"
                    value={producer.githubUser}
                    disabled={index === 0}
                    onChange={(e) => {
                      const newProducers = [...producers];
                      newProducers[index].githubUser = e.target.value;
                      setProducers(newProducers);
                    }}
                    style={{ flex: 1, padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: index === 0 ? "rgba(0,0,0,0.2)" : "var(--bg-secondary)", color: index === 0 ? "var(--text-muted)" : "var(--text-primary)", opacity: index === 0 ? 0.7 : 1 }}
                  />
                  <select 
                    value={producer.role}
                    disabled={index === 0}
                    onChange={(e) => {
                      const newProducers = [...producers];
                      newProducers[index].role = e.target.value;
                      setProducers(newProducers);
                    }}
                    style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: index === 0 ? "rgba(0,0,0,0.2)" : "var(--bg-secondary)", color: index === 0 ? "var(--text-muted)" : "var(--text-primary)", width: "140px", opacity: index === 0 ? 0.7 : 1 }}
                  >
                    <option value="COLLABORATOR">Collaborator</option>
                    <option value="CONTRIBUTOR">Contributor</option>
                    <option value="TRANSLATOR">Translator</option>
                    <option value="REQUESTER">Requester</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (producers.length > 1) {
                        setProducers(producers.filter((_, i) => i !== index));
                      }
                    }}
                    style={{ background: "none", border: "none", color: producers.length > 1 ? "var(--status-error)" : "var(--text-muted)", cursor: producers.length > 1 ? "pointer" : "not-allowed", padding: "8px" }}
                    disabled={producers.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Add all contributors who helped create this version. There must be at least one Collaborator.
            </p>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "6px" }}>Notes to Reviewer (Optional)</label>
            <textarea 
              value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Any specific features, permissions required, or testing instructions..."
              style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none", resize: "vertical" }}
            />
          </div>
          
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-2)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-color)" }}>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "1rem", opacity: submitting ? 0.6 : 1 }}>
              <CheckCircle size={18} /> {submitting ? "Submitting..." : "Submit Plugin for Review"}
            </button>
          </div>
        </form>

        {error && (
          <div style={{ marginTop: "var(--space-4)", padding: "var(--space-3)", background: "rgba(239,68,68,0.08)", borderRadius: "var(--radius-sm)", color: "var(--status-error)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Upload, Loader2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewVersionForm({ pluginSlug, isAuthor }: { pluginSlug: string, isAuthor: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [version, setVersion] = useState("");
  const [changelog, setChangelog] = useState("");
  const [buildId, setBuildId] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = (session?.user as any)?.apiToken;

      const res = await fetch(`${apiUrl}/api/v1/versions/${pluginSlug}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          version,
          changelog,
          buildId: buildId || null,
          fileUrl: fileUrl || null,
          fileName: fileName || null,
          fileSize: 1024, // Dummy size for manual submission for now
          fileHash: "manual-upload"
        })
      });

      const json = await res.json();
      if (json.success) {
        setIsOpen(false);
        setVersion("");
        setChangelog("");
        setBuildId("");
        setFileUrl("");
        setFileName("");
        router.refresh();
      } else {
        setError(json.error || "Failed to submit version");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "0.5rem 1rem", borderRadius: "var(--radius-md)",
          background: "var(--accent-purple)", color: "white",
          border: "none", fontSize: "0.875rem", fontWeight: 600,
          cursor: "pointer", alignSelf: "flex-start", marginTop: "var(--space-2)"
        }}
      >
        <Plus size={16} /> Submit New Version
      </button>

      {isOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-4)"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "500px", padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "var(--space-4)" }}>Submit New Version</h3>
            
            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--status-error)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px" }}>Version Number (e.g. 1.0.0)</label>
                <input 
                  type="text" required value={version} onChange={e => setVersion(e.target.value)}
                  style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px" }}>Changelog (Optional)</label>
                <textarea 
                  value={changelog} onChange={e => setChangelog(e.target.value)} rows={3}
                  style={{ width: "100%", padding: "0.625rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none", resize: "vertical" }}
                />
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", margin: "var(--space-2) 0", paddingTop: "var(--space-4)" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "var(--space-2)" }}>Artifact Source</p>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "var(--space-3)", display: "flex", gap: "4px" }}>
                  <Info size={14} /> Provide either a successful Build ID or a direct file URL.
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "4px", color: "var(--text-secondary)" }}>From Build ID</label>
                    <input 
                      type="text" value={buildId} onChange={e => { setBuildId(e.target.value); setFileUrl(""); setFileName(""); }}
                      placeholder="e.g. clt3x..." disabled={!!fileUrl}
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", outline: "none", opacity: fileUrl ? 0.5 : 1 }}
                    />
                  </div>
                  <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>— OR —</div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "4px", color: "var(--text-secondary)" }}>Manual File URL</label>
                    <input 
                      type="url" value={fileUrl} onChange={e => { setFileUrl(e.target.value); setBuildId(""); }}
                      placeholder="https://example.com/plugin.zip" disabled={!!buildId}
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", outline: "none", opacity: buildId ? 0.5 : 1 }}
                    />
                  </div>
                  {fileUrl && (
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "4px", color: "var(--text-secondary)" }}>File Name</label>
                      <input 
                        type="text" required value={fileName} onChange={e => setFileName(e.target.value)}
                        placeholder="plugin-1.0.0.zip"
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", outline: "none" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                <button type="button" onClick={() => setIsOpen(false)} style={{
                  padding: "0.625rem 1rem", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border-color)", cursor: "pointer", fontSize: "0.875rem"
                }}>Cancel</button>
                <button type="submit" disabled={submitting || (!buildId && !fileUrl)} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "0.625rem 1.25rem", borderRadius: "var(--radius-md)", background: "var(--accent-purple)", color: "white", border: "none", cursor: submitting || (!buildId && !fileUrl) ? "not-allowed" : "pointer", fontSize: "0.875rem", fontWeight: 600, opacity: submitting || (!buildId && !fileUrl) ? 0.6 : 1
                }}>
                  {submitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={16} />}
                  {submitting ? "Submitting..." : "Submit Version"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

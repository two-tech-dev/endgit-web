"use client";

import { FileUp, Info, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const apiToken = (session?.user as any)?.apiToken;
      if (!apiToken) throw new Error("Not authenticated. Please sign in first.");

      // Create plugin
      const pluginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/plugins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          name: data.name,
          displayName: data.displayName,
          description: data.description,
          pluginType: data.pluginType,
          repoUrl: data.repoUrl || undefined
        })
      });

      const pluginData = await pluginRes.json();
      if (!pluginData.success) throw new Error(pluginData.error || "Failed to create plugin");

      // For MVP, we skip the actual file upload POST to /versions if no file is selected,
      // but if we had a file we would send a multipart/form-data request here.
      
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "var(--space-8) 0", maxWidth: "800px" }}>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 className="heading-2">Publish New Plugin</h1>
        <p className="text-muted">Fill out the details below to upload your plugin to the EndGit marketplace.</p>
      </div>

      <div className="card" style={{ padding: "var(--space-8)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          
          <div style={{ display: "flex", gap: "var(--space-6)" }}>
            <div style={{ flex: 1 }}>
              <label className="text-muted" style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>Plugin Name (Slug)</label>
              <input type="text" name="name" required className="input" placeholder="e.g., essential-cmds" />
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Unique identifier, lowercase letters, numbers, and hyphens only.</p>
            </div>
            <div style={{ flex: 1 }}>
              <label className="text-muted" style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>Display Name</label>
              <input type="text" name="displayName" required className="input" placeholder="e.g., Essential Commands" />
            </div>
          </div>

          <div>
            <label className="text-muted" style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>Short Description</label>
            <input type="text" name="description" required className="input" placeholder="A brief 1-sentence summary of your plugin" />
          </div>

          <div style={{ display: "flex", gap: "var(--space-6)" }}>
            <div style={{ flex: 1 }}>
              <label className="text-muted" style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>Plugin Type</label>
              <select name="pluginType" className="input" style={{ appearance: "none" }}>
                <option value="PYTHON">Python (.whl / .zip)</option>
                <option value="CPP">C++ (.so / .dll)</option>
                <option value="BOTH">Both (Hybrid)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="text-muted" style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>Repository URL (Optional)</label>
              <input type="url" name="repoUrl" className="input" placeholder="https://github.com/..." />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", margin: "var(--space-2) 0", paddingTop: "var(--space-6)" }}>
            <h3 className="heading-3" style={{ marginBottom: "var(--space-4)", fontSize: "1.25rem" }}>Initial Version</h3>
            
            <div style={{ display: "flex", gap: "var(--space-6)", marginBottom: "var(--space-4)" }}>
              <div style={{ flex: 1 }}>
                <label className="text-muted" style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>Version Number</label>
                <input type="text" className="input" placeholder="e.g., 1.0.0" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="text-muted" style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>Endstone API Required</label>
                <input type="text" className="input" placeholder="e.g., ^0.5.0" />
              </div>
            </div>

            {/* Drag and Drop Area */}
            <div style={{ 
              border: "2px dashed var(--border-color)", 
              borderRadius: "var(--radius-md)", 
              padding: "var(--space-8)", 
              textAlign: "center",
              background: "var(--bg-secondary)",
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}>
              <FileUp size={32} color="var(--accent-purple)" style={{ margin: "0 auto var(--space-3)" }} />
              <p style={{ fontWeight: 500, marginBottom: "var(--space-1)", color: "var(--text-primary)" }}>Click to upload or drag and drop</p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Supports .whl, .zip, .so, .dll (Max 50MB)</p>
            </div>
          </div>

          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", display: "flex", gap: "var(--space-3)" }}>
            <Info size={20} color="var(--status-success)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>Review Process:</strong> Your plugin will undergo an automated structure and security scan. If it passes, it enters the Sandbox Test, followed by Human Review before being publicly available.
            </div>
          </div>

          {error && <div style={{ color: "var(--status-error)", fontSize: "0.875rem", padding: "var(--space-2)" }}>{error}</div>}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: "var(--space-3)", marginTop: "var(--space-4)", fontSize: "1.125rem", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Uploading..." : "Upload and Submit for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, ArrowLeft, Download } from "lucide-react";
import { PLUGIN_CATEGORIES } from "@/lib/constants";

const COMMON_LICENSES = [
  "MIT",
  "GPL-3.0",
  "GPL-2.0",
  "Apache-2.0",
  "BSD-3-Clause",
  "BSD-2-Clause",
  "MPL-2.0",
  "AGPL-3.0",
  "Unlicense",
  "Proprietary",
  "Other",
];

export default function EditPluginForm({ plugin }: { plugin: any }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [displayName, setDisplayName] = useState(
    plugin?.displayName || plugin?.name || "",
  );
  const [description, setDescription] = useState(plugin?.description || "");
  const [longDescription, setLongDescription] = useState(
    plugin?.longDescription || "",
  );
  const [license, setLicense] = useState(plugin?.license || "");
  const [iconUrl, setIconUrl] = useState(plugin?.iconUrl || "");
  const [repoUrl, setRepoUrl] = useState(plugin?.repoUrl || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    plugin?.tags || [],
  );

  const [isFetchingLicense, setIsFetchingLicense] = useState(false);
  const [isFetchingReadme, setIsFetchingReadme] = useState(false);

  const fetchLicense = async () => {
    if (!repoUrl) return;
    setIsFetchingLicense(true);
    try {
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [, owner, repo] = match;
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const token = (session?.user as any)?.apiToken;
        const res = await fetch(
          `${apiUrl}/api/v1/github/repo-license?owner=${owner}&repo=${repo}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const json = await res.json();
          if (json.data?.spdx_id) {
            setLicense(json.data.spdx_id);
          } else if (json.data?.name) {
            setLicense(json.data.name);
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
    if (!repoUrl) return;
    setIsFetchingReadme(true);
    setError("");
    try {
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [, owner, repo] = match;
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const token = (session?.user as any)?.apiToken;
        const res = await fetch(
          `${apiUrl}/api/v1/github/repo-readme?owner=${owner}&repo=${repo}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const json = await res.json();
          setLongDescription(json.data);
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
      setSelectedCategories((prev) => prev.filter((c) => c !== cat));
    } else {
      if (selectedCategories.length >= 5) {
        setError("You can only select up to 5 categories.");
        return;
      }
      setError("");
      setSelectedCategories((prev) => [...prev, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const apiToken = (session?.user as any)?.apiToken;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/plugins/${plugin.slug}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName,
            description,
            longDescription,
            iconUrl,
            repoUrl,
            license,
            tags: selectedCategories,
          }),
        },
      );

      const data = await res.json();
      if (data.success) {
        router.push(`/plugins/${plugin.slug}`);
        router.refresh();
      } else {
        setError(data.error || "Failed to update plugin");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (!session)
    return (
      <div
        className="card"
        style={{ padding: "var(--space-6)", textAlign: "center" }}
      >
        Please sign in.
      </div>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => router.back()}
        className="btn btn-secondary"
        style={{ marginBottom: "var(--space-6)" }}
      >
        <ArrowLeft size={16} /> Back to Plugin
      </button>

      <div className="card" style={{ padding: "var(--space-6)" }}>
        <h1 className="heading-2" style={{ marginBottom: "var(--space-2)" }}>
          Edit Plugin Details
        </h1>
        <div
          style={{
            marginBottom: "var(--space-6)",
            padding: "var(--space-4)",
            background: "rgba(139, 92, 246, 0.05)",
            borderRadius: "var(--radius-md)",
            borderLeft: "4px solid var(--accent-purple)",
          }}
        >
          <p
            className="text-primary"
            style={{ fontWeight: 500, marginBottom: "var(--space-2)" }}
          >
            Updating {plugin.name}
          </p>
          <p
            className="text-muted"
            style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
          >
            You are editing the general information for this plugin. Note that
            changing versions, supported APIs, or producers requires submitting
            a new version build.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "2px",
              }}
            >
              Display Name
            </label>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              The clean name shown on the marketplace (Rule B7).
            </p>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={
                plugin.status === "APPROVED" &&
                (session?.user as any)?.trustLevel !== "ADMIN"
              }
              className="input"
              style={{
                width: "100%",
                padding: "0.625rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                opacity:
                  plugin.status === "APPROVED" &&
                  (session?.user as any)?.trustLevel !== "ADMIN"
                    ? 0.6
                    : 1,
                cursor:
                  plugin.status === "APPROVED" &&
                  (session?.user as any)?.trustLevel !== "ADMIN"
                    ? "not-allowed"
                    : "text",
              }}
            />
            {plugin.status === "APPROVED" &&
              (session?.user as any)?.trustLevel !== "ADMIN" && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--status-warning)",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <AlertTriangle size={12} /> Display name cannot be changed for
                  approved plugins.
                </p>
              )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "2px",
              }}
            >
              Short Description
            </label>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              A catchy, one-sentence summary shown in search results and plugin
              cards (Max 100 chars).
            </p>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
              placeholder="A brief summary of what your plugin does..."
              className="input"
              style={{
                width: "100%",
                padding: "0.625rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "2px",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Long Description (Markdown)
              </label>
              {repoUrl && (
                <button
                  type="button"
                  onClick={fetchReadme}
                  disabled={isFetchingReadme}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.75rem",
                    background: "rgba(14, 165, 233, 0.1)",
                    color: "var(--accent-cyan)",
                    border: "1px solid rgba(14, 165, 233, 0.2)",
                    borderRadius: "var(--radius-sm)",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontWeight: 500,
                    opacity: isFetchingReadme ? 0.6 : 1,
                  }}
                >
                  <Download size={12} />{" "}
                  {isFetchingReadme ? "Importing..." : "Import from README"}
                </button>
              )}
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              Explain features, configuration, commands, and permissions.
              Screenshots and code blocks are highly recommended (Rules D1, D3,
              D4).
            </p>
            <textarea
              required
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={12}
              placeholder="# Features&#10;...&#10;&#10;# Commands&#10;..."
              style={{
                width: "100%",
                padding: "0.625rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                outline: "none",
                resize: "vertical",
                fontFamily: "var(--font-mono)",
                fontSize: "0.875rem",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "8px",
              }}
            >
              <span>
                Categories{" "}
                <span
                  style={{ color: "var(--text-muted)", fontWeight: "normal" }}
                >
                  (Max 5)
                </span>
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color:
                    selectedCategories.length > 5
                      ? "var(--status-error)"
                      : "var(--text-muted)",
                }}
              >
                {selectedCategories.length}/5
              </span>
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
                gap: "8px",
                background: "var(--bg-secondary)",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
              }}
            >
              {PLUGIN_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    style={{
                      accentColor: "var(--accent-purple)",
                      width: "16px",
                      height: "16px",
                    }}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "2px",
              }}
            >
              License{" "}
              {isFetchingLicense && (
                <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>
                  (Fetching from GitHub...)
                </span>
              )}
            </label>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              All plugins must have an OSI-approved open source license (Rule
              D6).
            </p>
            <div
              className="license-select-wrapper"
              style={{ position: "relative" }}
            >
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.625rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  paddingRight: "40px",
                  appearance: "auto",
                }}
              >
                <option value="">Select a license...</option>
                {COMMON_LICENSES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
                {license && !COMMON_LICENSES.includes(license) && (
                  <option value={license}>{license} (Custom/Fetched)</option>
                )}
              </select>
              {repoUrl && (
                <button
                  type="button"
                  onClick={fetchLicense}
                  disabled={isFetchingLicense}
                  style={{
                    position: "absolute",
                    right: "28px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--accent-cyan)",
                    opacity: isFetchingLicense ? 0.5 : 1,
                  }}
                  title="Fetch from GitHub"
                >
                  <Download size={16} />
                </button>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Icon URL (Optional)
            </label>
            <input
              type="text"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://..."
              className="input"
              style={{
                width: "100%",
                padding: "0.625rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Repository URL
            </label>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              This field cannot be changed after creation.
            </p>
            <input
              type="text"
              value={repoUrl}
              disabled
              className="input"
              style={{
                width: "100%",
                padding: "0.625rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "rgba(0,0,0,0.2)",
                color: "var(--text-muted)",
                cursor: "not-allowed",
                opacity: 0.7,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-3)",
              marginTop: "var(--space-2)",
              paddingTop: "var(--space-4)",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                padding: "0.75rem 2rem",
                fontSize: "1rem",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              <CheckCircle size={18} />{" "}
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {error && (
          <div
            style={{
              marginTop: "var(--space-4)",
              padding: "var(--space-3)",
              background: "rgba(239,68,68,0.08)",
              borderRadius: "var(--radius-sm)",
              color: "var(--status-error)",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <AlertTriangle size={16} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}

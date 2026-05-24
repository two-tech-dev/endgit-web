"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Upload,
  Lock,
} from "lucide-react";
import { PLUGIN_CATEGORIES } from "@/lib/constants";

export default function UploadPluginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [pluginType, setPluginType] = useState<"PYTHON" | "CPP">("PYTHON");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  const [artifact, setArtifact] = useState<File | null>(null);
  const [artifactLinux, setArtifactLinux] = useState<File | null>(null);
  const [artifactWin, setArtifactWin] = useState<File | null>(null);

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
    setError("");

    if (!name.match(/^[a-z0-9][a-z0-9-]{0,62}$/)) {
      setError(
        "Plugin name must be 1-63 lowercase alphanumeric characters or hyphens, starting with a letter or number.",
      );
      return;
    }
    if (!displayName.trim()) {
      setError("Display name is required.");
      return;
    }
    if (!description.trim() || description.length > 100) {
      setError("Description is required and must be at most 100 characters.");
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    if (pluginType === "PYTHON" && !artifact) {
      setError("A .whl artifact file is required for Python plugins.");
      return;
    }
    if (pluginType === "CPP") {
      if (!artifactLinux) {
        setError("A Linux .so artifact file is required for C++ plugins.");
        return;
      }
      if (!artifactWin) {
        setError("A Windows .dll artifact file is required for C++ plugins.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("displayName", displayName);
      formData.append("description", description);
      if (longDescription) formData.append("longDescription", longDescription);
      formData.append("pluginType", pluginType);
      if (selectedCategories.length > 0)
        formData.append("tags", selectedCategories.join(","));
      if (keywords) formData.append("keywords", keywords);
      if (iconUrl) formData.append("iconUrl", iconUrl);

      if (pluginType === "PYTHON" && artifact) {
        formData.append("artifact", artifact);
      }
      if (pluginType === "CPP") {
        if (artifactLinux) formData.append("artifact_linux", artifactLinux);
        if (artifactWin) formData.append("artifact_win", artifactWin);
      }

      const apiToken = (session?.user as any)?.apiToken;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/upload/plugin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
          body: formData,
        },
      );
      const data = await res.json();
      if (data.success) {
        router.push(`/builds/${data.data.build.id}/submit`);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (!session)
    return <div className="card p-6 text-center">Please sign in.</div>;

  return (
    <div className="container py-6 lg:py-8">
      <button
        onClick={() => router.back()}
        className="btn btn-secondary mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card p-4 lg:p-6">
        <h1 className="heading-2 mb-2">Upload Proprietary Plugin</h1>
        <div className="mb-6 p-4 bg-purple-500/5 rounded-md border-l-4 border-purple-500">
          <p className="text-text-primary font-medium mb-2 grid grid-flow-col auto-cols-max items-center gap-2">
            <Lock size={16} /> Proprietary Plugin Upload
          </p>
          <p className="text-text-muted text-sm leading-relaxed">
            Upload pre-built artifacts directly. The license will be
            automatically set to &quot;Proprietary&quot;. Your plugin will go
            through VirusTotal scanning and admin review before being published.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <h2 className="heading-3 mb-2 pb-2 border-b-2 border-accent text-[1.1rem] italic">
            About this plugin...
          </h2>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              Plugin Name
            </label>
            <p className="text-xs text-text-muted mb-1.5">
              Unique identifier. Lowercase letters, numbers, and hyphens only.
            </p>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase())}
              placeholder="my-awesome-plugin"
              pattern="[a-z0-9][a-z0-9-]{0,62}"
              className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              Display Name
            </label>
            <p className="text-xs text-text-muted mb-1.5">
              The clean name shown on the marketplace.
            </p>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={64}
              className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              Short Description
            </label>
            <p className="text-xs text-text-muted mb-1.5">
              A catchy, one-sentence summary (max 100 chars).
            </p>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
              placeholder="A brief summary of what your plugin does..."
              className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              Long Description (Markdown)
            </label>
            <p className="text-xs text-text-muted mb-1.5">
              Explain features, configuration, and usage.
            </p>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={12}
              placeholder="# Features&#10;...&#10;&#10;# Commands&#10;..."
              className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none resize-y font-mono text-sm focus:border-accent transition-all duration-150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              Plugin Type
            </label>
            <select
              value={pluginType}
              onChange={(e) => setPluginType(e.target.value as "PYTHON" | "CPP")}
              className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none focus:border-accent transition-all duration-150"
            >
              <option value="PYTHON">Python (.whl)</option>
              <option value="CPP">C++ (.so + .dll)</option>
            </select>
          </div>

          <div>
            <label className="grid grid-cols-[1fr_auto] items-baseline text-sm font-medium mb-2">
              <span>
                Categories{" "}
                <span className="text-text-muted font-normal">(Max 5)</span>
              </span>
              <span
                className={`text-xs ${
                  selectedCategories.length > 5
                    ? "text-error"
                    : "text-text-muted"
                }`}
              >
                {selectedCategories.length}/5
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-surface-secondary p-4 rounded-md border border-border">
              {PLUGIN_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="grid grid-flow-col auto-cols-max items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-accent w-4 h-4"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">Keywords</label>
            <p className="text-xs text-text-muted mb-1.5">
              Comma-separated keywords for search.
            </p>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. economy, shops, gui"
              className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none focus:border-accent transition-all duration-150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Icon URL (Optional)
            </label>
            <input
              type="text"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none focus:border-accent transition-all duration-150"
            />
          </div>

          <h2 className="heading-3 mt-4 mb-2 pb-2 border-b-2 border-accent text-[1.1rem] italic">
            Artifacts...
          </h2>

          {pluginType === "PYTHON" ? (
            <div>
              <label className="block text-sm font-medium mb-0.5">
                Python Wheel (.whl)
              </label>
              <p className="text-xs text-text-muted mb-1.5">
                Upload your pre-built .whl file (max 100MB).
              </p>
              <input
                type="file"
                accept=".whl"
                onChange={(e) => setArtifact(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-accent file:text-white file:text-sm file:cursor-pointer"
              />
              {artifact && (
                <p className="text-xs text-success mt-1">
                  Selected: {artifact.name} (
                  {(artifact.size / 1024 / 1024).toFixed(1)} MB)
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-0.5">
                  Linux Shared Library (.so)
                </label>
                <p className="text-xs text-text-muted mb-1.5">
                  Upload the Linux .so artifact (max 100MB).
                </p>
                <input
                  type="file"
                  accept=".so"
                  onChange={(e) =>
                    setArtifactLinux(e.target.files?.[0] || null)
                  }
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-accent file:text-white file:text-sm file:cursor-pointer"
                />
                {artifactLinux && (
                  <p className="text-xs text-success mt-1">
                    Selected: {artifactLinux.name} (
                    {(artifactLinux.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-0.5">
                  Windows DLL (.dll)
                </label>
                <p className="text-xs text-text-muted mb-1.5">
                  Upload the Windows .dll artifact (max 100MB).
                </p>
                <input
                  type="file"
                  accept=".dll"
                  onChange={(e) => setArtifactWin(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-accent file:text-white file:text-sm file:cursor-pointer"
                />
                {artifactWin && (
                  <p className="text-xs text-success mt-1">
                    Selected: {artifactWin.name} (
                    {(artifactWin.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid justify-items-end gap-3 mt-2 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary px-8 py-3 text-base grid grid-flow-col place-items-center gap-1.5 disabled:opacity-60 w-full sm:w-auto"
            >
              <Upload size={18} />{" "}
              {submitting ? "Uploading..." : "Upload Plugin"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-error/10 rounded-sm text-error text-sm grid grid-flow-col auto-cols-max items-center gap-2 border border-error/20">
            <AlertTriangle size={16} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [isPreRelease, setIsPreRelease] = useState(
    (plugin?.versions?.find((v: any) => v.isLatest) || plugin?.versions?.[0])
      ?.isPreRelease || false,
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
            isPreRelease,
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
    return <div className="card p-6 text-center">Please sign in.</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="btn btn-secondary mb-6">
        <ArrowLeft size={16} /> Back to Plugin
      </button>

      <div className="card p-4 lg:p-6">
        <h1 className="heading-2 mb-2">Edit Plugin Details</h1>
        <div className="mb-6 p-3 lg:p-4 bg-accent/5 rounded-md border-l-4 border-accent">
          <p className="text-text-primary font-medium mb-2">
            Updating {plugin.name}
          </p>
          <p className="text-text-muted text-sm leading-relaxed">
            You are editing the general information for this plugin. Note that
            changing versions, supported APIs, or producers requires submitting
            a new version build.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* ── Section: About this plugin ── */}
          <h2 className="heading-3 mb-2 pb-2 border-b-2 border-accent text-[1.1rem] italic">
            About this plugin...
          </h2>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              Display Name
            </label>
            <p className="text-xs text-text-muted mb-1.5">
              The clean name shown on the marketplace (Rule B7).
            </p>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={(session?.user as any)?.trustLevel !== "ADMIN"}
              className={`w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent ${
                (session?.user as any)?.trustLevel !== "ADMIN"
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-text"
              }`}
            />
            {(session?.user as any)?.trustLevel !== "ADMIN" && (
              <p className="text-xs text-warning mt-1 grid grid-flow-col auto-cols-max items-center gap-1">
                <AlertTriangle size={12} /> Display name cannot be changed.
                Contact an admin if you need to rename your plugin.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              Short Description
            </label>
            <p className="text-xs text-text-muted mb-1.5">
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
              className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent"
            />
          </div>

          <div>
            <div className="grid sm:grid-cols-[1fr_auto] sm:items-end mb-0.5 gap-2">
              <label className="block text-sm font-medium">
                Long Description (Markdown)
              </label>
              {repoUrl && (
                <button
                  type="button"
                  onClick={fetchReadme}
                  disabled={isFetchingReadme}
                  className="grid grid-flow-col auto-cols-max items-center gap-1 text-xs bg-accent/10 text-accent border border-accent/20 rounded px-2 py-1 cursor-pointer font-medium hover:bg-accent/20 disabled:opacity-60 transition-all duration-150"
                >
                  <Download size={12} />{" "}
                  {isFetchingReadme ? "Importing..." : "Import from README"}
                </button>
              )}
            </div>
            <p className="text-xs text-text-muted mb-1.5">
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
              className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary outline-none resize-y font-mono text-sm focus:border-accent transition-all duration-150"
            />
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(160px,100%),1fr))] gap-2 bg-surface-secondary p-3 lg:p-4 rounded-md border border-border">
              {PLUGIN_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="grid grid-flow-col auto-cols-max items-center gap-2 cursor-pointer text-sm text-text-primary"
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

          {/* ── Section: About the latest version ── */}
          <h2 className="heading-3 mt-4 mb-2 pb-2 border-b-2 border-accent text-[1.1rem] italic">
            About the latest version...
          </h2>

          <div>
            <label className="grid grid-flow-col auto-cols-max items-center gap-2.5 text-sm font-medium cursor-pointer text-text-primary">
              <input
                type="checkbox"
                checked={isPreRelease}
                onChange={(e) => setIsPreRelease(e.target.checked)}
                className="accent-accent w-4 h-4"
              />
              <span>Pre-release?</span>
            </label>
            <p className="text-xs text-text-muted mt-1 ml-6.5">
              Pre-release versions will not be listed by default. This is for
              users to have a &quot;semi-stable&quot; preview version of your
              updates. Pre-release versions are less likely to be rejected,
              since a higher amount of bugs are tolerable.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              License{" "}
              {isFetchingLicense && (
                <span className="opacity-50 text-xs">
                  (Fetching from GitHub...)
                </span>
              )}
            </label>
            <p className="text-xs text-text-muted mb-1.5">
              {plugin?.isProprietary
                ? "Proprietary plugins use the Proprietary license."
                : "All plugins must have an OSI-approved open source license (Rule D6)."}
            </p>
            <div className="relative">
              {plugin?.isProprietary ? (
                <input
                  type="text"
                  value="Proprietary"
                  disabled
                  className="w-full px-3 py-2 rounded-md border border-border bg-black/20 dark:bg-white/5 text-text-muted cursor-not-allowed opacity-70 outline-none"
                />
              ) : (
                <>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-border bg-surface-secondary text-text-primary pr-10 outline-none focus:border-accent appearance-none cursor-pointer"
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
                      className="absolute right-7 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-accent hover:opacity-80 transition-opacity duration-150 disabled:opacity-50"
                      title="Fetch from GitHub"
                    >
                      <Download size={16} />
                    </button>
                  )}
                </>
              )}
            </div>
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

          {!plugin?.isProprietary && (
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Repository URL
              </label>
              <p className="text-xs text-text-muted mb-1.5">
                This field cannot be changed after creation.
              </p>
              <input
                type="text"
                value={repoUrl}
                disabled
                className="w-full px-3 py-2 rounded-md border border-border bg-black/20 dark:bg-white/5 text-text-muted cursor-not-allowed opacity-70 outline-none"
              />
            </div>
          )}

          <div className="grid justify-items-end gap-3 mt-2 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary px-8 py-3 text-base grid grid-flow-col place-items-center gap-1.5 disabled:opacity-60 w-full sm:w-auto"
            >
              <CheckCircle size={18} />{" "}
              {submitting ? "Saving..." : "Save Changes"}
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

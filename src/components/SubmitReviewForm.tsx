"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
const ENDSTONE_APIS = ["0.11.x", "0.10.x", "0.9.x", "0.8.x", "0.7.x"];

interface Props {
  buildId: string;
  buildNumber: number;
  plugin: any;
}

export default function SubmitReviewForm({
  buildId,
  buildNumber,
  plugin,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(
    plugin?.status === "PENDING_REVIEW",
  );
  const isFirstVersion = !plugin?.versions || plugin.versions.length === 0;

  // Fetch fresh review status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(
          `${apiUrl}/api/v1/submit/status/${plugin?.slug}`,
        );
        if (res.ok) {
          const json = await res.json();
          setIsPending(json.data?.status === "PENDING_REVIEW");
        }
      } catch {}
    };
    if (plugin?.slug) fetchStatus();
  }, [plugin?.slug]);

  const [version, setVersion] = useState("");
  const [displayName, setDisplayName] = useState(
    plugin?.displayName || plugin?.name || "",
  );
  const [description, setDescription] = useState(plugin?.description || "");
  const [longDescription, setLongDescription] = useState(
    plugin?.longDescription || "",
  );
  const [license, setLicense] = useState(plugin?.license || "");
  const [iconPath, setIconPath] = useState("");
  const [keywords, setKeywords] = useState(
    plugin?.keywords ? plugin.keywords.join(", ") : "",
  );
  const [notes, setNotes] = useState("");
  const [changelog, setChangelog] = useState("");
  const [isPreRelease, setIsPreRelease] = useState(false);
  const [supportedApis, setSupportedApis] = useState<string[]>(
    plugin?.versions?.[0]?.supportedApis || [],
  );
  const [isFetchingLicense, setIsFetchingLicense] = useState(false);
  const [isFetchingReadme, setIsFetchingReadme] = useState(false);

  // Producers State
  const [producers, setProducers] = useState<
    { githubUser: string; role: string }[]
  >([{ githubUser: "", role: "COLLABORATOR" }]);

  // Update producer if session loads after initial render
  useEffect(() => {
    // Priority: NextAuth session username -> Plugin author username -> Display name without spaces
    const username =
      (session?.user as any)?.username ||
      plugin?.author?.username ||
      (session?.user as any)?.name?.replace(/ /g, "");
    if (username && producers.length === 1 && producers[0].githubUser === "") {
      setProducers([{ githubUser: username, role: "COLLABORATOR" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, plugin]);

  // Categories State
  const initialTags = plugin?.tags || [];
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialTags);

  useEffect(() => {
    if (!license) fetchLicense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLicense = async () => {
    if (!plugin?.repoUrl) return;
    setIsFetchingLicense(true);
    try {
      const match = plugin.repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
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
    if (!plugin?.repoUrl) return;
    setIsFetchingReadme(true);
    setError("");
    try {
      const match = plugin.repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
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

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    // Validate Producers
    const emptyProducers = producers.filter((p) => !p.githubUser.trim());
    if (emptyProducers.length > 0) {
      setError("Producer GitHub usernames cannot be empty.");
      return;
    }
    const hasCollaborator = producers.some((p) => p.role === "COLLABORATOR");
    if (!hasCollaborator) {
      setError("There must be at least one COLLABORATOR.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const apiToken = (session?.user as any)?.apiToken;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/submit/${buildId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version,
            displayName,
            description,
            longDescription,
            tags: selectedCategories.join(","),
            keywords,
            license,
            iconPath,
            notes,
            changelog,
            supportedApis,
            producers,
            isDraft,
            isPreRelease,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        if (isDraft) setIsPending(false);
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

  if (!session)
    return <div className="card p-6 text-center">Please sign in.</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="btn btn-secondary mb-6">
        <ArrowLeft size={16} /> Back to Build
      </button>

      <div className="card p-4 lg:p-6">
        <h1 className="heading-2 mb-2">Publish Plugin</h1>
        <div className="mb-6 p-4 bg-accent/5 rounded-sm border-l-4 border-accent">
          <p className="text-text-primary font-medium mb-2">
            Submit Build #{buildNumber} for Review
          </p>
          <p className="text-text-muted text-sm leading-relaxed">
            Before submitting, please ensure your plugin complies with the{" "}
            <a
              href="/rules"
              target="_blank"
              className="text-accent underline hover:text-accent-hover transition-colors"
            >
              EndGit Plugin Submission Rules
            </a>
            . All submissions are manually reviewed by our moderation team. Your
            submission should be complete, well-documented, and functional.
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
              className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent"
            />
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
              className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">Keywords</label>
            <p className="text-xs text-text-muted mb-1.5">
              Comma-separated keywords to help users find your plugin in search.
            </p>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. economy, shops, gui"
              className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent"
            />
          </div>

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] sm:items-end mb-0.5 gap-2">
              <label className="block text-sm font-medium">
                Long Description (Markdown)
              </label>
              {plugin?.repoUrl && (
                <button
                  type="button"
                  onClick={fetchReadme}
                  disabled={isFetchingReadme}
                  className="grid grid-flow-col auto-cols-max items-center gap-1 text-xs bg-accent/10 text-accent border border-accent/20 rounded-xs px-2 py-1 cursor-pointer font-medium hover:bg-accent/20 disabled:opacity-60 transition-all duration-150"
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
              className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none resize-y font-mono text-sm focus:border-accent transition-all duration-150"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-surface-secondary p-4 rounded-sm border border-border">
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
            <label className="block text-sm font-medium mb-0.5">
              License{" "}
              {isFetchingLicense && (
                <span className="opacity-50 text-xs">
                  (Fetching from GitHub...)
                </span>
              )}
            </label>
            <p className="text-xs text-text-muted mb-1.5">
              All plugins must have an OSI-approved open source license (Rule
              D6).
            </p>
            <div className="relative">
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none focus:border-accent transition-all duration-150 pr-10 appearance-none"
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
              {plugin?.repoUrl && (
                <button
                  type="button"
                  onClick={fetchLicense}
                  disabled={isFetchingLicense}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-accent bg-transparent hover:text-accent-hover transition-colors disabled:opacity-50"
                  title="Fetch from GitHub"
                >
                  <Download size={16} />
                </button>
              )}
            </div>
          </div>

          {/* ── Section: About this version ── */}
          <h2 className="heading-3 mt-4 mb-2 pb-2 border-b-2 border-accent text-[1.1rem] italic">
            About this version...
          </h2>

          <div>
            <label className="block text-sm font-medium mb-0.5">Version</label>
            <p className="text-xs text-text-muted mb-1.5">
              Follow Semantic Versioning (e.g., 1.0.0, 2.0.0-beta).
            </p>
            <input
              type="text"
              required
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 1.0.0"
              className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none focus:border-accent transition-all duration-150"
            />
          </div>

          <div>
            <label className="grid grid-flow-col auto-cols-max items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isPreRelease}
                onChange={(e) => setIsPreRelease(e.target.checked)}
                className="accent-accent w-4 h-4"
              />
              <span>Pre-release?</span>
            </label>
            <p className="text-xs text-text-muted mt-1 ml-6 leading-relaxed">
              Pre-release versions will not be listed by default. This is for
              users to have a &quot;semi-stable&quot; preview version of your
              updates. Pre-release versions are less likely to be rejected,
              since a higher amount of bugs are tolerable.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              Supported APIs (Endstone Versions)
            </label>
            <p className="text-xs text-text-muted mb-1.5">
              Select the stable Endstone API versions this build is verified to
              work with (Rule B1).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-surface-secondary p-4 rounded-sm border border-border">
              {ENDSTONE_APIS.map((api) => (
                <label
                  key={api}
                  className="grid grid-flow-col auto-cols-max items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={supportedApis.includes(api)}
                    onChange={() => {
                      if (supportedApis.includes(api)) {
                        setSupportedApis((prev) =>
                          prev.filter((a) => a !== api),
                        );
                      } else {
                        setSupportedApis((prev) => [...prev, api]);
                      }
                    }}
                    className="accent-accent w-4 h-4"
                  />
                  <span>{api}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Icon Path (Optional)
            </label>
            <input
              type="text"
              value={iconPath}
              onChange={(e) => setIconPath(e.target.value)}
              placeholder="e.g. assets/icon.png (Default: icon.png)"
              className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none focus:border-accent transition-all duration-150"
            />
            <p className="text-xs text-text-muted mt-1">
              Relative path to the icon file in your repository. If not found,
              the default EndGit logo will be used.
            </p>
          </div>

          {!isFirstVersion && (
            <div>
              <label className="block text-sm font-medium mb-0.5">
                What&apos;s New (Changelog)
              </label>
              <p className="text-xs text-text-muted mb-1.5">
                Provide a human-readable list of changes, bug fixes, and new
                features (Rule D5).
              </p>
              <textarea
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                rows={4}
                placeholder="- Added new command /example&#10;- Fixed issue with config loading"
                className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none resize-y font-mono text-sm focus:border-accent transition-all duration-150"
              />
            </div>
          )}

          <div>
            <div className="grid grid-cols-[1fr_auto] items-baseline mb-2">
              <label className="text-sm font-medium">Producers</label>
              <button
                type="button"
                onClick={() =>
                  setProducers([
                    ...producers,
                    { githubUser: "", role: "CONTRIBUTOR" },
                  ])
                }
                className="grid grid-flow-col auto-cols-max items-center gap-1 text-xs border border-border px-2 py-1 rounded-xs hover:bg-surface-secondary hover:border-border-highlight transition-all cursor-pointer"
              >
                <Plus size={12} /> Add Producer
              </button>
            </div>

            <div className="grid gap-2">
              {producers.map((producer, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-stretch sm:items-center"
                >
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
                    className={`flex-1 px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent ${
                      index === 0
                        ? "opacity-60 cursor-not-allowed bg-black/20"
                        : ""
                    }`}
                  />
                  <select
                    value={producer.role}
                    disabled={index === 0}
                    onChange={(e) => {
                      const newProducers = [...producers];
                      newProducers[index].role = e.target.value;
                      setProducers(newProducers);
                    }}
                    className={`px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none transition-all duration-150 focus:border-accent sm:w-[140px] ${
                      index === 0
                        ? "opacity-60 cursor-not-allowed bg-black/20"
                        : ""
                    }`}
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
                    className={`p-2 transition-colors duration-150 ${
                      producers.length > 1
                        ? "text-error hover:text-red-600 cursor-pointer"
                        : "text-text-muted cursor-not-allowed"
                    }`}
                    disabled={producers.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-3 bg-accent/5 rounded-sm border border-accent/15 mt-2">
              <p className="text-xs text-text-secondary m-0 leading-relaxed">
                <strong>Rule A7:</strong> You must only submit work you have
                authored. Add all GitHub contributors who helped create this
                version. There must be at least one{" "}
                <strong>Collaborator</strong>.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-0.5">
              Notes to Reviewer (Optional)
            </label>
            <p className="text-xs text-text-muted mb-1.5">
              Provide context for the moderator reviewing your plugin (e.g.,
              test server IPs, known limitations).
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any specific features to test, or explanations for unusual code patterns..."
              className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none resize-y focus:border-accent transition-all duration-150"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[auto_auto] gap-3 mt-2 pt-4 border-t border-border justify-items-end">
            {isPending && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e as any, true)}
                disabled={submitting}
                className="btn btn-secondary px-8 py-3 text-base disabled:opacity-60 w-full sm:w-auto justify-center"
              >
                Save Draft
              </button>
            )}
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, false)}
              disabled={submitting}
              className="btn btn-primary px-8 py-3 text-base disabled:opacity-60 w-full sm:w-auto justify-center"
            >
              <CheckCircle size={18} />{" "}
              {submitting ? "Submitting..." : "Submit Plugin for Review"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-error/8 rounded-sm text-error text-sm grid grid-flow-col auto-cols-max items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}

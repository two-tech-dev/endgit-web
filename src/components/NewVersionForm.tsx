"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Upload, Loader2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewVersionForm({
  pluginSlug,
  isAuthor,
}: {
  pluginSlug: string;
  isAuthor: boolean;
}) {
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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version,
          changelog,
          buildId: buildId || null,
          fileUrl: fileUrl || null,
          fileName: fileName || null,
          fileSize: 1024, // Dummy size for manual submission for now
          fileHash: "manual-upload",
        }),
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
        className="grid grid-flow-col auto-cols-max items-center gap-1.5 px-4 py-2 rounded-sm bg-accent text-white hover:bg-accent-hover font-semibold text-sm cursor-pointer mt-2"
      >
        <Plus size={16} /> Submit New Version
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] grid place-items-center p-4">
          <div className="card p-6 w-full max-w-[500px]">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Submit New Version
            </h3>

            {error && (
              <div className="bg-error/10 text-error p-3 rounded-sm mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Version Number (e.g. 1.0.0)
                </label>
                <input
                  type="text"
                  required
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none focus:border-accent transition-all duration-150"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Changelog (Optional)
                </label>
                <textarea
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-sm border border-border bg-surface-secondary text-text-primary outline-none resize-y focus:border-accent transition-all duration-150"
                />
              </div>

              <div className="border-t border-border mt-2 pt-4">
                <p className="text-sm font-semibold mb-2">Artifact Source</p>
                <div className="text-[13px] text-text-muted mb-3 grid grid-cols-[auto_1fr] items-start gap-1.5">
                  <Info size={14} className="shrink-0 mt-0.5" />{" "}
                  <span>
                    Provide either a successful Build ID or a direct file URL.
                  </span>
                </div>

                <div className="grid gap-3">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      From Build ID
                    </label>
                    <input
                      type="text"
                      value={buildId}
                      onChange={(e) => {
                        setBuildId(e.target.value);
                        setFileUrl("");
                        setFileName("");
                      }}
                      placeholder="e.g. clt3x..."
                      disabled={!!fileUrl}
                      className={`w-full px-3 py-2 rounded-sm border border-border bg-surface-card text-text-primary outline-none transition-all duration-150 focus:border-accent ${
                        fileUrl
                          ? "opacity-50 cursor-not-allowed bg-surface-secondary"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="text-center text-[10px] font-bold text-text-muted tracking-wider">
                    — OR —
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      Manual File URL
                    </label>
                    <input
                      type="url"
                      value={fileUrl}
                      onChange={(e) => {
                        setFileUrl(e.target.value);
                        setBuildId("");
                      }}
                      placeholder="https://example.com/plugin.zip"
                      disabled={!!buildId}
                      className={`w-full px-3 py-2 rounded-sm border border-border bg-surface-card text-text-primary outline-none transition-all duration-150 focus:border-accent ${
                        buildId
                          ? "opacity-50 cursor-not-allowed bg-surface-secondary"
                          : ""
                      }`}
                    />
                  </div>
                  {fileUrl && (
                    <div className="grid gap-1.5">
                      <label className="text-xs font-medium text-text-secondary">
                        File Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="plugin-1.0.0.zip"
                        className="w-full px-3 py-2 rounded-sm border border-border bg-surface-card text-text-primary outline-none focus:border-accent transition-all duration-150"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-flow-col auto-cols-max gap-3 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-sm bg-transparent text-text-primary border border-border hover:bg-surface-secondary cursor-pointer text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || (!buildId && !fileUrl)}
                  className={`grid grid-flow-col auto-cols-max items-center gap-1.5 px-5 py-2 rounded-sm bg-accent text-white font-semibold text-sm transition-all ${
                    submitting || (!buildId && !fileUrl)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-accent-hover cursor-pointer"
                  }`}
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
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

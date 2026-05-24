"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function UploadVersionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [plugin, setPlugin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [artifact, setArtifact] = useState<File | null>(null);
  const [artifactLinux, setArtifactLinux] = useState<File | null>(null);
  const [artifactWin, setArtifactWin] = useState<File | null>(null);

  useEffect(() => {
    const fetchPlugin = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const token = (session?.user as any)?.apiToken;
        const res = await fetch(`${apiUrl}/api/v1/plugins/${slug}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success) {
          setPlugin(json.data);
        } else {
          setError("Plugin not found");
        }
      } catch {
        setError("Failed to load plugin");
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchPlugin();
  }, [session, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (plugin?.pluginType === "PYTHON" && !artifact) {
      setError("A .whl artifact file is required.");
      return;
    }
    if (plugin?.pluginType === "CPP") {
      if (!artifactLinux) {
        setError("A Linux .so artifact file is required.");
        return;
      }
      if (!artifactWin) {
        setError("A Windows .dll artifact file is required.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (plugin?.pluginType === "PYTHON" && artifact) {
        formData.append("artifact", artifact);
      }
      if (plugin?.pluginType === "CPP") {
        if (artifactLinux) formData.append("artifact_linux", artifactLinux);
        if (artifactWin) formData.append("artifact_win", artifactWin);
      }

      const apiToken = (session?.user as any)?.apiToken;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/upload/plugin/${slug}/version`,
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

  if (loading) {
    return (
      <div className="container py-6 lg:py-8">
        <div className="card p-6 text-center text-text-muted">
          Loading plugin...
        </div>
      </div>
    );
  }

  if (error && !plugin) {
    return (
      <div className="container py-6 lg:py-8">
        <div className="card p-6 text-center text-error">{error}</div>
      </div>
    );
  }

  const nextBuildNumber = (plugin?.builds?.length || 0) + 1;

  return (
    <div className="container py-6 lg:py-8">
      <button
        onClick={() => router.back()}
        className="btn btn-secondary mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card p-4 lg:p-6">
        <h1 className="heading-2 mb-2">Upload New Version</h1>
        <div className="mb-6 p-4 bg-accent/5 rounded-md border-l-4 border-accent">
          <p className="text-text-primary font-medium mb-1">
            {plugin?.displayName}
          </p>
          <p className="text-text-muted text-sm">
            Upload a new pre-built artifact. After uploading you&apos;ll be
            taken to the submission form to set the version number, changelog,
            and submit for review.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {plugin?.pluginType === "PYTHON" ? (
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
              {submitting ? "Uploading..." : "Upload & Continue"}
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

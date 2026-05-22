"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center max-w-md mx-auto my-16 bg-surface-card border border-border rounded-lg shadow-sm">
      <h2 className="text-text-primary text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-text-muted text-sm break-words">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-brand hover:bg-brand-dark text-white font-medium rounded-md shadow-sm transition-all"
      >
        Try again
      </button>
    </div>
  );
}

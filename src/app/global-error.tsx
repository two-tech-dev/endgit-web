"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-text-primary font-sans p-8 text-center max-w-md mx-auto my-16">
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-text-muted text-sm break-words">{error.message}</p>
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-brand hover:bg-brand-dark text-white font-medium rounded-sm shadow-sm transition-all"
        >
          Try again
        </button>
      </body>
    </html>
  );
}

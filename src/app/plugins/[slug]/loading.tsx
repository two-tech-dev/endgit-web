function SkeletonBlock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className ?? ""}`} style={style} />;
}

export default function PluginDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6">
        <SkeletonBlock className="h-8 w-32 rounded-md" />
      </div>

      {/* Header */}
      <header className="mb-6 rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="size-10 rounded-lg" />
              <SkeletonBlock className="h-8 w-56" />
              <SkeletonBlock className="h-5 w-16 rounded-full" />
            </div>
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-96 max-w-full" />
          </div>
          <div className="flex shrink-0 flex-col items-end gap-3">
            <SkeletonBlock className="h-9 w-40 rounded-md" />
            <div className="flex gap-4">
              <SkeletonBlock className="h-5 w-14" />
              <SkeletonBlock className="h-5 w-20" />
            </div>
          </div>
        </div>
      </header>

      {/* Two Column */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* Quick Install */}
          <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
            <SkeletonBlock className="mb-3 h-4 w-32" />
            <SkeletonBlock className="h-10 w-full rounded-lg" />
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="h-6 w-14 rounded-sm" />
            </div>
            <SkeletonBlock className="h-48 w-full rounded-lg" />
          </div>

          {/* Analytics */}
          <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
            <SkeletonBlock className="mb-3 h-4 w-24" />
            <SkeletonBlock className="h-64 w-full rounded-lg" />
          </div>

          {/* Ratings */}
          <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
            <SkeletonBlock className="mb-3 h-4 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <SkeletonBlock className="size-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <SkeletonBlock className="h-3.5 w-28" />
                    <SkeletonBlock className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-5">
          {/* VirusTotal */}
          <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="size-12 rounded-full" />
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
            <SkeletonBlock className="mb-3 h-4 w-16" />
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex justify-between">
                  <SkeletonBlock className="h-3.5 w-20" />
                  <SkeletonBlock className="h-3.5 w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
            <SkeletonBlock className="mb-3 h-4 w-28" />
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="space-y-1.5">
                  <SkeletonBlock className="h-5 w-28 rounded" />
                  <SkeletonBlock className="h-7 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

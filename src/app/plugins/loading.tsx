function SkeletonBlock({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`skeleton ${className ?? ""}`} style={style} />;
}

function CardSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
      {children}
    </div>
  );
}

function PluginRowSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/85 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="size-7 rounded-md" />
          <SkeletonBlock className="h-5 w-40" />
        </div>
        <div className="flex gap-1.5">
          <SkeletonBlock className="h-5 w-14 rounded-full" />
          <SkeletonBlock className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-4 w-12" />
          <SkeletonBlock className="h-4 w-16" />
        </div>
        <SkeletonBlock className="h-4 w-10" />
      </div>
    </div>
  );
}

export default function PluginsLoading() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-6 w-32 rounded-full" />
            <SkeletonBlock className="h-8 w-48" />
            <SkeletonBlock className="h-4 w-40" />
          </div>
          <div className="hidden w-full max-w-xs sm:block">
            <SkeletonBlock className="h-9 w-full rounded-md" />
          </div>
        </div>
      </header>

      <div className="grid gap-4 xl:h-[calc(100dvh-11rem)] xl:grid-cols-[240px_minmax(0,1fr)] xl:overflow-hidden">
        <aside className="space-y-4 xl:h-full xl:overflow-y-auto">
          <CardSkeleton>
            <SkeletonBlock className="mb-3 h-4 w-12" />
            <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
              {Array.from({ length: 3 }, (_, i) => (
                <SkeletonBlock key={i} className="h-8 rounded-md" />
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <SkeletonBlock className="h-3 w-8" />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <SkeletonBlock key={i} className="h-8 rounded-md" />
                ))}
              </div>
            </div>
          </CardSkeleton>
          <CardSkeleton>
            <SkeletonBlock className="mb-3 h-4 w-20" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {Array.from({ length: 8 }, (_, i) => (
                <SkeletonBlock key={i} className="h-8 rounded-md" />
              ))}
            </div>
          </CardSkeleton>
        </aside>

        <main className="flex min-w-0 flex-col gap-4 xl:h-full xl:overflow-y-auto xl:pr-1">
          {Array.from({ length: 5 }, (_, i) => (
            <PluginRowSkeleton key={i} />
          ))}
        </main>
      </div>
    </section>
  );
}

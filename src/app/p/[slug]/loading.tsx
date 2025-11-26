export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="aspect-[3/4] w-full animate-pulse rounded-lg border bg-muted" />
        <div className="space-y-3">
          <div className="h-6 w-64 bg-muted animate-pulse" />
          <div className="h-4 w-40 bg-muted/80 animate-pulse" />
          <div className="h-40 w-full bg-muted/60 animate-pulse" />
          <div className="h-10 w-40 bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-4 h-6 w-48 bg-muted animate-pulse" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-lg border bg-white">
            <div className="aspect-[3/4] w-full bg-muted" />
            <div className="p-3">
              <div className="h-4 w-32 bg-muted" />
              <div className="mt-2 h-3 w-24 bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-500">Today</div>
          <div className="mt-1 text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-500">Orders</div>
          <div className="mt-1 text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-500">Revenue</div>
          <div className="mt-1 text-2xl font-semibold">—</div>
        </div>
      </div>
    </div>
  )
}

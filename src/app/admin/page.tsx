import { createClient } from "@/lib/supabase/server"

export default async function AdminHome() {
  const supabase = createClient()
  // Today range
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startIso = start.toISOString()

  const [{ data: ordersToday }, { data: revTodayRows }, { data: ordersAll }, { data: recent } ] = await Promise.all([
    supabase.from("orders").select("id").gte("created_at", startIso),
    supabase.from("orders").select("total").gte("created_at", startIso),
    supabase.from("orders").select("id"),
    supabase.from("orders").select("id, created_at, total, status").order("created_at", { ascending: false }).limit(5),
  ])

  const todayCount = (ordersToday || []).length
  const todayRevenue = (revTodayRows || []).reduce((sum: number, r: any) => sum + Number(r.total || 0), 0)
  const totalOrders = (ordersAll || []).length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-500">Today</div>
          <div className="mt-1 text-2xl font-semibold">{todayCount}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-500">Orders</div>
          <div className="mt-1 text-2xl font-semibold">{totalOrders}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-500">Revenue Today</div>
          <div className="mt-1 text-2xl font-semibold">Rs. {todayRevenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">Recent Orders</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-neutral-50 text-xs text-neutral-600">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(recent || []).map((o: any) => (
                <tr key={o.id} className="border-b">
                  <td className="px-3 py-2 align-top text-xs text-neutral-700">{o.id}</td>
                  <td className="px-3 py-2 align-top">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2 align-top">Rs. {Number(o.total).toLocaleString()}</td>
                  <td className="px-3 py-2 align-top text-xs uppercase">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

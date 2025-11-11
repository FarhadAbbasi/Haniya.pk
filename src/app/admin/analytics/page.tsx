import { createClient } from "@/lib/supabase/server"

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

export default async function AdminAnalyticsPage() {
  const supabase = createClient()

  // Ranges
  const since7 = startOfDay(daysAgo(7)).toISOString()
  const since30 = startOfDay(daysAgo(30)).toISOString()

  // Orders considered for sales metrics
  const saleStatuses = ["confirmed", "shipped"]

  // Last 7 days orders
  const { data: orders7 } = await supabase
    .from("orders")
    .select("id, total, created_at, status")
    .gte("created_at", since7)
    .in("status", saleStatuses)
    .order("created_at", { ascending: true })

  // Last 30 days orders
  const { data: orders30 } = await supabase
    .from("orders")
    .select("id, total, created_at, status")
    .gte("created_at", since30)
    .in("status", saleStatuses)
    .order("created_at", { ascending: true })

  // KPI helpers
  const sum = (arr: any[], key: string) => (arr || []).reduce((s, r) => s + Number(r[key] || 0), 0)
  const count = (arr: any[]) => (arr || []).length

  const sales7 = sum(orders7 || [], "total")
  const ordersCount7 = count(orders7 || [])
  const aov7 = ordersCount7 ? sales7 / ordersCount7 : 0

  const sales30 = sum(orders30 || [], "total")
  const ordersCount30 = count(orders30 || [])
  const aov30 = ordersCount30 ? sales30 / ordersCount30 : 0

  // Orders per day (last 30)
  const byDay = new Map<string, { date: string; orders: number; sales: number }>()
  ;(orders30 || []).forEach((o) => {
    const d = new Date(o.created_at)
    const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10)
    const cur = byDay.get(key) || { date: key, orders: 0, sales: 0 }
    cur.orders += 1
    cur.sales += Number(o.total || 0)
    byDay.set(key, cur)
  })
  const trend30 = Array.from(byDay.values()).sort((a, b) => (a.date < b.date ? -1 : 1))

  // Top products last 30 days by revenue/units
  const orderIds30 = (orders30 || []).map((o) => o.id)
  let topByUnits: Array<{ product_id: string; units: number }> = []
  let topByRevenue: Array<{ product_id: string; revenue: number }> = []
  let productTitles = new Map<string, string>()
  if (orderIds30.length) {
    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, qty, price, order_id")
      .in("order_id", orderIds30)

    const units = new Map<string, number>()
    const revenue = new Map<string, number>()
    for (const it of items || []) {
      const pid = String(it.product_id)
      units.set(pid, (units.get(pid) || 0) + Number(it.qty || 0))
      revenue.set(pid, (revenue.get(pid) || 0) + Number(it.qty || 0) * Number(it.price || 0))
    }
    topByUnits = Array.from(units.entries())
      .map(([product_id, units]) => ({ product_id, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 10)
    topByRevenue = Array.from(revenue.entries())
      .map(([product_id, revenue]) => ({ product_id, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    const topIds = Array.from(new Set([...topByUnits.map((x) => x.product_id), ...topByRevenue.map((x) => x.product_id)]))
    if (topIds.length) {
      const { data: prods } = await supabase.from("products").select("id, title").in("id", topIds)
      for (const p of prods || []) productTitles.set(p.id as string, p.title as string)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-600">Sales (7d)</div>
          <div className="mt-1 text-xl font-semibold">Rs. {Math.round(sales7).toLocaleString()}</div>
          <div className="mt-1 text-xs text-neutral-500">Orders: {ordersCount7} • AOV: Rs. {Math.round(aov7).toLocaleString()}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-600">Sales (30d)</div>
          <div className="mt-1 text-xl font-semibold">Rs. {Math.round(sales30).toLocaleString()}</div>
          <div className="mt-1 text-xs text-neutral-500">Orders: {ordersCount30} • AOV: Rs. {Math.round(aov30).toLocaleString()}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-600">Conversion</div>
          <div className="mt-1 text-xl font-semibold">—</div>
          <div className="mt-1 text-xs text-neutral-500">Coming soon</div>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">Orders per day (30d)</div>
        <div className="p-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="text-sm">
              <div className="mb-2 text-xs text-neutral-600">Orders</div>
              <ul className="max-h-72 divide-y overflow-auto rounded border">
                {trend30.map((d) => (
                  <li key={d.date} className="flex items-center justify-between px-3 py-2">
                    <span className="text-neutral-700">{d.date}</span>
                    <span className="font-medium">{d.orders}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-sm">
              <div className="mb-2 text-xs text-neutral-600">Sales</div>
              <ul className="max-h-72 divide-y overflow-auto rounded border">
                {trend30.map((d) => (
                  <li key={d.date} className="flex items-center justify-between px-3 py-2">
                    <span className="text-neutral-700">{d.date}</span>
                    <span className="font-medium">Rs. {Math.round(d.sales).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="border-b p-3 text-sm font-medium">Top products by revenue (30d)</div>
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topByRevenue.map((x) => (
                <tr key={x.product_id} className="border-t">
                  <td className="px-3 py-2">{productTitles.get(x.product_id) || x.product_id}</td>
                  <td className="px-3 py-2">Rs. {Math.round(x.revenue).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="border-b p-3 text-sm font-medium">Top products by units (30d)</div>
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Units</th>
              </tr>
            </thead>
            <tbody>
              {topByUnits.map((x) => (
                <tr key={x.product_id} className="border-t">
                  <td className="px-3 py-2">{productTitles.get(x.product_id) || x.product_id}</td>
                  <td className="px-3 py-2">{x.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

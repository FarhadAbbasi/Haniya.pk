import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const { status, page } = await searchParams
  const supabase = createClient()
  const pageNum = Math.max(1, Number(page || 1))
  const pageSize = 20
  const from = (pageNum - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("orders")
    .select("id, created_at, total, status, email_sent", { count: "exact" })
    .order("created_at", { ascending: false }) as any
  if (status && ["pending","confirmed","shipped","cancelled"].includes(status)) {
    query = query.eq("status", status)
  }
  const { data: orders, count } = await query.range(from, to)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
      <form className="flex items-center gap-2" method="GET">
        <label className="text-sm text-neutral-600" htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          defaultValue={status || ""}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="hidden" name="page" value="1" />
        <button type="submit" className="rounded border px-2 py-1 text-sm">Apply</button>
      </form>
      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">Latest Orders</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-3 py-2">Order ID</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {(orders || []).map((o: any) => (
                <tr key={o.id} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                  <td className="px-3 py-2">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">Rs. {Number(o.total).toLocaleString()}</td>
                  <td className="px-3 py-2">{o.status}</td>
                  <td className="px-3 py-2">{o.email_sent ? "Sent" : "Pending"}</td>
                  <td className="px-3 py-2 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="text-xs text-blue-600 hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <div>
          Page {pageNum} {typeof count === "number" ? `of ${Math.max(1, Math.ceil(count / pageSize))}` : ""}
        </div>
        <div className="flex gap-2">
          <Link className={`rounded border px-2 py-1 ${pageNum <= 1 ? "pointer-events-none opacity-50" : ""}`} href={`?${new URLSearchParams({ ...(status ? { status } : {}), page: String(Math.max(1, pageNum - 1)) }).toString()}`}>Prev</Link>
          <Link className={`rounded border px-2 py-1 ${orders && orders.length < pageSize ? "pointer-events-none opacity-50" : ""}`} href={`?${new URLSearchParams({ ...(status ? { status } : {}), page: String(pageNum + 1) }).toString()}`}>Next</Link>
        </div>
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { OrderActionsClient } from "@/components/admin/order-actions-client"

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()
  const { data: order } = await supabase
    .from("orders")
    .select("id, created_at, total, status, email_sent, currency")
    .eq("id", id)
    .maybeSingle()

  // Fetch items (some schemas may not have created_at on order_items), then enrich with product titles
  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, qty, price")
    .eq("order_id", id)

  const productIds = Array.from(new Set(((items as any[]) || []).map((it) => String(it.product_id)).filter(Boolean)))
  let productsById = new Map<string, { title?: string | null }>()
  if (productIds.length) {
    const { data: prods } = await supabase
      .from("products")
      .select("id, title")
      .in("id", productIds)
    for (const p of (prods as any[]) || []) productsById.set(String(p.id), { title: p.title })
  }

  const { data: addr } = await supabase
    .from("order_addresses")
    .select("name, email, phone, city, line1")
    .eq("order_id", id)
    .maybeSingle()

  if (!order) {
    return <div className="text-sm text-neutral-500">Order not found.</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Order {order.id}</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Items</div>
            <div className="divide-y text-sm">
              {(items || []).map((i: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3">
                  <div>
                    <div className="font-medium">{productsById.get(String(i.product_id))?.title || String(i.product_id)}</div>
                    <div className="text-xs text-neutral-500">Qty {i.qty}</div>
                  </div>
                  <div>Rs. {(Number(i.price) * Number(i.qty)).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Summary</div>
            <div className="p-3 text-sm">
              <div className="flex justify-between"><span>Status</span><span className="font-medium">{order.status}</span></div>
              <div className="flex justify-between"><span>Total</span><span>Rs. {Number(order.total).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Email</span><span>{order.email_sent ? "Sent" : "Pending"}</span></div>
              <div className="mt-2 text-xs text-neutral-500">{new Date(order.created_at).toLocaleString()}</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Customer</div>
            <div className="p-3 text-sm">
              <div className="font-medium">{addr?.name}</div>
              <div className="text-neutral-600">{addr?.email}</div>
              <div className="text-neutral-600">{addr?.phone}</div>
              <div className="mt-2 text-neutral-600">{addr?.line1}</div>
              <div className="text-neutral-600">{addr?.city}</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Actions</div>
            <OrderActionsClient orderId={order.id} initialStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  )
}

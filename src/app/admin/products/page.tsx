import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function AdminProductsPage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from("products")
    .select("id, title, price, is_sale, is_new")
    .order("created_at", { ascending: false })
    .limit(50)

  const ids = (products || []).map((p: any) => p.id)
  let variantsByProduct = new Map<string, { count: number; stock: number }>()
  if (ids.length > 0) {
    const { data: variants } = await supabase
      .from("product_variants")
      .select("product_id, stock")
      .in("product_id", ids)
    if (variants) {
      for (const v of variants as any[]) {
        const key = v.product_id as string
        const entry = variantsByProduct.get(key) || { count: 0, stock: 0 }
        entry.count += 1
        entry.stock += Number(v.stock || 0)
        variantsByProduct.set(key, entry)
      }
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">Latest Products</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Flags</th>
                <th className="px-3 py-2">Variants</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {(products || []).map((p: any) => {
                const agg = variantsByProduct.get(p.id) || { count: 0, stock: 0 }
                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-3 py-2">{p.title}</td>
                    <td className="px-3 py-2">Rs. {Number(p.price).toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs">
                      {p.is_sale ? <span className="mr-2 rounded bg-red-50 px-2 py-0.5 text-red-700">Sale</span> : null}
                      {p.is_new ? <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">New</span> : null}
                    </td>
                    <td className="px-3 py-2">{agg.count}</td>
                    <td className="px-3 py-2">{agg.stock}</td>
                    <td className="px-3 py-2 text-right">
                      <Link href={`/admin/products/${p.id}`} className="text-xs text-blue-600 hover:underline">Open</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

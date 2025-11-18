import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ sale?: string; isNew?: string; stock?: string; page?: string }> }) {
  const { sale, isNew, stock, page } = await searchParams
  const supabase = createClient()
  const pageNum = Math.max(1, Number(page || 1))
  const pageSize = 20
  const from = (pageNum - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("products")
    .select("id, title, price, is_sale, is_new")
    .order("created_at", { ascending: false }) as any
  if (sale === "yes") query = query.eq("is_sale", true)
  if (sale === "no") query = query.eq("is_sale", false)
  if (isNew === "yes") query = query.eq("is_new", true)
  if (isNew === "no") query = query.eq("is_new", false)
  const { data: baseProducts } = await query.range(from, to)
  const products = baseProducts || []

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

  const filteredProducts = (products || []).filter((p: any) => {
    if (!stock) return true
    const agg = variantsByProduct.get(p.id) || { count: 0, stock: 0 }
    if (stock === "in") return agg.stock > 0
    if (stock === "out") return agg.stock <= 0
    return true
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
      <div>
        <Link href="/admin/products/new" className="inline-flex items-center rounded bg-black px-3 py-2 text-xs font-medium text-white hover:cursor-pointer">Add Product</Link>
      </div>
      <form className="flex flex-wrap items-end gap-2" method="GET">
        <div className="flex flex-col text-sm">
          <label className="text-neutral-600" htmlFor="sale">Sale</label>
          <select id="sale" name="sale" defaultValue={sale || ""} className="rounded border  pr-8 px-2 py-1 text-sm">
            <option value="">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="flex flex-col text-sm">
          <label className="text-neutral-600" htmlFor="isNew">New</label>
          <select id="isNew" name="isNew" defaultValue={isNew || ""} className="rounded border pr-8 px-2 py-1 text-sm">
            <option value="">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="flex flex-col text-sm">
          <label className="text-neutral-600" htmlFor="stock">Stock</label>
          <select id="stock" name="stock" defaultValue={stock || ""} className="rounded border  pr-8 px-2 py-1 text-sm">
            <option value="">Any</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
        <input type="hidden" name="page" value="1" />
        <button type="submit" className="rounded border bg-slate-500 text-white px-2 py-1 text-sm hover:cursor-pointer ">Apply</button>
      </form>
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
              {(filteredProducts || []).map((p: any) => {
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
                      <Link href={`/admin/products/${p.id}`} className="rounded border text-xs text-blue-800">
                        <button type="submit" className="rounded border bg-slate-300 px-2 py-1 text-sm hover:cursor-pointer focus:bg-slate-400">Open</button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <div>Page {pageNum}</div>
        <div className="flex gap-2">
          <Link className={`rounded border px-2 py-1 ${pageNum <= 1 ? "pointer-events-none opacity-50" : ""}`} href={`?${new URLSearchParams({ ...(sale ? { sale } : {}), ...(isNew ? { isNew } : {}), ...(stock ? { stock } : {}), page: String(Math.max(1, pageNum - 1)) }).toString()}`}>Prev</Link>
          <Link className={`rounded border px-2 py-1 ${products && products.length < pageSize ? "pointer-events-none opacity-50" : ""}`} href={`?${new URLSearchParams({ ...(sale ? { sale } : {}), ...(isNew ? { isNew } : {}), ...(stock ? { stock } : {}), page: String(pageNum + 1) }).toString()}`}>Next</Link>
        </div>
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { ProductCreateFormClient } from "@/components/admin/product-create-form-client"

export default async function AdminNewProductPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true })
  const sp = await searchParams
  const error = sp?.error

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Add Product</h1>
      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}
      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">Details</div>
        <ProductCreateFormClient
          actionUrl="/api/admin/products"
          categories={(categories || []).map((c: any) => ({ id: String(c.id), name: String(c.name) }))}
        />
      </div>
    </div>
  )
}

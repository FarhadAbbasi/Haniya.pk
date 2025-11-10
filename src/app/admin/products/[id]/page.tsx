import { createClient } from "@/lib/supabase/server"
import { VariantTableClient } from "@/components/admin/variant-table-client"

export default async function AdminProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()
  const { data: product } = await supabase
    .from("products")
    .select("id, title, price, currency, is_sale, is_new")
    .eq("id", id)
    .maybeSingle()

  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, size, color, sku, price, stock, is_active")
    .eq("product_id", id)
    .order("size", { ascending: true })

  if (!product) {
    return <div className="text-sm text-neutral-500">Product not found.</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{product.title}</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Variants</div>
            <VariantTableClient variants={(variants as any[])?.map(v => ({
              id: v.id,
              size: v.size,
              color: v.color,
              sku: v.sku,
              price: typeof v.price === "number" ? v.price : null,
              stock: Number(v.stock || 0),
              is_active: !!v.is_active,
            })) || []} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Summary</div>
            <div className="p-3 text-sm">
              <div className="flex justify-between"><span>Price</span><span>Rs. {Number(product.price).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Currency</span><span>{product.currency}</span></div>
              <div className="flex justify-between"><span>Sale</span><span>{product.is_sale ? "Yes" : "No"}</span></div>
              <div className="flex justify-between"><span>New</span><span>{product.is_new ? "Yes" : "No"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

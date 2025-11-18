import { createClient } from "@/lib/supabase/server"
import { VariantTableClient } from "@/components/admin/variant-table-client"
import { SavedToast } from "@/components/admin/saved-toast"
import { CategoryFormClient } from "@/components/admin/category-form-client"
import { ProductDetailsFormClient } from "@/components/admin/product-details-form-client"
import { DeleteProductFormClient } from "@/components/admin/delete-product-form-client"
import { AddVariantFormClient } from "@/components/admin/add-variant-form-client"

export default async function AdminProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()
  const { data: product } = await supabase
    .from("products")
    .select("id, title, price, compare_at_price, currency, is_sale, is_new, category_id, fabric, description")
    .eq("id", id)
    .maybeSingle()

  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, size, color, sku, stock")
    .eq("product_id", id)
    .order("size", { ascending: true })

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true })

  const { data: images } = await supabase
    .from("product_images")
    .select("url, sort")
    .eq("product_id", id)
    .order("sort", { ascending: true })

  if (!product) {
    return <div className="text-sm text-neutral-500">Product not found.</div>
  }

  return (
    <div className="space-y-4">
      <SavedToast />
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
              stock: Number(v.stock || 0),
              is_active: true,
            })) || []} />
          </div>
          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Add Variant</div>
            <AddVariantFormClient actionUrl={`/api/admin/products/${product.id}/variants`} productId={product.id} />
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

          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Details</div>
            <ProductDetailsFormClient
              actionUrl={`/api/admin/products/${product.id}`}
              initial={{ title: product.title, price: product.price, compare_at_price: product.compare_at_price, currency: product.currency, is_sale: product.is_sale, is_new: product.is_new, fabric: product.fabric, description: product.description, images: (images || []).map((im: any) => String(im.url)) }}
            />
          </div>

          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Category</div>
            <div className="p-3 text-sm">
              <CategoryFormClient
                actionUrl={`/api/admin/products/${product.id}/category`}
                defaultCategoryId={product.category_id || ""}
                options={(categories || []).map((c: any) => ({ id: String(c.id), name: String(c.name) }))}
              />
            </div>
          </div>


          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Danger Zone</div>
            <DeleteProductFormClient actionUrl={`/api/admin/products/${product.id}`} />
          </div>

        </div>
      </div>
    </div>
  )
}

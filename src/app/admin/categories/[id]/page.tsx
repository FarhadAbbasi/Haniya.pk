import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DeleteCategoryClient } from "@/components/admin/category-manage-form-client"

export default async function AdminCategoryManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, featured_image_url, featured_image_id")
    .eq("id", id)
    .maybeSingle()

  if (!category) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-neutral-500">Category not found</div>
        <Link className="text-sm underline" href="/admin/categories">Back to Categories</Link>
      </div>
    )
  }

  // Fetch products in this category with first image
  const { data: products } = await supabase
    .from("products")
    .select("id, title")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })

  let firstImages = new Map<string, { id: string; url: string } | undefined>()
  if (products && products.length) {
    const ids = products.map((p: any) => p.id)
    const { data: images } = await supabase
      .from("product_images")
      .select("id, product_id, url, sort")
      .in("product_id", ids)
      .order("sort", { ascending: true })
    for (const im of images || []) {
      const pid = String((im as any).product_id)
      if (!firstImages.has(pid)) firstImages.set(pid, { id: String((im as any).id), url: String((im as any).url) })
    }
  }

  const pickables = (products || []).map((p: any) => {
    const im = firstImages.get(String(p.id))
    return { id: String(p.id), title: String(p.title), imageId: im?.id, image: im?.url }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Category</h1>
          <div className="text-xs text-neutral-500">/{category.slug}</div>
        </div>
        <Link href="/admin/categories" className="text-sm underline">Back</Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">Details</div>
        <form action={`/api/admin/categories/${category.id}`} method="post" className="p-3 space-y-3">
          <input type="hidden" name="_method" value="PATCH" />
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block">Name</label>
              <input name="name" defaultValue={category.name} className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block">Slug</label>
              <input name="slug" defaultValue={category.slug} className="w-full rounded border px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Featured image</label>
            {pickables.length === 0 ? (
              <div className="text-xs text-neutral-500">No products in this category yet.</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {pickables.map((p) => (
                  <label key={p.id} className="group relative block cursor-pointer overflow-hidden rounded border bg-white">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="aspect-[3/4] w-full object-cover" />
                    ) : (
                      <div className="aspect-[3/4] w-full bg-neutral-100" />
                    )}
                    <input type="radio" name="featured_image_id" value={p.imageId || ''} defaultChecked={!!category.featured_image_id && category.featured_image_id === p.imageId} className="absolute left-2 top-2 h-4 w-4" />
                    <div className="p-2 text-xs">{p.title}</div>
                  </label>
                ))}
              </div>
            )}
            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium">Or paste custom image URL</label>
              <input name="featured_image_url" defaultValue={category.featured_image_url || ''} className="w-full rounded border px-3 py-2" placeholder="https://..." />
            </div>
          </div>

          <div>
            <button className="rounded bg-black px-3 py-2 text-xs font-medium text-white">Save Changes</button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">Danger</div>
        <div className="p-3">
          <DeleteCategoryClient action={`/api/admin/categories/${category.id}`} />
        </div>
      </div>
    </div>
  )
}

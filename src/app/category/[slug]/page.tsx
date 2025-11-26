import Link from "next/link"
export const revalidate = 60
import { createClient } from "@/lib/supabase/server"

interface Props { params: Promise<{ slug: string }> }

export default async function CategoryPage({ params }: Props) {
  const supabase = createClient()
  const { slug } = await params

  let { data: category } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle()

  // If unknown category
  if (!category) {
    // Fallback: case-insensitive/approximate slug match
    const { data: approx } = await supabase
      .from("categories")
      .select("id, name, slug")
      .ilike("slug", `%${slug}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (approx) category = approx
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <span className="capitalize">{slug}</span>
        </div>
        <h1 className="mb-4 text-3xl font-semibold capitalize tracking-tight">{slug}</h1>
        <p className="text-muted-foreground">Category not found.</p>
      </div>
    )
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, title, price, compare_at_price, currency, is_sale")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })

  const ids = (products || []).map((p: any) => p.id)
  let imagesByProduct = new Map<string, string | undefined>()
  if (ids.length) {
    const { data: images } = await supabase
      .from("product_images")
      .select("product_id, url, sort")
      .in("product_id", ids)
      .order("sort", { ascending: true })
    for (const im of images || []) {
      const pid = String((im as any).product_id)
      if (!imagesByProduct.has(pid)) imagesByProduct.set(pid, String((im as any).url))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{category.name}</span>
      </div>
      <h1 className="mb-6 text-3xl font-semibold capitalize tracking-tight">{category.name}</h1>

      {(!products || products.length === 0) ? (
        <p className="text-muted-foreground">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {products!.map((p: any) => {
            const image = imagesByProduct.get(String(p.id))
            return (
              <Link key={p.id} href={`/p/${p.slug}`} className="group relative overflow-hidden rounded-lg border bg-white">
                {image ? (
                  <img src={image} alt={p.title} className="aspect-[3/4] w-full object-cover" />
                ) : (
                  <div className="aspect-[3/4] w-full bg-muted" />
                )}
                {p.is_sale ? (
                  <div className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold uppercase text-white shadow">Sale</div>
                ) : null}
                <div className="p-3">
                  <div className="line-clamp-2 text-sm font-medium">{p.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="font-semibold">{p.currency} {Number(p.price).toLocaleString()}</span>
                    {p.compare_at_price ? (
                      <span className="text-xs text-muted-foreground line-through">{p.currency} {Number(p.compare_at_price).toLocaleString()}</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"

export type DbProduct = {
  id: string
  slug: string
  title: string
  price: number
  currency: string
  category_id: string | null
}

export async function getProductByTitleLike(titleLike: string) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from("products")
    .select("id, slug, title, price, currency")
    .ilike("title", `%${titleLike}%`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!product) return null
  const { data: images } = await supabase
    .from("product_images")
    .select("url, sort")
    .eq("product_id", product.id)
    .order("sort", { ascending: true })
  return { ...(product as DbProduct), images: (images as DbImage[]) || [] }
}

export type DbImage = {
  url: string
  sort: number
}

export async function getProductsByCategorySlug(
  slug: string,
  opts: { min?: number; max?: number; q?: string } = {}
) {
  const supabase = createClient()
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()
  if (!cat) return []

  let query = supabase
    .from("products")
    .select("id, slug, title, price, currency")
    .eq("category_id", cat.id)
    .order("created_at", { ascending: false })

  const minOk = typeof opts.min === "number" && Number.isFinite(opts.min)
  const maxOk = typeof opts.max === "number" && Number.isFinite(opts.max)
  if (minOk) query = query.gte("price", opts.min as number)
  if (maxOk) query = query.lte("price", opts.max as number)
  if (opts.q && opts.q.trim()) query = query.ilike("title", `%${opts.q.trim()}%`)

  const { data: products } = await query
  if (!products) return []
  // Fallback client-side filter in case server-side price filters are not applied due to type casting
  const filtered = products.filter((p) => {
    const priceNum = typeof (p as any).price === "number" ? (p as any).price : Number((p as any).price)
    if (minOk && priceNum < (opts.min as number)) return false
    if (maxOk && priceNum > (opts.max as number)) return false
    return true
  })

  const ids = filtered.map((p) => p.id)
  const { data: images } = await supabase
    .from("product_images")
    .select("product_id, url, sort")
    .in("product_id", ids)
    .order("sort", { ascending: true })

  const byFirstImage = new Map<string, string | undefined>()
  if (images) {
    for (const img of images) {
      if (!byFirstImage.has((img as any).product_id)) {
        byFirstImage.set((img as any).product_id, img.url)
      }
    }
  }

  return (filtered as DbProduct[]).map((p) => ({ ...p, image: byFirstImage.get(p.id) })) as Array<DbProduct & { image?: string }>
}

export async function getProductBySlug(slug: string) {
  const supabase = createClient()
  let { data: product } = await supabase
    .from("products")
    .select("id, slug, title, price, currency")
    .eq("slug", slug)
    .maybeSingle()
  if (!product) {
    // Fallback: try ilike match on slug
    const { data: approx } = await supabase
      .from("products")
      .select("id, slug, title, price, currency")
      .ilike("slug", `%${slug}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!approx) return null
    product = approx
  }

  const { data: images } = await supabase
    .from("product_images")
    .select("url, sort")
    .eq("product_id", product.id)
    .order("sort", { ascending: true })

  return { ...(product as DbProduct), images: (images as DbImage[]) || [] }
}

export async function getProductById(id: string) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from("products")
    .select("id, slug, title, price, currency")
    .eq("id", id)
    .maybeSingle()
  if (!product) return null

  const { data: images } = await supabase
    .from("product_images")
    .select("url, sort")
    .eq("product_id", product.id)
    .order("sort", { ascending: true })

  return { ...(product as DbProduct), images: (images as DbImage[]) || [] }
}

async function attachFirstImages(products: any[]) {
  const supabase = createClient()
  const ids = products.map((p) => p.id)
  const { data: images } = await supabase
    .from("product_images")
    .select("product_id, url, sort")
    .in("product_id", ids)
    .order("sort", { ascending: true })
  const byFirstImage = new Map<string, string | undefined>()
  if (images) {
    for (const img of images) {
      const pid = (img as any).product_id as string
      if (!byFirstImage.has(pid)) byFirstImage.set(pid, img.url)
    }
  }
  return products.map((p) => ({ ...p, image: byFirstImage.get(p.id) }))
}

export async function getNewProducts(opts: { min?: number; max?: number } = {}) {
  const supabase = createClient()
  let q = supabase
    .from("products")
    .select("id, slug, title, price, currency")
    .eq("is_new", true)
    .order("created_at", { ascending: false })
  const minOk = typeof opts.min === "number" && Number.isFinite(opts.min)
  const maxOk = typeof opts.max === "number" && Number.isFinite(opts.max)
  if (minOk) q = q.gte("price", opts.min as number)
  if (maxOk) q = q.lte("price", opts.max as number)
  const { data } = await q
  if (!data) return []
  return attachFirstImages(data)
}

export async function getSaleProducts(opts: { min?: number; max?: number } = {}) {
  const supabase = createClient()
  let q = supabase
    .from("products")
    .select("id, slug, title, price, currency")
    .eq("is_sale", true)
    .order("created_at", { ascending: false })
  const minOk = typeof opts.min === "number" && Number.isFinite(opts.min)
  const maxOk = typeof opts.max === "number" && Number.isFinite(opts.max)
  if (minOk) q = q.gte("price", opts.min as number)
  if (maxOk) q = q.lte("price", opts.max as number)
  const { data } = await q
  if (!data) return []
  return attachFirstImages(data)
}

export async function getLatestProducts(limit = 4) {
  const supabase = createClient()
  const { data } = await supabase
    .from("products")
    .select("id, slug, title, price, currency")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (!data) return []
  return attachFirstImages(data)
}

export async function getCategoryLead(slug: string) {
  const supabase = createClient()
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()
  if (!cat) return null
  const { data } = await supabase
    .from("products")
    .select("id, slug, title, price, currency")
    .eq("category_id", cat.id)
    .order("created_at", { ascending: false })
    .limit(1)
  if (!data || data.length === 0) return null
  const [p] = await attachFirstImages(data)
  return p
}

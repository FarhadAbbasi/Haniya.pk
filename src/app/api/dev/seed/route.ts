import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// WARNING: Dev-only seed endpoint. Remove or protect before production.
async function seed() {
  const supabase = createClient()

  // Categories
  const categories = [
    { slug: "printed-lawn", name: "Printed Lawn" },
    { slug: "printed-winter", name: "Printed Winter" },
    { slug: "embroidery-lawn", name: "Embroidery Lawn" },
    { slug: "embroidery-winter", name: "Embroidery Winter" },
    { slug: "new", name: "New Arrivals" },
    { slug: "sale", name: "Sale" },
  ]

  for (const c of categories) {
    await supabase.from("categories").upsert(c, { onConflict: "slug" })
  }

  const { data: cats } = await supabase.from("categories").select("id, slug")
  if (!cats) return NextResponse.json({ error: "no categories" }, { status: 500 })
  const bySlug = new Map(cats.map((c) => [c.slug, c.id as string]))

  const now = Date.now()
  const products = [
    { slug: "printed-lawn-1", title: "Printed Lawn 2pc", price: 3990, category: "printed-lawn", is_new: true },
    { slug: "printed-lawn-2", title: "Printed Lawn 3pc", price: 4990, category: "printed-lawn" },
    { slug: "printed-winter-1", title: "Printed Winter 2pc", price: 4490, category: "printed-winter" },
    { slug: "printed-winter-2", title: "Printed Winter 3pc", price: 5690, category: "printed-winter" },
    { slug: "embroidery-lawn-1", title: "Embroidered Lawn 3pc", price: 6990, category: "embroidery-lawn", is_new: true },
    { slug: "embroidery-winter-1", title: "Embroidered Winter 3pc", price: 8490, category: "embroidery-winter" },
  ]

  for (const p of products) {
    await supabase.from("products").upsert(
      {
        slug: p.slug,
        title: p.title,
        price: p.price,
        currency: "PKR",
        category_id: bySlug.get(p.category) || null,
        is_new: !!p.is_new,
        is_sale: false,
        created_at: new Date(now - Math.floor(Math.random() * 1_000_000)).toISOString(),
      },
      { onConflict: "slug" }
    )
  }

  // Attach 1 placeholder image each
  const { data: prods } = await supabase.from("products").select("id, slug")
  if (prods) {
    for (const pr of prods) {
      await supabase.from("product_images").upsert(
        { product_id: pr.id, url: "https://waniya.pk/cdn/shop/files/waniya_0001_DSC09991copy_0027_DSC01662copy.jpg?v=1758976042&width=360", sort: 0 },
        { onConflict: "product_id,sort" }
      )
    }
  }

  return NextResponse.json({ ok: true })
}

export async function POST(_req: NextRequest) {
  return seed()
}

export async function GET() {
  return seed()
}

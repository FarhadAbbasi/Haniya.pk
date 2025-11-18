import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

export async function POST(req: Request) {
  const res = new NextResponse()
  try {
    const supabase = await createRouteClient(res)
    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("email", user.email)
      .maybeSingle()
    if (!adminRow) return NextResponse.json({ error: "forbidden" }, { status: 403 })

    const bodyText = await req.text()
    const params = new URLSearchParams(bodyText)

    const title = (params.get("title") || "").trim()
    const priceVal = params.get("price")
    const currency = (params.get("currency") || "PKR").trim()
    const is_sale = params.get("is_sale") === "on"
    const is_new = params.get("is_new") === "on"
    const category_id = (params.get("category_id") || "").trim() || null
    const price = priceVal != null && priceVal !== "" ? Number(priceVal) : null
    const compareAtVal = params.get("compare_at_price")
    const compare_at_price = compareAtVal != null && compareAtVal !== "" ? Number(compareAtVal) : null
    const rawFabric = (params.get("fabric") || "").trim().toLowerCase()
    const allowedFabric = new Set(["lawn", "khaddar", "cotton", "other", ""]) // empty means null
    if (!allowedFabric.has(rawFabric)) {
      const reqUrl = new URL(req.url)
      const backNew = new URL(`/admin/products/new`, reqUrl.origin)
      backNew.searchParams.set("error", "Invalid fabric. Choose Lawn, Khaddar, Cotton or Other.")
      const redirectRes = NextResponse.redirect(backNew)
      const setCookies = res.headers.getSetCookie?.() || []
      for (const c of setCookies) redirectRes.headers.append("Set-Cookie", c)
      return redirectRes
    }
    const fabric = rawFabric ? rawFabric : null
    const description = (params.get("description") || "").trim() || null

    if (!title) return NextResponse.json({ error: "title required" }, { status: 400 })

    // Build unique slug
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 80)
    let slug = base || `product-${Date.now()}`
    for (let i = 0; i < 50; i++) {
      const candidate = i === 0 ? slug : `${base}-${i}`
      const { data: exists } = await supabase.from("products").select("id").eq("slug", candidate).limit(1)
      if (!exists || exists.length === 0) { slug = candidate; break }
    }

    const { data: inserted, error } = await supabase
      .from("products")
      .insert({ title, price, compare_at_price, currency, is_sale, is_new, category_id, slug, fabric, description })
      .select("id")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Handle optional images image1..image6
    const imgs: Array<{ url: string; sort: number; product_id: string }> = []
    for (let i = 1; i <= 6; i++) {
      const key = `image${i}`
      const url = (params.get(key) || "").trim()
      if (url) imgs.push({ url, sort: i, product_id: String(inserted!.id) })
    }
    if (imgs.length) {
      await supabase.from("product_images").insert(imgs)
    }

    // Insert default variants S, M, L with stock 1
    const sizes = ["S", "M", "L"]
    const variants = sizes.map((size) => ({ product_id: String(inserted!.id), size, stock: 1, price }))
    await supabase.from("product_variants").insert(variants)

    const reqUrl = new URL(req.url)
    const backUrl = new URL(`/admin/products/${inserted!.id}`, reqUrl.origin)
    backUrl.searchParams.set("saved", "1")
    const redirectRes = NextResponse.redirect(backUrl)
    // carry over cookies to redirect
    const setCookies = res.headers.getSetCookie?.() || []
    for (const c of setCookies) redirectRes.headers.append("Set-Cookie", c)
    return redirectRes
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

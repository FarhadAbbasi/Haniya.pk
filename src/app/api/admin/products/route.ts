import { NextResponse } from "next/server"
export const runtime = "nodejs"
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

    const contentType = req.headers.get("content-type") || ""
    const isMultipart = contentType.includes("multipart/form-data")
    let params: URLSearchParams | null = null
    let form: FormData | null = null
    if (isMultipart) {
      form = await req.formData()
    } else {
      const bodyText = await req.text()
      params = new URLSearchParams(bodyText)
    }

    const getVal = (key: string) => (form ? String(form.get(key) || "") : String(params!.get(key) || ""))
    const title = getVal("title").trim()
    const priceVal = getVal("price") || null
    const currency = (getVal("currency") || "PKR").trim()
    const is_sale = getVal("is_sale") === "on"
    const is_new = getVal("is_new") === "on"
    const category_id = (getVal("category_id") || "").trim() || null
    const price = priceVal != null && priceVal !== "" ? Number(priceVal) : null
    const compareAtVal = getVal("compare_at_price")
    const compare_at_price = compareAtVal != null && compareAtVal !== "" ? Number(compareAtVal) : null
    const rawFabric = (getVal("fabric") || "").trim().toLowerCase()
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
    const description = (getVal("description") || "").trim() || null

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

    // Handle optional images via file uploads or URLs
    const bucket = "product-images"
    const uploaded: Array<{ url: string; sort: number; product_id: string }> = []
    for (let i = 1; i <= 6; i++) {
      const fileKey = `file${i}`
      const urlKey = `image${i}`
      const maybeFile = form ? form.get(fileKey) : null
      let publicUrl: string | null = null
      if (maybeFile && maybeFile instanceof File && maybeFile.size > 0) {
        const file = maybeFile as File
        const ext = file.name.split('.').pop() || 'jpg'
        const path = `product/${String(inserted!.id)}/${i}-${Date.now()}.${ext}`
        const { error: upErr } = await (supabase as any).storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || 'image/jpeg' })
        if (!upErr) {
          const { data: pub } = (supabase as any).storage.from(bucket).getPublicUrl(path)
          publicUrl = pub?.publicUrl || null
        }
      }
      if (!publicUrl) {
        const url = (form ? String(form.get(urlKey) || "") : String(params!.get(urlKey) || "")).trim()
        if (url) publicUrl = url
      }
      if (publicUrl) uploaded.push({ url: publicUrl, sort: i, product_id: String(inserted!.id) })
    }
    if (uploaded.length) {
      await supabase.from("product_images").insert(uploaded)
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

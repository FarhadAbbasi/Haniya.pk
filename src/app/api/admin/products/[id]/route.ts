import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"
export const runtime = "nodejs"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const reqUrl = new URL(req.url)
  const backUrl = new URL(`/admin/products/${id}`, reqUrl.origin)
  backUrl.searchParams.set("saved", "1")
  const signInUrl = new URL(`/signin`, reqUrl.origin)
  const redirectRes = NextResponse.redirect(backUrl)
  try {
    const supabase = await createRouteClient(redirectRes)
    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user?.email) return NextResponse.redirect(signInUrl)

    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("email", user.email)
      .maybeSingle()
    if (!adminRow) return NextResponse.redirect(signInUrl)

    const contentType = req.headers.get("content-type") || ""
    const isMultipart = contentType.includes("multipart/form-data")
    let paramsBody: URLSearchParams | null = null
    let form: FormData | null = null
    if (isMultipart) {
      form = await req.formData()
    } else {
      const bodyText = await req.text()
      paramsBody = new URLSearchParams(bodyText)
    }
    const getVal = (k: string) => (form ? String(form.get(k) || "") : String(paramsBody!.get(k) || ""))
    const method = (getVal("_method") || "").toUpperCase()

    if (method === "DELETE") {
      const del = await supabase.from("products").delete().eq("id", id)
      if (!del.error) return NextResponse.redirect(new URL(`/admin/products`, reqUrl.origin))
      return redirectRes
    }

    const title = getVal("title").trim()
    const priceVal = getVal("price")
    const currency = (getVal("currency") || "PKR").trim()
    const is_sale = getVal("is_sale") === "on"
    const is_new = getVal("is_new") === "on"
    const price = priceVal != null && priceVal !== "" ? Number(priceVal) : null
    const compareAtVal = getVal("compare_at_price")
    const compare_at_price = compareAtVal != null && compareAtVal !== "" ? Number(compareAtVal) : null
    const fabric = (getVal("fabric") || "").trim() || null
    const description = (getVal("description") || "").trim() || null

    await supabase
      .from("products")
      .update({ title, price, compare_at_price, currency, is_sale, is_new, fabric, description })
      .eq("id", id)

    // Images: replace existing with uploaded files or provided URLs
    const bucket = "product-images"
    const imgs: Array<{ url: string; sort: number; product_id: string }> = []
    for (let i = 1; i <= 6; i++) {
      const fileKey = `file${i}`
      const urlKey = `image${i}`
      let publicUrl: string | null = null
      const maybeFile = form ? form.get(fileKey) : null
      if (maybeFile && maybeFile instanceof File && maybeFile.size > 0) {
        const file = maybeFile as File
        const ext = file.name.split('.').pop() || 'jpg'
        const path = `product/${String(id)}/${i}-${Date.now()}.${ext}`
        const { error: upErr } = await (supabase as any).storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || 'image/jpeg' })
        if (!upErr) {
          const { data: pub } = (supabase as any).storage.from(bucket).getPublicUrl(path)
          publicUrl = pub?.publicUrl || null
        }
      }
      if (!publicUrl) {
        const url = (form ? String(form.get(urlKey) || "") : String(paramsBody!.get(urlKey) || "")).trim()
        if (url) publicUrl = url
      }
      if (publicUrl) imgs.push({ url: publicUrl, sort: i, product_id: String(id) })
    }
    await supabase.from("product_images").delete().eq("product_id", id)
    if (imgs.length) await supabase.from("product_images").insert(imgs)

    return redirectRes
  } catch {
    return redirectRes
  }
}

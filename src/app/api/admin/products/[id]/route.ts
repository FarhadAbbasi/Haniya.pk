import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

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

    const bodyText = await req.text()
    const paramsBody = new URLSearchParams(bodyText)
    const method = (paramsBody.get("_method") || "").toUpperCase()

    if (method === "DELETE") {
      const del = await supabase.from("products").delete().eq("id", id)
      if (!del.error) return NextResponse.redirect(new URL(`/admin/products`, reqUrl.origin))
      return redirectRes
    }

    const title = (paramsBody.get("title") || "").trim()
    const priceVal = paramsBody.get("price")
    const currency = (paramsBody.get("currency") || "PKR").trim()
    const is_sale = paramsBody.get("is_sale") === "on"
    const is_new = paramsBody.get("is_new") === "on"
    const price = priceVal != null && priceVal !== "" ? Number(priceVal) : null
    const compareAtVal = paramsBody.get("compare_at_price")
    const compare_at_price = compareAtVal != null && compareAtVal !== "" ? Number(compareAtVal) : null
    const fabric = (paramsBody.get("fabric") || "").trim() || null
    const description = (paramsBody.get("description") || "").trim() || null

    await supabase
      .from("products")
      .update({ title, price, compare_at_price, currency, is_sale, is_new, fabric, description })
      .eq("id", id)

    // Images: replace existing with supplied image1..image6
    const imgs: Array<{ url: string; sort: number; product_id: string }> = []
    for (let i = 1; i <= 6; i++) {
      const key = `image${i}`
      const url = (paramsBody.get(key) || "").trim()
      if (url) imgs.push({ url, sort: i, product_id: String(id) })
    }
    // Delete old and insert new (if provided)
    await supabase.from("product_images").delete().eq("product_id", id)
    if (imgs.length) await supabase.from("product_images").insert(imgs)

    return redirectRes
  } catch {
    return redirectRes
  }
}

import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const idsParam = url.searchParams.get("ids") || ""
  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean)
  if (!ids.length) return NextResponse.json({ items: [] })

  const res = new NextResponse()
  const supabase = await createRouteClient(res)

  const { data } = await supabase
    .from("products")
    .select("id, slug, title, price, compare_at_price, currency")
    .in("id", ids)

  const items = (data as any[]) || []

  const { data: images } = await supabase
    .from("product_images")
    .select("product_id, url, sort")
    .in("product_id", ids)
    .order("sort", { ascending: true })

  const firstImage = new Map<string, string | undefined>()
  for (const img of (images as any[]) || []) {
    const pid = String((img as any).product_id)
    if (!firstImage.has(pid)) firstImage.set(pid, (img as any).url)
  }

  // preserve order as requested
  const byId = new Map(items.map((p) => [String((p as any).id), { ...p, image: firstImage.get(String((p as any).id)) }]))
  const ordered = ids.map((i) => byId.get(i)).filter(Boolean)

  const resp = NextResponse.json({ items: ordered })
  const setCookies = res.headers.getSetCookie?.()
  if (setCookies && setCookies.length) {
    for (const c of setCookies) resp.headers.append("Set-Cookie", c)
  }
  return resp
}

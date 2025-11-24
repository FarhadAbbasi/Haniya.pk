import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

export async function GET() {
  const res = new NextResponse()
  const supabase = await createRouteClient(res)

  const { data: prods } = await supabase
    .from("products")
    .select("id, slug, title, price, compare_at_price, currency")
    .order("created_at", { ascending: false })
    .limit(1)

  const p = (prods || [])[0]
  if (!p) return NextResponse.json({ item: null })

  const { data: imgs } = await supabase
    .from("product_images")
    .select("product_id, url, sort")
    .eq("product_id", (p as any).id)
    .order("sort", { ascending: true })

  const image = (imgs && imgs[0]) ? (imgs[0] as any).url : undefined

  const body = { item: { ...p, image } }
  const resp = NextResponse.json(body)
  const setCookies = res.headers.getSetCookie?.()
  if (setCookies && setCookies.length) for (const c of setCookies) resp.headers.append("Set-Cookie", c)
  return resp
}

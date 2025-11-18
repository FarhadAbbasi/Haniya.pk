import { NextResponse, NextRequest } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
    const paramsBody = new URLSearchParams(bodyText)
    const size = (paramsBody.get("size") || "").trim()
    const color = (paramsBody.get("color") || "").trim() || null
    const sku = (paramsBody.get("sku") || "").trim() || null
    const stockVal = paramsBody.get("stock")
    const stock = stockVal ? Number(stockVal) : 0
    const formPid = (paramsBody.get("product_id") || "").trim()
    const pid = formPid || id

    if (!size || !pid) {
      const reqUrl = new URL(req.url)
      const backUrl = new URL(`/admin/products/${pid || id}`, reqUrl.origin)
      backUrl.searchParams.set("error", !size ? "Size is required" : "Missing product id")
      const redirectRes = NextResponse.redirect(backUrl)
      const setCookies = res.headers.getSetCookie?.() || []
      for (const c of setCookies) redirectRes.headers.append("Set-Cookie", c)
      return redirectRes
    }

    const { error } = await supabase.from("product_variants").insert({ product_id: pid, size, color, sku, stock })
    const reqUrl = new URL(req.url)
    const backUrl = new URL(`/admin/products/${pid}`, reqUrl.origin)
    if (error) {
      backUrl.searchParams.set("error", error.message)
    } else {
      backUrl.searchParams.set("saved", "1")
    }
    const redirectRes = NextResponse.redirect(backUrl)
    const setCookies = res.headers.getSetCookie?.() || []
    for (const c of setCookies) redirectRes.headers.append("Set-Cookie", c)
    return redirectRes
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

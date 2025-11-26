import { NextResponse } from "next/server"
import { createRouteClient, jsonWithCookies } from "@/lib/supabase/route"

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

    const formOrJson = await req.clone().text()
    let name = ""
    let slug = ""
    try {
      const asJson = JSON.parse(formOrJson)
      name = String(asJson.name || "").trim()
      slug = String(asJson.slug || "").trim()
    } catch {
      const params = new URLSearchParams(formOrJson)
      name = String(params.get("name") || "").trim()
      slug = String(params.get("slug") || "").trim()
    }

    if (!name || !slug) return jsonWithCookies(res, { error: "missing fields" }, { status: 400 })

    const { error } = await supabase.from("categories").insert({ name, slug })
    if (error) return jsonWithCookies(res, { error: error.message }, { status: 500 })

    // If this was a form post, redirect back to admin/categories; otherwise JSON
    const ctype = req.headers.get("content-type") || ""
    if (ctype.includes("application/x-www-form-urlencoded") || ctype.includes("multipart/form-data")) {
      const reqUrl = new URL(req.url)
      const back = new URL("/admin/categories", reqUrl.origin)
      const redirectRes = NextResponse.redirect(back)
      const setCookies = res.headers.getSetCookie?.() || []
      for (const c of setCookies) redirectRes.headers.append("Set-Cookie", c)
      return redirectRes
    }
    return jsonWithCookies(res, { ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

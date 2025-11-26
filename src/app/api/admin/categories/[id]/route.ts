import { NextResponse } from "next/server"
import { createRouteClient, jsonWithCookies } from "@/lib/supabase/route"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const res = new NextResponse()
  try {
    const { id } = await params
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
    const method = (paramsBody.get("_method") || "").toUpperCase()

    if (method === "DELETE") {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) return jsonWithCookies(res, { error: error.message }, { status: 500 })
      const reqUrl = new URL(req.url)
      const back = new URL("/admin/categories", reqUrl.origin)
      const redirectRes = NextResponse.redirect(back)
      const setCookies = res.headers.getSetCookie?.() || []
      for (const c of setCookies) redirectRes.headers.append("Set-Cookie", c)
      return redirectRes
    }
    if (method === "PATCH") {
      const update: any = {}
      // Only include each field if the form actually sent that key
      if (paramsBody.has("name")) {
        const name = String(paramsBody.get("name") || "").trim()
        if (name.length) update.name = name
      }
      if (paramsBody.has("slug")) {
        const slug = String(paramsBody.get("slug") || "").trim()
        if (slug.length) update.slug = slug
      }
      // Checkbox only posts when checked; use a presence flag to know if the field was on the form
      if (paramsBody.has("is_featured_present")) {
        update.is_featured = paramsBody.get("is_featured") === "on"
      }
      if (paramsBody.has("position")) {
        const positionRaw = paramsBody.get("position")
        update.position = positionRaw && String(positionRaw).length ? Number(positionRaw) : null
      }
      if (paramsBody.has("featured_image_id")) {
        const s = String(paramsBody.get("featured_image_id") || "").trim()
        update.featured_image_id = s.length ? s : null
      }
      if (paramsBody.has("featured_image_url")) {
        const su = String(paramsBody.get("featured_image_url") || "").trim()
        update.featured_image_url = su.length ? su : null
      }
      const { error } = await supabase.from("categories").update(update).eq("id", id)
      if (error) return jsonWithCookies(res, { error: error.message }, { status: 500 })
      const reqUrl = new URL(req.url)
      const back = new URL("/admin/categories", reqUrl.origin)
      const redirectRes = NextResponse.redirect(back)
      const setCookies = res.headers.getSetCookie?.() || []
      for (const c of setCookies) redirectRes.headers.append("Set-Cookie", c)
      return redirectRes
    }

    return jsonWithCookies(res, { error: "unsupported" }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const res = new NextResponse()
  try {
    const { id } = await ctx.params
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

    const { error } = await supabase.from("categories").delete().eq("id", id)
    if (error) return jsonWithCookies(res, { error: error.message }, { status: 500 })
    const reqUrl = new URL(req.url)
    const back = new URL("/admin/categories", reqUrl.origin)
    const redirectRes = NextResponse.redirect(back)
    const setCookies = res.headers.getSetCookie?.() || []
    for (const c of setCookies) redirectRes.headers.append("Set-Cookie", c)
    return redirectRes
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

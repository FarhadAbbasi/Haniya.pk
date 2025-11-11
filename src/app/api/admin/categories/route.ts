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

    return jsonWithCookies(res, { ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

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
      return jsonWithCookies(res, { ok: true })
    }

    return jsonWithCookies(res, { error: "unsupported" }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
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
    return jsonWithCookies(res, { ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

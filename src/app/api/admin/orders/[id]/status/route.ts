import { NextResponse } from "next/server"
import { createRouteClient, jsonWithCookies } from "@/lib/supabase/route"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = new NextResponse()
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

    const body = await req.json()
    const status = String(body.status || "")
    const allowed = ["pending","confirmed","shipped","cancelled"]
    if (!allowed.includes(status)) return NextResponse.json({ error: "invalid status" }, { status: 400 })

    const { error } = await supabase.from("orders").update({ status }).eq("id", id)
    if (error) return jsonWithCookies(res, { error: error.message }, { status: 500 })

    return jsonWithCookies(res, { ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

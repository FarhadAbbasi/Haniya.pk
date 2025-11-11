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

    const body = await req.json()
    const entries: Array<{ key: string; value: string }> = []
    if (typeof body.shipping_rate === "number") entries.push({ key: "shipping_rate", value: String(body.shipping_rate) })
    if (typeof body.sender_email === "string") entries.push({ key: "sender_email", value: body.sender_email })
    if (typeof body.site_url === "string") entries.push({ key: "site_url", value: body.site_url })

    if (entries.length === 0) return jsonWithCookies(res, { ok: true })

    const { error } = await supabase.from("settings").upsert(entries, { onConflict: "key" })
    if (error) return jsonWithCookies(res, { error: error.message }, { status: 500 })

    return jsonWithCookies(res, { ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

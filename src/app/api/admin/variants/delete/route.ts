import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

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

    const body = await req.json().catch(() => ({})) as { variantId?: string }
    const variantId = (body.variantId || "").trim()
    if (!variantId) return NextResponse.json({ error: "variantId is required" }, { status: 400 })

    const { error } = await supabase.from("product_variants").delete().eq("id", variantId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

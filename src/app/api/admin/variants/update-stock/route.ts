import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    // Require admin role
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("email", user.email)
      .maybeSingle()
    if (!adminRow) return NextResponse.json({ error: "forbidden" }, { status: 403 })

    const body = await req.json()
    const variantId = String(body.variantId || "")
    const newStock = Number(body.stock)
    const reason = String(body.reason || "manual")
    if (!variantId || !Number.isFinite(newStock)) {
      return NextResponse.json({ error: "invalid input" }, { status: 400 })
    }

    // Fetch current stock
    const { data: variant } = await supabase
      .from("product_variants")
      .select("stock")
      .eq("id", variantId)
      .maybeSingle()
    if (!variant) return NextResponse.json({ error: "variant not found" }, { status: 404 })

    const oldStock = Number(variant.stock || 0)
    const delta = newStock - oldStock

    // Update stock
    const { error: upErr } = await supabase
      .from("product_variants")
      .update({ stock: newStock })
      .eq("id", variantId)
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

    // Log movement if any delta
    if (delta !== 0) {
      const { error: mvErr } = await supabase
        .from("stock_movements")
        .insert({ variant_id: variantId, delta, reason })
      if (mvErr) return NextResponse.json({ error: mvErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, delta })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

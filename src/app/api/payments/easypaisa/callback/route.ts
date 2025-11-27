import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const orderId = String(body?.orderId || "")
    const success = Boolean(body?.success)
    if (!orderId) return NextResponse.json({ error: "missing_orderId" }, { status: 400 })

    const supabase = createClient()

    // Update payment row for this order/provider
    const status = success ? "paid" : "failed"
    await supabase
      .from("payments")
      .update({ status })
      .eq("order_id", orderId)
      .eq("provider", "easypaisa")

    // Update order status
    if (success) {
      await supabase
        .from("orders")
        .update({ payment_status: "paid", status: "processing" })
        .eq("id", orderId)
    } else {
      await supabase
        .from("orders")
        .update({ payment_status: "unpaid" })
        .eq("id", orderId)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }
}

export async function GET() {
  // Allow simple GET pings for testing
  return NextResponse.json({ ok: true })
}

import { NextResponse } from "next/server"
import { createRouteClient, jsonWithCookies } from "@/lib/supabase/route"
import { sendOrderEmailSMTP } from "@/lib/email/smtp"
import { sendOrderConfirmationEmail } from "@/lib/email/resend"

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

    // Fetch order, items, and address
    const { data: order } = await supabase
      .from("orders")
      .select("id, total, currency")
      .eq("id", id)
      .maybeSingle()
    if (!order) return NextResponse.json({ error: "order not found" }, { status: 404 })

    const { data: addr } = await supabase
      .from("order_addresses")
      .select("name, email")
      .eq("order_id", id)
      .maybeSingle()
    if (!addr?.email) return NextResponse.json({ error: "no recipient email" }, { status: 400 })

    const { data: items } = await supabase
      .from("order_items")
      .select("title, qty, price")
      .eq("order_id", id)

    let emailSent = false
    try {
      const smtpRes = await sendOrderEmailSMTP({
        to: addr.email,
        orderId: id,
        name: addr.name || "Customer",
        items: (items || []).map((i: any) => ({ title: i.title || "Product", qty: Number(i.qty), price: Number(i.price) })),
        total: Number(order.total),
        shipping: { cost: 0, currency: order.currency || "PKR" },
      })
      if (smtpRes && (smtpRes as any).sent) emailSent = true
    } catch {}

    if (!emailSent) {
      try {
        const rs = await sendOrderConfirmationEmail({
          to: addr.email,
          orderId: id,
          name: addr.name || "Customer",
          items: (items || []).map((i: any) => ({ title: i.title || "Product", qty: Number(i.qty), price: Number(i.price) })),
          total: Number(order.total),
        })
        if (rs && (rs as any).id) emailSent = true
      } catch {}
    }

    await supabase.from("orders").update({ email_sent: emailSent }).eq("id", id)

    return jsonWithCookies(res, { ok: true, emailSent })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

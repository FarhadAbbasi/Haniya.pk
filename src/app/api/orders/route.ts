import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendOrderConfirmationEmail } from "@/lib/email/resend"
import { sendOrderEmailSMTP } from "@/lib/email/smtp"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      items,
      address, // { name, phone, email, city, line1 }
      shipping, // { cost, currency }
      currency = "PKR",
    } = body || {}

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 })
    }
    if (!address || !address.name || !address.phone || !address.city || !address.line1) {
      return NextResponse.json({ error: "Missing address fields" }, { status: 400 })
    }

    const subtotal = items.reduce((sum: number, it: any) => sum + Number(it.price) * Number(it.qty), 0)
    const shippingCost = Number(shipping?.cost || 0)
    const orderTotal = subtotal + shippingCost

    const supabase = createClient()

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        status: "pending",
        total: orderTotal,
        currency: currency,
        payment_status: "unpaid",
        shipping_cost: shippingCost,
      } as any)
      .select("id")
      .single()

    if (orderErr || !order) {
      return NextResponse.json({ error: orderErr?.message || "Could not create order" }, { status: 500 })
    }

    // Save address/contact for this order
    const { error: addrErr } = await supabase.from("order_addresses").insert({
      order_id: order.id,
      name: address.name,
      phone: address.phone,
      email: address.email ?? null,
      city: address.city,
      line1: address.line1,
    })
    if (addrErr) {
      return NextResponse.json({ error: addrErr.message }, { status: 500 })
    }

    // Detect variant FK column name (handles varient_id vs variant_id)
    let variantCol: "varient_id" | "variant_id" = "varient_id"
    try {
      const test = await supabase.from("order_items").select("varient_id").limit(1)
      if ((test as any).error) throw (test as any).error
      variantCol = "varient_id"
    } catch {
      variantCol = "variant_id"
    }

    const orderItems: any[] = []
    for (const it of items as any[]) {
      let varient_id: string | null = null
      const size = it.variant as string | undefined
      if (size) {
        const { data: vrow } = await supabase
          .from("product_variants")
          .select("id")
          .eq("product_id", it.id)
          .eq("size", size)
          .maybeSingle()
        if (vrow) varient_id = String((vrow as any).id)
      }
      orderItems.push({
        order_id: order.id,
        product_id: it.id,
        [variantCol]: varient_id,
        qty: Number(it.qty),
        price: Number(it.price),
        currency: currency,
      })
    }

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems)
    if (itemsErr) {
      return NextResponse.json({ error: itemsErr.message }, { status: 500 })
    }

    // Decrement variant stock if variant size provided
    try {
      for (const it of items as any[]) {
        const size = it.variant as string | undefined
        if (!size) continue
        const { data: variant } = await supabase
          .from("product_variants")
          .select("id, stock")
          .eq("product_id", it.id)
          .eq("size", size)
          .maybeSingle()
        if (!variant) continue
        const current = Number((variant as any).stock || 0)
        const qty = Number(it.qty || 0)
        const next = Math.max(0, current - qty)
        const { error: upErr } = await supabase
          .from("product_variants")
          .update({ stock: next })
          .eq("id", (variant as any).id)
        if (!upErr) {
          await supabase.from("stock_movements").insert({
            variant_id: (variant as any).id,
            delta: -qty,
            reason: "order_placed",
            order_id: (order as any).id,
          } as any)
        }
      }
    } catch {}

    // Create a payment row for COD (initiated)
    const { error: payErr } = await supabase.from("payments").insert({
      order_id: order.id,
      provider: "cod",
      amount: orderTotal,
      currency,
      status: "initiated",
      reference: `COD-${address.phone}`,
    })
    if (payErr) {
      return NextResponse.json({ error: payErr.message }, { status: 500 })
    }

    // Fire-and-forget order confirmation email (if provided)
    try {
      if (address.email) {
        ;(async () => {
          const sb = createClient()
          let emailSent = false
          try {
            const smtpRes = await sendOrderEmailSMTP({
              to: address.email,
              orderId: order.id,
              name: address.name,
              items: items.map((i: any) => ({
                title: i.title || "Product",
                qty: Number(i.qty),
                price: Number(i.price),
                image: i.image,
              })),
              total: orderTotal,
              shipping: { cost: Number(shipping?.cost || 0), currency },
            })
            if (smtpRes && (smtpRes as any).sent) {
              emailSent = true
            } else {
              const rs = await sendOrderConfirmationEmail({
                to: address.email,
                orderId: order.id,
                name: address.name,
                items: items.map((i: any) => ({ title: i.title || "Product", qty: Number(i.qty), price: Number(i.price) })),
                total: orderTotal,
              })
              if (rs && (rs as any).id) emailSent = true
            }
          } catch {}
          finally {
            await sb.from("orders").update({ email_sent: emailSent }).eq("id", order.id)
          }
        })()
      }
    } catch {}

    return NextResponse.json({ id: order.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 })
  }
}

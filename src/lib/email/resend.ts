export type OrderEmailInput = {
  to: string
  orderId: string
  name?: string
  items: Array<{ title: string; qty: number; price: number }>
  total: number
}

export async function sendOrderConfirmationEmail(input: OrderEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const senderEmail = process.env.SENDER_EMAIL
  if (!apiKey) return { skipped: true }
  const lines = input.items
    .map((i) => `• ${i.title} x${i.qty} — Rs. ${Number(i.price).toLocaleString()}`)
    .join("\n")
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
      <h2 style="margin:0 0 8px">Order Confirmation</h2>
      <p style="margin:0 0 12px">Thank you${input.name ? ", " + input.name : ""}! Your order <strong>#${input.orderId}</strong> has been received.</p>
      <pre style="background:#f6f6f6; padding:12px; border-radius:8px; white-space:pre-wrap">${lines}</pre>
      <p style="margin:12px 0 0"><strong>Total:</strong> Rs. ${Number(input.total).toLocaleString()}</p>
      <p style="margin:16px 0 0; color:#666">We will contact you shortly to confirm shipping. This is an automated email.</p>
    </div>
  `
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Haniya <${senderEmail}>`,
      to: input.to,
      subject: `Your Haniya order #${input.orderId}`,
      html,
    }),
  })
  return { sent: true }
}

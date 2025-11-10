import nodemailer from "nodemailer"

export type SmtpConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
}

export type OrderEmailInput = {
  to: string
  orderId: string
  name?: string
  items: Array<{ title: string; qty: number; price: number; image?: string }>
  total: number
  shipping?: { cost: number; currency: string }
}

export async function sendOrderEmailSMTP(input: OrderEmailInput) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = String(process.env.SMTP_SECURE || "false") === "true"
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || user
  if (!host || !user || !pass) return { skipped: true }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  const brand = {
    // bgDark: "#111827",
    bgDark: "#b19c64ff",
    primary: "#ceb573",
    accent: "#ceb573",
    border: "#eeeeee",
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://haniya.pk"
  const heroUrl = "https://t4.ftcdn.net/jpg/05/77/46/73/360_F_577467353_r4vmceC5eA7M2BziFYEFt4tPHkA24eBP.jpg"

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:#f7f7f8; padding:24px">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #eee; border-radius:10px; overflow:hidden">
        <div style="background:${brand.bgDark}; color:#fff; padding:16px 20px;">
          <div style="font-size:16px; letter-spacing:0.02em;">Haniya.pk</div>
          <div style="font-size:12px; opacity:.8">Order Confirmation</div>
        </div>
        <div style="padding:24px 24px 8px">
          <div style="text-align:center; margin-bottom:16px">
            <img src="${heroUrl}" alt="Haniya" width="120" height="120" style="display:inline-block; border-radius:12px; border:1px solid ${brand.border}; object-fit:cover;" />
          </div>
        </div>
        <div style="padding:0 24px 24px">
          <p style="margin:0 0 8px; font-size:14px; color:#111">Thank you${input.name ? ", " + input.name : ""}!</p>
          <p style="margin:0 0 14px; font-size:14px; color:#111">Your order <strong>#${input.orderId}</strong> has been received.</p>

          <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr>
                <th style="text-align:left; padding:8px; border-bottom:1px solid #eee; color:#6b7280; font-weight:600">Item</th>
                <th style="text-align:center; padding:8px; border-bottom:1px solid #eee; color:#6b7280; font-weight:600">Qty</th>
                <th style="text-align:right; padding:8px; border-bottom:1px solid #eee; color:#6b7280; font-weight:600">Price</th>
              </tr>
            </thead>
            <tbody>
              ${input.items
                .map(
                  (i) => `
                <tr>
                  <td style="padding:8px; border-bottom:1px solid #f1f1f1; color:#111">
                    <div style="display:flex; gap:8px; align-items:center">
                      ${i.image ? `<img src="${i.image}" alt="${i.title}" width="48" height="64" style="display:block; border:1px solid ${brand.border}; border-radius:6px; object-fit:contain; background:#fff"/>` : ""}
                      <span>${i.title}</span>
                    </div>
                  </td>
                  <td style="padding:8px; border-bottom:1px solid #f1f1f1; text-align:center; color:#111">${i.qty}</td>
                  <td style="padding:8px; border-bottom:1px solid #f1f1f1; text-align:right; color:#111">Rs. ${
                    (i.price * i.qty).toLocaleString()
                  }</td>
                </tr>`
                )
                .join("")}
            </tbody>
            <tfoot>
              ${input.shipping ? `
              <tr>
                <td colspan="2" style="padding:10px; text-align:right; color:#111;">Shipping</td>
                <td style="padding:10px; text-align:right; color:#111;">${input.shipping.currency} ${Number(input.shipping.cost).toLocaleString()}</td>
              </tr>` : ""}
              <tr>
                <td colspan="2" style="padding:10px; text-align:right; color:#111; font-weight:600">Total</td>
                <td style="padding:10px; text-align:right; color:#111; font-weight:700">Rs. ${Number(input.total).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          <p style="margin:14px 0 0; color:#6b7280; font-size:12px">We will contact you shortly to confirm shipping. This is an automated email.</p>

          <div style="margin-top:18px">
            <a href="${siteUrl}" style="display:inline-block; background:${brand.accent}; color:#fff; text-decoration:none; padding:10px 16px; border-radius:8px; font-size:13px">Visit Haniya</a>
          </div>
        </div>
      </div>
    </div>
  `

  const info = await transporter.sendMail({
    from,
    to: input.to,
    subject: `Your Haniya order #${input.orderId}`,
    html,
  })
  return { sent: true, id: info.messageId }
}

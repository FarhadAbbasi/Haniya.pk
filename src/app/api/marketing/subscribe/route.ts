import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

// Supports SMTP (Gmail/Google) via nodemailer if SMTP envs are set.
// Falls back to Resend if available. Otherwise, only saves email.
export async function POST(req: Request) {
  const res = new NextResponse()
  const supabase = await createRouteClient(res)

  try {
    const { email } = await req.json()
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 })
    }

    // Upsert into newsletter_subscribers table
    const { error: upErr } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email }, { onConflict: "email" })
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

    // const subject = "Welcome to Haniya — Enjoy 5% OFF"
    // const html = `
    //   <div style="font-family:Inter,Arial,sans-serif;padding:16px;color:#111">
    //     <h2 style="margin:0 0 12px 0">Welcome to Haniya</h2>
    //     <p style="margin:0 0 8px 0">Discover the latest Winter Collection and refresh your style.</p>
    //     <p style="margin:0 0 8px 0">You're the first to hear about discounts and new arrivals.</p>
    //     <p style="margin:12px 0 0 0;font-weight:600">GET 5% OFF on your first order.</p>
    //   </div>
    // `

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://haniya.pk"
    const heroUrl = "https://t4.ftcdn.net/jpg/05/77/46/73/360_F_577467353_r4vmceC5eA7M2BziFYEFt4tPHkA24eBP.jpg"
    const brand = {
      bgBlack: "#111827",
      bgDark: "#b19c64ff",
      primary: "#ceb573",
      accent: "#ceb573",
      border: "#eeeeee",
    }


    const subject = "Welcome to Haniya — Enjoy 5% OFF";

    const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:#f7f7f8; padding:24px">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #eee; border-radius:12px; overflow:hidden">

      <!-- Header -->
      <div style="background:${brand.bgDark}; color:#fff; padding:20px 24px;">
        <div style="font-size:18px; letter-spacing:0.5px; font-weight:600;">Haniya Store</div>
        <div style="font-size:12px; opacity:0.85;">Welcome to the Family</div>
      </div>

      <!-- Hero -->
      <div style="padding:28px 24px 0">
        <div style="text-align:center; margin-bottom:16px">
          <img 
            src="${heroUrl}" 
            alt="Welcome to Haniya" 
            width="120" height="120"
            style="display:inline-block; border-radius:12px; border:1px solid ${brand.border}; object-fit:cover;"
          />
        </div>
      </div>

      <!-- Body -->
      <div style="padding:0 24px 24px;">
        <h2 style="margin:0 0 12px; font-size:20px; color:#111; text-align:center;">Welcome to Haniya</h2>

        <p style="margin:0 0 12px; font-size:14px; color:#444; line-height:1.6; text-align:center;">
          We're excited to have you with us!
        </p>

        <p style="margin:0 0 12px; font-size:14px; color:#444; line-height:1.6; text-align:center;">
          Dive into our winter essentials... crafted for comfort, warmth, and style.
        </p>

        <p style="margin:0 0 12px; font-size:14px; color:#444; line-height:1.6; text-align:center;">
          As a welcome gift, here’s your exclusive discount:
        </p>

        <!-- Discount Box -->
        <div 
          style="
            margin:20px auto 16px;
            background:${brand.accent};
            color:#fff;
            padding-top:12px;
            padding-bottom:12px;
            padding-left:20px;
            padding-right:20px;
            border-radius:10px;
            text-align:center;
            max-width:260px;
          "
        >
          <div style="font-size:28px; font-weight:700; margin-top:4px;">5% OFF</div>
          <div style="font-size:13px; opacity:.9;">On your first order</div>
        </div>

        <p style="margin:0 0 16px; font-size:13px; color:#6b7280; text-align:center;">
          Use your discount anytime. We’ll keep you updated on new drops, limited restocks, and exclusive deals.
        </p>

        <!-- CTA Button -->
        <div style="text-align:center; margin-top:22px;">
          <a href="${siteUrl}"
            style="
              display:inline-block;
              padding:12px 24px;
              background:#fff;
              color:#000;
              border:1px solid ${brand.bgBlack};
              text-decoration:none;
              border-radius:8px;
              font-size:14px;
              font-weight:600;
            "
          >
            Shop Now
          </a>
        </div>

        <!-- Footer Note -->
        <p style="margin:22px 0 0; color:#9ca3af; font-size:11px; text-align:center;">
          You're receiving this email because you subscribed at Haniya.pk.  
          This is an automated message — please do not reply.
        </p>
      </div>
    </div>
  </div>
`;


    // Prefer SMTP via nodemailer if SMTP envs exist
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpFrom = process.env.SMTP_FROM || process.env.RESEND_FROM || "Haniya <no-reply@haniya.pk>"
    let sent = false
    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      try {
        const nodemailer = await import("nodemailer")
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for others
          auth: { user: smtpUser, pass: smtpPass },
        })
        await transporter.sendMail({ from: smtpFrom, to: email, subject, html })
        sent = true
      } catch { }
    }

    // Fallback to Resend if configured
    if (!sent) {
      const apiKey = process.env.RESEND_API_KEY
      const from = process.env.RESEND_FROM || smtpFrom
      if (apiKey) {
        const body = { from, to: [email], subject, html }
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }).catch(() => { })
      }
    }

    const resp = NextResponse.json({ ok: true })
    resp.headers.append("Set-Cookie", `newsletter_subscribed=1; Path=/; Max-Age=31536000; SameSite=Lax`)
    const setCookies = res.headers.getSetCookie?.()
    if (setCookies && setCookies.length) for (const c of setCookies) resp.headers.append("Set-Cookie", c)
    return resp
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected" }, { status: 500 })
  }
}

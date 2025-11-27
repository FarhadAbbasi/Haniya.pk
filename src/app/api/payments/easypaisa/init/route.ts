import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const amount = Number(body?.amount ?? 0)
    const orderId = String(body?.orderId ?? "")
    if (!amount || !orderId) {
      return NextResponse.json({ error: "amount and orderId are required" }, { status: 400 })
    }

    // Stubbed response. Replace with real Easypaisa API call.
    const token = `mock_${orderId}_${Date.now()}`
    const origin = process.env.NEXT_PUBLIC_SITE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`
    const redirectUrl = `${origin}/payments/easypaisa/sandbox?orderId=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(String(amount))}&token=${encodeURIComponent(token)}`

    return NextResponse.json({ redirectUrl, token })
  } catch (e) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }
}

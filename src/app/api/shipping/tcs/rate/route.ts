import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const fromCity = String(body?.fromCity || "")
    const toCity = String(body?.toCity || "")
    const weightKg = Number(body?.weightKg || 0)
    if (!fromCity || !toCity || !weightKg) {
      return NextResponse.json({ error: "fromCity, toCity, weightKg are required" }, { status: 400 })
    }

    // Stubbed pricing logic
    const base = 300
    const perKg = 120
    const cost = Math.round(base + perKg * Math.max(1, weightKg))

    return NextResponse.json({ cost, currency: "PKR", etaDays: 2 })
  } catch (e) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }
}

import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cn = searchParams.get("cn") || ""
    if (!cn) return NextResponse.json({ error: "cn is required" }, { status: 400 })

    // Stubbed tracking history
    const history = [
      { time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), location: "Origin Facility", message: "Shipment Booked" },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), location: "Transit Hub", message: "In Transit" },
      { time: new Date().toISOString(), location: "Destination City", message: "Out for Delivery" },
    ]

    return NextResponse.json({ status: "In Transit", history })
  } catch (e) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }
}

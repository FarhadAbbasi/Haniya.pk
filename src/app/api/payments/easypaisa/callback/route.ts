import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // Stub to receive Easypaisa callback notifications
  return NextResponse.json({ ok: true })
}

export async function GET() {
  // Allow simple GET pings for testing
  return NextResponse.json({ ok: true })
}

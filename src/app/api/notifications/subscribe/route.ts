import { NextResponse } from "next/server"
import { createRouteClient, jsonWithCookies } from "@/lib/supabase/route"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const res = new NextResponse()
  try {
    const supabase = await createRouteClient(res)
    const body = await req.json()
    const sub = body && body.subscription
    if (!sub || !sub.endpoint || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
      return NextResponse.json({ error: "invalid_subscription" }, { status: 400 })
    }
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id || null
    const userAgent = req.headers.get('user-agent') || null

    const payload = {
      endpoint: String(sub.endpoint),
      p256dh: String(sub.keys.p256dh),
      auth: String(sub.keys.auth),
      user_id: userId,
      user_agent: userAgent,
    }
    // upsert by endpoint
    const { error } = await supabase.from('push_subscriptions').upsert(payload, { onConflict: 'endpoint' })
    if (error) return jsonWithCookies(res, { error: error.message }, { status: 500 })
    return jsonWithCookies(res, { ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unexpected' }, { status: 500 })
  }
}

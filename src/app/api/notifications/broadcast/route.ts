import { NextResponse } from "next/server"
import { createRouteClient, jsonWithCookies } from "@/lib/supabase/route"
import webpush from "web-push"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const res = new NextResponse()
  try {
    const supabase = await createRouteClient(res)
    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', user.email)
      .maybeSingle()
    if (!adminRow) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    const payload = await req.json()
    const title: string = payload?.title || 'Update'
    const body: string = payload?.body || ''
    const url: string = payload?.url || '/'
    const icon: string | undefined = payload?.icon
    const onlyCurrentUser: boolean = !!payload?.onlyCurrentUser

    const pub = process.env.VAPID_PUBLIC_KEY
    const priv = process.env.VAPID_PRIVATE_KEY
    const subject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com'
    if (!pub || !priv) return NextResponse.json({ error: 'vapid_not_configured' }, { status: 500 })

    webpush.setVapidDetails(subject, pub, priv)

    let query = supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth, user_id')
    if (onlyCurrentUser) {
      query = query.eq('user_id', user.id)
    }
    const { data: subs } = await query

    const list = subs || []
    let sent = 0
    let removed = 0

    for (const s of list) {
      const subscription = {
        endpoint: (s as any).endpoint,
        keys: { p256dh: (s as any).p256dh, auth: (s as any).auth },
      }
      try {
        await webpush.sendNotification(subscription as any, JSON.stringify({ title, body, url, icon }))
        sent++
      } catch (err: any) {
        // remove gone subscriptions
        const status = err?.statusCode || err?.statusCode === 410
        if (status === 410) {
          await supabase.from('push_subscriptions').delete().eq('id', (s as any).id)
          removed++
        }
      }
    }

    return jsonWithCookies(res, { ok: true, sent, removed })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unexpected' }, { status: 500 })
  }
}

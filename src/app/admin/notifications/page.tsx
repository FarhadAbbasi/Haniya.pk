import { createClient } from "@/lib/supabase/server"
import NotificationsFormClient from "@/components/admin/notifications-form-client"

export default async function AdminNotificationsPage() {
  const supabase = createClient()
  const { count } = await supabase
    .from('push_subscriptions')
    .select('id', { count: 'exact', head: true })

  const pub = process.env.VAPID_PUBLIC_KEY ? 'configured' : 'missing'
  const priv = process.env.VAPID_PRIVATE_KEY ? 'configured' : 'missing'

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-neutral-600">Broadcast web push notifications to subscribed browsers.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-3 text-sm">
          <div className="font-medium">Subscriptions</div>
          <div className="mt-1 text-neutral-600">Total: <span className="font-semibold">{count ?? '—'}</span></div>
        </div>
        <div className="rounded border bg-white p-3 text-sm">
          <div className="font-medium">VAPID Public Key</div>
          <div className="mt-1 text-neutral-600">{pub}</div>
        </div>
        <div className="rounded border bg-white p-3 text-sm">
          <div className="font-medium">VAPID Private Key</div>
          <div className="mt-1 text-neutral-600">{priv}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded border bg-white p-4">
        <div className="mb-3 text-sm font-medium">Send Notification</div>
        <NotificationsFormClient />
      </div>
    </div>
  )
}

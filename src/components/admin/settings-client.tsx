"use client"

import * as React from "react"

export function SettingsClient({ initial }: { initial: { shipping_rate?: number; sender_email?: string; site_url?: string } }) {
  const [shippingRate, setShippingRate] = React.useState<string>(initial.shipping_rate != null ? String(initial.shipping_rate) : "200")
  const [senderEmail, setSenderEmail] = React.useState<string>(initial.sender_email || "")
  const [siteUrl, setSiteUrl] = React.useState<string>(initial.site_url || "")
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<string>("")

  async function save() {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping_rate: Number(shippingRate),
          sender_email: senderEmail,
          site_url: siteUrl,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to save")
      setMessage("Saved")
    } catch (e: any) {
      setMessage(e?.message || "Failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm">Shipping rate (PKR)</label>
        <input
          type="number"
          min={0}
          className="w-full rounded border px-3 py-2 text-sm"
          value={shippingRate}
          onChange={(e) => setShippingRate(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Sender email</label>
        <input
          type="email"
          className="w-full rounded border px-3 py-2 text-sm"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Site URL</label>
        <input
          type="url"
          placeholder="https://haniya-clothing.netlify.app"
          className="w-full rounded border px-3 py-2 text-sm"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <button disabled={saving} className="rounded bg-black px-3 py-2 text-xs font-medium text-white disabled:opacity-60" onClick={save}>
          {saving ? "Saving…" : "Save settings"}
        </button>
        {message ? <span className="text-xs text-neutral-600">{message}</span> : null}
      </div>
      <div className="text-xs text-neutral-500">
        If saving fails with a table error, create a table named <code>settings</code> with columns: <code>key text primary key</code>, <code>value text</code>.
      </div>
    </div>
  )
}

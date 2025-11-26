"use client"

import * as React from "react"

export default function NotificationsFormClient() {
  const [title, setTitle] = React.useState("")
  const [body, setBody] = React.useState("")
  const [url, setUrl] = React.useState("/")
  const [icon, setIcon] = React.useState("/icon-192.png")
  const [useBrandIcon, setUseBrandIcon] = React.useState(true)
  const [onlyMe, setOnlyMe] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const [result, setResult] = React.useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setResult(null)
    try {
      const res = await fetch("/api/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url, icon: useBrandIcon ? "/icon-192.png" : icon, onlyCurrentUser: onlyMe }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed")
      setResult(`Sent: ${data?.sent ?? 0}, removed: ${data?.removed ?? 0}`)
    } catch (err: any) {
      setResult(`Error: ${err?.message || "Unexpected"}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Sale is live!" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="/sale" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Body</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded border px-3 py-2" rows={3} placeholder="Flat 20% off this weekend." />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Icon</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useBrandIcon} onChange={(e) => setUseBrandIcon(e.target.checked)} /> Use brand icon (/icon-192.png)</label>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Custom Icon URL</label>
          <input value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full rounded border px-3 py-2 disabled:opacity-60" placeholder="/icon-192.png" disabled={useBrandIcon} />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyMe} onChange={(e) => setOnlyMe(e.target.checked)} /> Send to me only (for testing)</label>
      </div>
      <button className="rounded bg-black px-3 py-2 text-xs font-medium text-white disabled:opacity-60" disabled={sending}>
        {sending ? "Sending…" : "Send Notification"}
      </button>
      {result ? (<div className="text-xs text-neutral-600">{result}</div>) : null}
    </form>
  )
}

"use client"

import * as React from "react"

export function ContentClient({ initial }: { initial: { home_highlights?: string; about?: string; privacy?: string; returns?: string } }) {
  const [home, setHome] = React.useState(initial.home_highlights || "")
  const [about, setAbout] = React.useState(initial.about || "")
  const [privacy, setPrivacy] = React.useState(initial.privacy || "")
  const [returns, setReturns] = React.useState(initial.returns || "")
  const [saving, setSaving] = React.useState(false)
  const [msg, setMsg] = React.useState("")

  async function save() {
    setSaving(true)
    setMsg("")
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ home_highlights: home, about, privacy, returns }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to save")
      setMsg("Saved")
    } catch (e: any) {
      setMsg(e?.message || "Failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-sm font-medium">Home highlights</div>
        <textarea className="h-28 w-full rounded border p-2 text-sm" value={home} onChange={(e) => setHome(e.target.value)} />
      </div>
      <div>
        <div className="mb-1 text-sm font-medium">About</div>
        <textarea className="h-40 w-full rounded border p-2 text-sm" value={about} onChange={(e) => setAbout(e.target.value)} />
      </div>
      <div>
        <div className="mb-1 text-sm font-medium">Privacy</div>
        <textarea className="h-40 w-full rounded border p-2 text-sm" value={privacy} onChange={(e) => setPrivacy(e.target.value)} />
      </div>
      <div>
        <div className="mb-1 text-sm font-medium">Returns</div>
        <textarea className="h-40 w-full rounded border p-2 text-sm" value={returns} onChange={(e) => setReturns(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={save} disabled={saving} className="rounded bg-black px-3 py-2 text-xs font-medium text-white disabled:opacity-60">
          {saving ? "Saving…" : "Save content"}
        </button>
        {msg ? <span className="text-xs text-neutral-600">{msg}</span> : null}
      </div>
      <div className="text-xs text-neutral-500">Content is stored in the settings table using keys: home_highlights, about, privacy, returns.</div>
    </div>
  )
}

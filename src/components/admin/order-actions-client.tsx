"use client"

import * as React from "react"

export function OrderActionsClient({ orderId, initialStatus }: { orderId: string; initialStatus: string }) {
  const [saving, setSaving] = React.useState(false)
  const [resending, setResending] = React.useState(false)
  const [status, setStatus] = React.useState<string>(initialStatus)

  React.useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  async function saveStatus() {
    try {
      setSaving(true)
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) window.location.reload()
    } finally {
      setSaving(false)
    }
  }

  async function resendEmail() {
    try {
      setResending(true)
      const res = await fetch(`/api/admin/orders/${orderId}/resend-email`, { method: "POST" })
      if (res.ok) window.location.reload()
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="p-3 text-sm space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm" htmlFor="status">Update status</label>
        <select
          id="status"
          className="rounded border px-2 pr-8 py-1 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          className="rounded bg-black px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
          onClick={saveStatus}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <button
        className="rounded border px-3 py-1 text-xs disabled:opacity-60"
        onClick={resendEmail}
        disabled={resending}
      >
        {resending ? "Sending…" : "Re-send confirmation email"}
      </button>
    </div>
  )
}

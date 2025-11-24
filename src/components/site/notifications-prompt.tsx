"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const KEY = "seen_notifications_prompt_v1"

export default function NotificationsPrompt() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    try {
      const seen = localStorage.getItem(KEY)
      if (!seen) {
        const t = setTimeout(() => setOpen(true), 3000)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [])

  function closeAndRemember() {
    try { localStorage.setItem(KEY, String(Date.now())) } catch {}
    setOpen(false)
  }

  async function askPermission() {
    try {
      if (typeof Notification !== "undefined" && Notification.requestPermission) {
        const res = await Notification.requestPermission()
        // hook up to your push subscription here if granted
      }
    } finally {
      closeAndRemember()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : closeAndRemember())}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Get updates</DialogTitle>
        <div className="space-y-2 text-center">
          <h3 className="text-base font-semibold tracking-tight text-black">Get Sale & New Arrival Alerts</h3>
          <p className="text-sm text-neutral-700">Allow notifications to be the first to know about discounts and latest collections.</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={closeAndRemember} className="rounded-md border px-3 py-2 text-sm">Maybe later</button>
          <button onClick={askPermission} className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90">Allow</button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

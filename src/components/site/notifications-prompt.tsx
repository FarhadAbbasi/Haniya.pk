"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export default function NotificationsPrompt() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const shouldShow = pathname === "/" && (typeof Notification === "undefined" || Notification.permission !== "granted")
    if (!shouldShow) return
    const t = setTimeout(() => setOpen(true), 2500)
    return () => clearTimeout(t)
  }, [pathname])

  function close() {
    setOpen(false)
  }

  async function askPermission() {
    try {
      if (typeof Notification !== "undefined" && Notification.requestPermission) {
        const perm = await Notification.requestPermission()
        if (perm === "granted") {
          // Register SW and subscribe
          if ("serviceWorker" in navigator && "PushManager" in window) {
            const reg = await navigator.serviceWorker.register("/sw.js")
            const r = await fetch("/api/notifications/vapid-public")
            const { publicKey } = await r.json()
            const appServerKey = urlBase64ToUint8Array(publicKey || "")
            const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appServerKey })
            await fetch("/api/notifications/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: sub }) })
          }
        }
      }
    } finally {
      close()
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Get updates</DialogTitle>
        <div className="space-y-2 text-center">
          <h3 className="text-base font-semibold tracking-tight text-black">Get Sale & New Arrival Alerts</h3>
          <p className="text-sm text-neutral-700">Allow notifications to be the first to know about discounts and latest collections.</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={close} className="rounded-md border px-3 py-2 text-sm">Maybe later</button>
          <button onClick={askPermission} className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90">Allow</button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

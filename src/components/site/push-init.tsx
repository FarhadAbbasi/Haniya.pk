"use client"

import * as React from "react"

export default function PushInit() {
  React.useEffect(() => {
    async function ensure() {
      try {
        if (typeof window === "undefined") return
        // In development, ensure no SW is active and skip registration to avoid dev caching/hydration issues
        if (process.env.NODE_ENV !== "production") {
          if ("serviceWorker" in navigator) {
            try {
              const regs = await navigator.serviceWorker.getRegistrations()
              await Promise.all(regs.map((r) => r.unregister()))
            } catch (_) {}
          }
          return
        }
        if (typeof Notification === "undefined") return
        if (Notification.permission !== "granted") return
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

        // Register SW
        const reg = await navigator.serviceWorker.register("/sw.js")
        // If already subscribed, skip
        const existing = await reg.pushManager.getSubscription()
        if (existing) {
          await fetch("/api/notifications/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: existing }) })
          return
        }

        // Get VAPID key
        const r = await fetch("/api/notifications/vapid-public")
        const { publicKey } = await r.json()
        if (!publicKey) return
        const appServerKey = urlBase64ToUint8Array(publicKey)

        // Subscribe and send to server
        const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appServerKey })
        await fetch("/api/notifications/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: sub }) })
      } catch (_) {
        // swallow errors; this is best-effort
      }
    }
    ensure()
  }, [])

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

  return null
}

"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

const KEY = "seen_marketing_welcome_v2"

export default function MarketingWelcomeModal() {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [image, setImage] = React.useState<string | undefined>('https://formsv2.soundestlink.com/cdn-cgi/image/fit=scale-down,width=1200/forms/67e67b6b58d210cfd7f04456')
  const pathname = usePathname()

  React.useEffect(() => {
    // Only show on homepage
    if (pathname !== "/") return
    try {
      // If user already subscribed, suppress
      const subscribed = localStorage.getItem("newsletter_subscribed")
      if (subscribed === "1" || document.cookie.includes("newsletter_subscribed=1")) return
      const seen = localStorage.getItem(KEY)
      const shouldOpen = (() => {
        if (!seen) return true
        const when = Number(seen)
        if (Number.isNaN(when)) return false
        const days = (Date.now() - when) / (1000 * 60 * 60 * 24)
        return days > 14
      })()
      if (shouldOpen) {
        const t = setTimeout(() => setOpen(true), 1000)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [pathname])

  // React.useEffect(() => {
  //   if (!open) return
  //   // Fetch a latest product image for visual appeal
  //   fetch("/api/products/latest")
  //     .then((r) => r.json())
  //     .then((j) => setImage(j?.item?.image))
  //     .catch(() => {})
  // }, [open])

  function closeAndRemember() {
    try { localStorage.setItem(KEY, String(Date.now())) } catch {}
    setOpen(false)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email")
      return
    }
    try {
      await fetch("/api/marketing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      try { localStorage.setItem("newsletter_subscribed", "1"); document.cookie = "newsletter_subscribed=1; path=/; max-age=31536000" } catch {}
      toast.success("Thanks! You get 5% off on your first order")
      closeAndRemember()
    } catch {
      closeAndRemember()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : closeAndRemember())}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">Welcome</DialogTitle>
        <div className="grid grid-cols-1  sm:grid-cols-2">
          <div className="relative hidden sm:block">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700" /> */}
            {image ? (
              <img src={image} alt="Featured" className="relative z-10 h-full w-full object-cover opacity-100" />
            ) : (
              <div className="relative z-10 h-full w-full" />
            )}
          </div>
          <div className="p-8 sm:p-8 flex flex-col gap-6 bg-primary/20">
            <div className="mt-10 space-y-5 align-center items-center flex flex-col">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">Exclusive Offer</div>
              <h3 className="text-2xl font-bold uppercase leading-tight text-center text-neutral-600">Discover the latest Winter Collection</h3>
              <p className="text-sm text-center text-neutral-500">Refresh your style and be the first to hear about new discounts and offers.</p>
            </div>
            <form onSubmit={onSubmit} className="my-5 flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                className="flex-1 rounded-md border px-3 py-3 text-sm tracking-wide outline-none focus:ring-1 focus:ring-slate-400"
              />
              <button type="submit" className="rounded-md bg-black/90 px-4 py-4 text-sm font-semibold text-white hover:scale-102 hover:cursor-pointer hover:bg-black transition-all">GET 5% OFF</button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

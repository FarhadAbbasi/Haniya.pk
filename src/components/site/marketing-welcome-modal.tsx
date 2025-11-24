"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

const KEY = "seen_marketing_welcome_v2"

export default function MarketingWelcomeModal() {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [image, setImage] = React.useState<string | undefined>(undefined)
  const pathname = usePathname()

  React.useEffect(() => {
    // Do not show on PDP
    if (pathname?.startsWith("/p/")) return
    try {
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

  React.useEffect(() => {
    if (!open) return
    // Fetch a latest product image for visual appeal
    fetch("/api/products/latest")
      .then((r) => r.json())
      .then((j) => setImage(j?.item?.image))
      .catch(() => {})
  }, [open])

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
      // Optionally send to backend here
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
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="relative hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700" />
            {image ? (
              <img src={image} alt="Featured" className="relative z-10 h-full w-full object-cover mix-blend-overlay opacity-90" />
            ) : (
              <div className="relative z-10 h-full w-full" />
            )}
          </div>
          <div className="p-6 sm:p-8">
            <div className="space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Exclusive Offer</div>
              <h3 className="text-2xl font-bold uppercase leading-tight text-black">Discover the latest Winter Collection</h3>
              <p className="text-sm text-neutral-700">Refresh your style and be the first to hear about new discounts and offers.</p>
              <div className="inline-block rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white">GET 5% OFF</div>
            </div>
            <form onSubmit={onSubmit} className="mt-5 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                className="flex-1 rounded-md border px-3 py-2 text-sm uppercase tracking-wide outline-none focus:ring-2 focus:ring-black"
              />
              <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90">Subscribe</button>
            </form>
            <button onClick={closeAndRemember} className="mt-3 w-full rounded-md border px-4 py-2 text-sm">No thanks</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

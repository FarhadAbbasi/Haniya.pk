"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

export function SearchInline({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  return (
    <div ref={ref} className="flex items-center gap-2">
      {open && (
        <form
          className="block"
          action={(formData: FormData) => {
            const q = String(formData.get("q") || "").trim()
            if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`
          }}
        >
          <Input
            name="q"
            placeholder="Search products..."
            className="h-9 w-44 sm:w-56"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false)
            }}
          />
        </form>
      )}
      <span onClick={() => setOpen((v) => !v)}>{children}</span>
    </div>
  )
}

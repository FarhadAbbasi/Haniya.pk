"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function SearchDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <form action={(formData: FormData) => {
            const q = String(formData.get("q") || "").trim()
            if (q) {
              window.location.href = `/search?q=${encodeURIComponent(q)}`
            }
          }}>
            <Input name="q" autoFocus placeholder="Search products..." />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

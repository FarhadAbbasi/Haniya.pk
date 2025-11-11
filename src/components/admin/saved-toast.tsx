"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function SavedToast() {
  useEffect(() => {
    const url = new URL(window.location.href)
    const saved = url.searchParams.get("saved")
    if (saved === "1") {
      toast.success("Saved")
      url.searchParams.delete("saved")
      window.history.replaceState({}, "", url.toString())
    }
  }, [])
  return null
}

"use client"

import * as React from "react"

export function OrdersExportClient({ baseHref, detailsHref }: { baseHref: string; detailsHref: string }) {
  const [exporting, setExporting] = React.useState<"none" | "base" | "details">("none")

  async function trigger(href: string, kind: "base" | "details") {
    try {
      setExporting(kind)
      // Use an invisible link to avoid interfering with form
      const a = document.createElement("a")
      a.href = href
      a.download = "orders_export.csv"
      document.body.appendChild(a)
      a.click()
      a.remove()
    } finally {
      // give a small delay so user sees the state
      setTimeout(() => setExporting("none"), 800)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => trigger(baseHref, "base")}
        disabled={exporting !== "none"}
        className="rounded border px-2 py-1 text-sm disabled:opacity-60"
      >
        {exporting === "base" ? "Exporting…" : "Export CSV"}
      </button>
      <button
        type="button"
        onClick={() => trigger(detailsHref, "details")}
        disabled={exporting !== "none"}
        className="rounded border px-2 py-1 text-sm disabled:opacity-60"
      >
        {exporting === "details" ? "Exporting…" : "Export CSV (with items)"}
      </button>
    </div>
  )
}

"use client"

import * as React from "react"
import { RelatedProducts } from "@/components/product/related-products"

const KEY = "recently_viewed_products"

export function RecentlyViewed({ currentId, heading = "Keep exploring" }: { currentId: string; heading?: string }) {
  const [items, setItems] = React.useState<any[]>([])

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      const ids = (raw ? JSON.parse(raw) : []) as string[]
      const next = [currentId, ...ids.filter((i) => i !== currentId)]
      const capped = next.slice(0, 16)
      localStorage.setItem(KEY, JSON.stringify(capped))
      const toShow = capped.filter((i) => i !== currentId)
      if (toShow.length) {
        const url = `/api/products/by-ids?` + new URLSearchParams({ ids: toShow.join(",") }).toString()
        fetch(url).then((r) => r.json()).then((j) => setItems(j.items || [])).catch(() => {})
      }
    } catch {}
  }, [currentId])

  if (!items || items.length === 0) return null
  return <RelatedProducts items={items as any[]} heading={heading} />
}

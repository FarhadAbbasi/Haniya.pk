"use client"

import * as React from "react"
import { SizeSelector } from "@/components/product/size-selector"
import { Button } from "@/components/ui/button"
import { useCart } from "@/store/cart"

export function PdpClient({
  id,
  title,
  price,
  images,
}: {
  id: string
  title: string
  price: number
  images?: { url: string }[]
}) {
  const addItem = useCart((s) => s.addItem)
  const [size, setSize] = React.useState<string>("M")

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-lg border bg-white">
        {images && images.length > 0 ? (
          <img src={images[0].url} alt={title} className="aspect-[3/4] w-full object-contain bg-white" />
        ) : (
          <div className="aspect-[3/4] w-full bg-muted" />
        )}
      </div>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-lg text-muted-foreground">Rs. {price.toLocaleString()}</p>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Size</p>
          <SizeSelector onChange={setSize} />
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={() =>
              addItem({ id, title: `${title} (${size})`, price, qty: 1, variant: size })
            }
          >
            Add to Cart
          </Button>
          <Button variant="outline">Size Guide</Button>
        </div>

        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          <p>• Premium fabric with modern fit</p>
          <p>• Easy 7-day exchange</p>
        </div>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { SizeSelector } from "@/components/product/size-selector"
import { Button } from "@/components/ui/button"
import { useCart } from "@/store/cart"
import { useRouter } from "next/navigation"
import { Scale, ScaleIcon, ShoppingCartIcon } from "lucide-react"

export function PdpClient({
  id,
  title,
  price,
  images,
  compareAtPrice,
  currency = "PKR",
  isSale,
  fabric,
  description,
}: {
  id: string
  title: string
  price: number
  images?: { url: string }[]
  compareAtPrice?: number | null
  currency?: string
  isSale?: boolean
  fabric?: string | null
  description?: string | null
}) {
  const addItem = useCart((s) => s.addItem)
  const clear = useCart((s) => s.clear)
  const [size, setSize] = React.useState<string>("M")
  const [qty, setQty] = React.useState<number>(1)
  const router = useRouter()

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
        <div className="mb-2 flex items-center gap-2">
          {isSale ? (
            <span className="inline-block rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white">Sale</span>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-xl font-medium">{currency} {price.toLocaleString()}</p>
          {compareAtPrice ? (
            <p className="text-base text-muted-foreground line-through">{currency} {Number(compareAtPrice).toLocaleString()}</p>
          ) : null}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">Tax included. Shipping calculated at checkout.</div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Size</p>
          <SizeSelector onChange={setSize} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center rounded border">
            <button aria-label="Decrease" className="px-3 py-2 text-sm" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button aria-label="Increase" className="px-3 py-2 text-sm" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
        </div>
        <div className="flex justify-end" >
          <Button variant="outline"> Size Chart</Button>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="outline"
            onClick={() =>
              addItem({ id, title: `${title} (${size})`, price, qty, variant: size })
            }
          >
            <ShoppingCartIcon className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button variant="default" onClick={() => { clear(); addItem({ id, title: `${title} (${size})`, price, qty, variant: size }); router.push("/checkout"); }}
            >  Buy it now</Button>
          {/* <Button variant="ghost">Size Chart</Button> */}
        </div>

        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          <p>• Premium fabric with modern fit</p>
          {description ? <p>{description}</p> : null}
          {fabric ? <p>Material: {String(fabric).toUpperCase()}</p> : null}
          <p>• Stitched</p>
          <p>• Easy 7-day exchange</p>
        </div>
      </div>
    </div>
  )
}

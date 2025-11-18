"use client"

import * as React from "react"
import { SizeSelector } from "@/components/product/size-selector"
import { Button } from "@/components/ui/button"
import { useCart } from "@/store/cart"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Scale, ScaleIcon, ShoppingCartIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import useEmblaCarousel from "embla-carousel-react"
import { ImageLightbox } from "@/components/product/image-lightbox"

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
  const sb = createClient()
  const [stockBySize, setStockBySize] = React.useState<Record<string, number>>({})
  const available = stockBySize[size] ?? undefined

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const { data } = await sb
          .from("product_variants")
          .select("size, stock")
          .eq("product_id", id)
        if (alive && data) {
          const map: Record<string, number> = {}
          for (const v of data as any[]) map[String((v as any).size)] = Number((v as any).stock || 0)
          setStockBySize(map)
        }
      } catch {}
    })()
    return () => {
      alive = false
    }
  }, [id])

  React.useEffect(() => {
    if (typeof available === "number" && qty > available) setQty(available > 0 ? available : 1)
  }, [available])

  const [imgIdx, setImgIdx] = React.useState(0)
  const mainImg = images && images.length > 0 ? images[Math.min(imgIdx, images.length - 1)] : undefined
  const [openLb, setOpenLb] = React.useState(false)
  const [emblaRef, embla] = useEmblaCarousel({ loop: false })
  React.useEffect(() => {
    if (!embla) return
    const onSelect = () => setImgIdx(embla.selectedScrollSnap())
    embla.on("select", onSelect)
    return () => { embla.off("select", onSelect) }
  }, [embla])
  React.useEffect(() => {
    embla?.scrollTo(imgIdx, false)
  }, [imgIdx, embla])
  const sizeOrder = ["XS", "S", "M", "L", "XL"]
  const sizeOptions = sizeOrder.filter((s) => Object.prototype.hasOwnProperty.call(stockBySize, s))

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <div className="overflow-hidden rounded-lg border bg-white" ref={emblaRef}>
          <div className="flex" onClick={() => mainImg && setOpenLb(true)}>
            {(images && images.length > 0 ? images : [undefined]).map((im, i) => (
              <div key={`${im?.url || "placeholder"}-${i}`} className="min-w-0 flex-[0_0_100%]">
                {im ? (
                  <img src={im.url} alt={title} className="aspect-[3/4] w-full object-contain bg-white" />
                ) : (
                  <div className="aspect-[3/4] w-full bg-muted" />
                )}
              </div>
            ))}
          </div>
        </div>
        {images && images.length > 1 ? (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {images.map((im, i) => (
              <button
                key={`${im.url}-${i}`}
                aria-label={`Image ${i + 1}`}
                className={`aspect-square overflow-hidden rounded border ${i === imgIdx ? "ring-2 ring-black" : ""} hover:cursor-pointer`}
                onClick={() => setImgIdx(i)}
              >
                <img src={im.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
        {images && images.length > 0 ? (
          <ImageLightbox images={images} open={openLb} onOpenChange={setOpenLb} startIndex={imgIdx} />
        ) : null}
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
          <SizeSelector sizes={sizeOptions} onChange={setSize} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center rounded border">
            <button aria-label="Decrease" className="px-3 py-2 text-sm" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button
              aria-label="Increase"
              className="px-3 py-2 text-sm"
              onClick={() => setQty((q) => (typeof available === "number" ? Math.min(available, q + 1) : q + 1))}
            >
              +
            </button>
          </div>
        </div>
        {typeof available === "number" && (
          <div className="mt-2 text-xs">
            {available > 0 ? (
              <span className="text-emerald-700">In stock: {available}</span>
            ) : (
              <span className="text-red-600 ">Out of stock</span>
            )}
          </div>
        )}
        <div className="flex justify-end" >
          <Button variant="outline"> Size Chart</Button>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            variant= "outline"
            className="hover:bg-gray-500/50 hover:cursor-pointer"
            onClick={() => {
              if (typeof available === "number" && available <= 0) {
                toast.error("Selected size is out of stock")
                return
              }
              if (typeof available === "number" && qty > available) {
                toast.error(`Only ${available} left in stock`)
                return
              }
              addItem({ id, title: `${title} (${size})`, price, qty, variant: size, image: images?.[0]?.url })
              toast.success("Added to cart")
            }}
          >
            <ShoppingCartIcon className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="default"
            className="hover:scale-105 hover:cursor-pointer"
            onClick={() => {
              if (typeof available === "number" && available <= 0) {
                toast.error("Selected size is out of stock")
                return
              }
              if (typeof available === "number" && qty > available) {
                toast.error(`Only ${available} left in stock`)
                return
              }
              clear();
              addItem({ id, title: `${title} (${size})`, price, qty, variant: size, image: images?.[0]?.url });
              toast.success("Added — taking you to checkout");
              router.push("/checkout");
            }}
          >
            Buy now
          </Button>
          {/* <Button variant="ghost">Size Chart</Button> */}
        </div>

        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          {description ? <p>• {description}</p> : null}
          {fabric ? <p>• Material: {String(fabric).toUpperCase()}</p> : null}
          <p>• Premium fabric with modern fit</p>
          <p>• Stitched</p>
          <p>• Easy 7-day exchange</p>
        </div>
      </div>
    </div>
  )
}

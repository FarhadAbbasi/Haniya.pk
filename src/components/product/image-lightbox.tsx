"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, XIcon, ZoomIn, ZoomOut } from "lucide-react"

export function ImageLightbox({ images, open, onOpenChange, startIndex = 0 }: {
  images: { url: string }[]
  open: boolean
  onOpenChange: (v: boolean) => void
  startIndex?: number
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false, startIndex })
  const [index, setIndex] = React.useState(startIndex)
  const [zoom, setZoom] = React.useState(false)
  const [scale, setScale] = React.useState(1)
  const [tx, setTx] = React.useState(0)
  const [ty, setTy] = React.useState(0)
  const pinchRef = React.useRef<{ startDist: number; baseScale: number } | null>(null)
  const panRef = React.useRef<{ x: number; y: number } | null>(null)

  React.useEffect(() => {
    if (!embla) return
    const onSelect = () => setIndex(embla.selectedScrollSnap())
    embla.on("select", onSelect)
    return () => { embla.off("select", onSelect) }
  }, [embla])

  React.useEffect(() => {
    if (embla) embla.scrollTo(startIndex, false)
    setIndex(startIndex)
  }, [startIndex, embla, open])

  const prev = () => embla?.scrollPrev()
  const next = () => embla?.scrollNext()

  function onTouchStart(e: React.TouchEvent<HTMLImageElement>) {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]]
      const dx = a.clientX - b.clientX
      const dy = a.clientY - b.clientY
      pinchRef.current = { startDist: Math.hypot(dx, dy), baseScale: scale }
    } else if (e.touches.length === 1 && scale > 1) {
      panRef.current = { x: e.touches[0].clientX - tx, y: e.touches[0].clientY - ty }
    }
  }

  function onTouchMove(e: React.TouchEvent<HTMLImageElement>) {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault()
      const [a, b] = [e.touches[0], e.touches[1]]
      const dx = a.clientX - b.clientX
      const dy = a.clientY - b.clientY
      const dist = Math.hypot(dx, dy)
      const nextScale = Math.max(1, Math.min(3, pinchRef.current.baseScale * (dist / pinchRef.current.startDist)))
      setScale(nextScale)
      setZoom(nextScale > 1)
    } else if (e.touches.length === 1 && panRef.current && scale > 1) {
      e.preventDefault()
      const x = e.touches[0].clientX - panRef.current.x
      const y = e.touches[0].clientY - panRef.current.y
      setTx(x)
      setTy(y)
    }
  }

  function onTouchEnd() {
    if (scale <= 1) {
      setScale(1); setTx(0); setTy(0); setZoom(false)
    }
    pinchRef.current = null
    panRef.current = null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="inset-0 h-full w-full max-w-none border-0 bg-black/95 p-0" showCloseButton>
        <DialogTitle className="sr-only">Product images</DialogTitle>
        <div className="absolute right-3 top-3 z-20 flex items-center gap-2 text-white">
          <div className="mr-2 text-xs tabular-nums opacity-90">{index + 1} / {images.length}</div>
          <button aria-label={zoom ? "Zoom out" : "Zoom in"} onClick={() => { setZoom((z) => { const nz = !z; setScale(nz ? Math.max(1.5, scale) : 1); if (!nz) { setTx(0); setTy(0); } return nz }) }} className="rounded bg-white/10 p-2">
            {zoom ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>
          <button aria-label="Close" onClick={() => onOpenChange(false)} className="rounded bg-white/10 p-2">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        {images.length > 1 ? (
        <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2">
          <button aria-label="Previous" onClick={prev} className="rounded bg-white/10 p-2 text-white">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        ) : null}
        {images.length > 1 ? (
        <div className="absolute right-3 top-1/2 z-20 -translate-y-1/2">
          <button aria-label="Next" onClick={next} className="rounded bg-white/10 p-2 text-white">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        ) : null}
        <div className="h-full w-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((im, i) => (
              <div key={`${im.url}-${i}`} className="min-w-0 flex-[0_0_100%]">
                <div className="flex h-full w-full items-center justify-center">
                  <img
                    src={im.url}
                    alt=""
                    onDoubleClick={() => { const nz = !zoom; setZoom(nz); setScale(nz ? Math.max(1.5, scale) : 1); if (!nz) { setTx(0); setTy(0) } }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    className={`max-h-full max-w-full select-none ${zoom || scale > 1 ? "cursor-grab" : ""} transition-transform duration-150`}
                    style={{ touchAction: (zoom || scale > 1) ? "none" : "pan-y", transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
          {images.map((_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

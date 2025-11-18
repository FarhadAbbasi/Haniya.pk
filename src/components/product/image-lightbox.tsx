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
    // Embla carousel for horizontal swiping between images
    const [emblaRef, embla] = useEmblaCarousel({ loop: false, startIndex })
    const [index, setIndex] = React.useState(startIndex)
    // Zoom/pan state
    const [zoom, setZoom] = React.useState(false)
    const [scale, setScale] = React.useState(1) // 1 = fitted image, >1 = zoomed
    const [tx, setTx] = React.useState(0)       // pan X (in px), relative to centered image
    const [ty, setTy] = React.useState(0)       // pan Y (in px)
    // Gesture trackers
    const pinchRef = React.useRef<{ startDist: number; baseScale: number } | null>(null)
    const panRef = React.useRef<{ x: number; y: number } | null>(null)

    // Reset pan/zoom when slide changes to keep each image centered by default
    React.useEffect(() => {
        if (!embla) return
        // When slide changes in Embla, update our index
        const onSelect = () => setIndex(embla.selectedScrollSnap())
        embla.on("select", onSelect)
        return () => { embla.off("select", onSelect) }
    }, [embla])

    React.useEffect(() => {
        // Ensure Embla starts on the requested index when opening
        if (embla) embla.scrollTo(startIndex, false)
        setIndex(startIndex)
        // reset transforms on open/start
        setScale(1); setTx(0); setTy(0); setZoom(false)
    }, [startIndex, embla, open])

    const prev = () => embla?.scrollPrev()
    const next = () => embla?.scrollNext()

    // Start pinch or pan gestures
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

    // Update pinch or pan gestures
    function onTouchMove(e: React.TouchEvent<HTMLImageElement>) {
        if (e.touches.length === 2 && pinchRef.current) {
            e.preventDefault()
            const [a, b] = [e.touches[0], e.touches[1]]
            const dx = a.clientX - b.clientX
            const dy = a.clientY - b.clientY
            const dist = Math.hypot(dx, dy)
            // Clamp zoom scale between 1x and 3x
            const nextScale = Math.max(1, Math.min(3, pinchRef.current.baseScale * (dist / pinchRef.current.startDist)))
            setScale(nextScale)
            setZoom(nextScale > 1)
        } else if (e.touches.length === 1 && panRef.current && scale > 1) {
            e.preventDefault()
            const x = e.touches[0].clientX - panRef.current.x
            const y = e.touches[0].clientY - panRef.current.y
            // Compute bounds from the current image and its frame (parent)
            const img = e.currentTarget
            const frame = img.parentElement as HTMLElement | null
            const fw = frame?.clientWidth || 0
            const fh = frame?.clientHeight || 0
            const iw = img.naturalWidth || 0
            const ih = img.naturalHeight || 0
            const fit = iw && ih ? Math.min(fw / iw, fh / ih) : 1
            const baseW = iw * fit
            const baseH = ih * fit
            // Pan bounds based on scaled (zoomed) image vs frame size
            const scaledW = baseW * scale
            const scaledH = baseH * scale
            const maxX = Math.max(0, (scaledW - fw) / 2)
            const maxY = Math.max(0, (scaledH - fh) / 2)
            const nx = Math.max(-maxX, Math.min(maxX, x))
            const ny = Math.max(-maxY, Math.min(maxY, y))
            setTx(nx)
            setTy(ny)
        }
    }

    // Finish gesture; normalize state if zoom <= 1
    function onTouchEnd() {
        if (scale <= 1) {
            setScale(1); setTx(0); setTy(0); setZoom(false)
        }
        pinchRef.current = null
        panRef.current = null
    }

    React.useEffect(() => {
        // When slide changes, reset pan/zoom to avoid leftover offsets
        setScale(1); setTx(0); setTy(0); setZoom(false)
    }, [index])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="inset-0 left-0 top-0 h-screen w-screen translate-x-0 translate-y-0 max-w-none rounded-none border-0 bg-black/95 p-0 sm:max-w-none" showCloseButton>
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
                            <div key={`${im.url}-${i}`} className="min-w-0 h-full flex-[0_0_100%]">
                                {/* Frame that centers content and clips overflow */}
                                <div className="relative grid h-full w-full place-items-center overflow-hidden" style={{ touchAction: (zoom || scale > 1) ? 'none' : undefined }}>
                                    <img
                                        src={im.url}
                                        alt=""
                                        // Recenter on load
                                        onLoad={() => { setTx(0); setTy(0); if (scale <= 1) { setScale(1); setZoom(false) } }}
                                        onDoubleClick={() => { const nz = !zoom; setZoom(nz); setScale(nz ? Math.max(1.5, scale) : 1); if (!nz) { setTx(0); setTy(0) } }}
                                        onTouchStart={onTouchStart}
                                        onTouchMove={onTouchMove}
                                        onTouchEnd={onTouchEnd}
                                        className={`pointer-events-auto block max-h-full max-w-full object-contain select-none ${zoom || scale > 1 ? "cursor-grab" : ""} transition-transform duration-150`}
                                        style={{
                                            touchAction: (zoom || scale > 1) ? "none" : "pan-y",
                                            transformOrigin: "center center",
                                            willChange: (zoom || scale > 1) ? "transform" : undefined,
                                            transform: (zoom || scale > 1) ? `translate3d(${tx}px, ${ty}px, 0) scale(${scale})` : undefined,
                                        }}
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

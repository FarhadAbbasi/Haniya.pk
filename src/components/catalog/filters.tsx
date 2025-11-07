"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function CatalogFilters() {
  const [open, setOpen] = React.useState(false)
  const [min, setMin] = React.useState<string>("")
  const [max, setMax] = React.useState<string>("")

  React.useEffect(() => {
    const url = new URL(window.location.href)
    setMin(url.searchParams.get("min") || "")
    setMax(url.searchParams.get("max") || "")
  }, [])

  function apply() {
    const url = new URL(window.location.href)
    function setOrDel(key: string, val: string) {
      if (val && val.trim().length) url.searchParams.set(key, val.trim())
      else url.searchParams.delete(key)
    }
    setOrDel("min", min)
    setOrDel("max", max)
    window.location.href = url.toString()
  }

  function reset() {
    const url = new URL(window.location.href)
    url.searchParams.delete("min")
    url.searchParams.delete("max")
    window.location.href = url.toString()
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold tracking-tight">Filters</h2>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">Filters</Button>
        </SheetTrigger>
        <SheetContent side="right" className="sm:max-w-md p-6">
          <SheetHeader>
            <SheetTitle>Filter products</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-8">
            <div>
              <p className="mb-2 text-sm font-medium">Size</p>
              <div className="grid grid-cols-3 gap-2">
                {"S M L".split(" ").map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm">
                    <Checkbox /> <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Price (PKR)</p>
              <div className="flex items-center gap-2">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="min">Min</Label>
                  <Input id="min" placeholder="0" value={min} onChange={(e) => setMin(e.target.value)} />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="max">Max</Label>
                  <Input id="max" placeholder="10000" value={max} onChange={(e) => setMax(e.target.value)} />
                </div>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Color</p>
              <div className="grid grid-cols-3 gap-2">
                {["Black","White","Mustard","Teal"].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <Checkbox /> <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="w-full" onClick={apply}>Apply</Button>
              <Button variant="ghost" className="w-full" onClick={reset}>Reset</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

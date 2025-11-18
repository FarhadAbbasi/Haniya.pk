"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function SizeSelector({ sizes = [], onChange }: { sizes?: string[]; onChange?: (v: string) => void }) {
  const [value, setValue] = React.useState<string>(sizes[0] || "")
  React.useEffect(() => {
    if (!sizes || sizes.length === 0) return
    setValue((prev) => (prev && sizes.includes(prev) ? prev : sizes[0]))
  }, [sizes])
  if (!sizes || sizes.length === 0) return null
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => {
        setValue(v)
        onChange?.(v)
      }}
      className="grid grid-cols-4 gap-2"
    >
      {sizes.map((s) => (
        <div key={s} className="flex items-center gap-2 rounded-md border px-3 py-2">
          <RadioGroupItem value={s} id={`size-${s}`} />
          <Label htmlFor={`size-${s}`} className="text-sm">
            {s}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

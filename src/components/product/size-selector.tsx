"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function SizeSelector({ onChange }: { onChange?: (v: string) => void }) {
  const [value, setValue] = React.useState("M")
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => {
        setValue(v)
        onChange?.(v)
      }}
      className="grid grid-cols-4 gap-2"
    >
      {["XS","S","M","L","XL"].map((s) => (
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

"use client"

import * as React from "react"

export function SizeSelector({ sizes = [], onChange }: { sizes?: string[]; onChange?: (v: string) => void }) {
  const [value, setValue] = React.useState<string>(sizes[0] || "")
  React.useEffect(() => {
    if (!sizes || sizes.length === 0) return
    setValue((prev) => (prev && sizes.includes(prev) ? prev : sizes[0]))
  }, [sizes])
  if (!sizes || sizes.length === 0) return null
  return (
    <div className="grid grid-cols-4 gap-2">
      {sizes.map((s) => {
        const active = value === s
        return (
          <button
            key={s}
            type="button"
            aria-pressed={active}
            className={`rounded border px-3 py-2 text-xs tracking-wide ${active ? "border-black bg-black text-white" : "border-neutral-300 text-black hover:bg-neutral-100"}`}
            onClick={() => {
              setValue(s)
              onChange?.(s)
            }}
          >
            {s.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

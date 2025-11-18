"use client"

import * as React from "react"

export function AddVariantFormClient({ actionUrl, productId }: { actionUrl: string; productId: string }) {
  const [saving, setSaving] = React.useState(false)
  return (
    <form action={actionUrl} method="post" onSubmit={() => setSaving(true)} className="p-3 text-sm space-y-3">
      <input type="hidden" name="product_id" value={productId} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div>
          <label className="mb-1 block">Size</label>
          <select name="size" required className="w-full rounded border px-2 py-1">
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block">Color</label>
          <input name="color" placeholder="e.g. Black" className="w-full rounded border px-2 py-1" />
        </div>
        <div>
          <label className="mb-1 block">SKU</label>
          <input name="sku" placeholder="e.g. HNY-123" className="w-full rounded border px-2 py-1" />
        </div>
        <div>
          <label className="mb-1 block">Stock</label>
          <input name="stock" type="number" min={0} defaultValue={1} className="w-full rounded border px-2 py-1" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded bg-black px-3 py-1 text-xs font-medium text-white disabled:opacity-60 hover:cursor-pointer" disabled={saving}>
          {saving ? "Adding…" : "Add Variant"}
        </button>
      </div>
    </form>
  )
}

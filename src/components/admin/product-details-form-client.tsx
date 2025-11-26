"use client"

import * as React from "react"

export function ProductDetailsFormClient({
  actionUrl,
  initial,
}: {
  actionUrl: string
  initial: { title?: string; price?: number | null; compare_at_price?: number | null; currency?: string; is_sale?: boolean; is_new?: boolean; fabric?: string | null; description?: string | null; images?: string[] }
}) {
  const [saving, setSaving] = React.useState(false)
  return (
    <form action={actionUrl} method="post" encType="multipart/form-data" onSubmit={() => setSaving(true)} className="p-3 text-sm space-y-3">
      <div>
        <label className="mb-1 block">Title</label>
        <input name="title" defaultValue={initial.title || ""} className="w-full rounded border px-2 py-1" />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block">Price</label>
          <input name="price" type="number" step="0.01" defaultValue={initial.price != null ? String(initial.price) : ""} className="w-full rounded border px-2 py-1" />
        </div>
        <div>
          <label className="mb-1 block">Compare at price</label>
          <input name="compare_at_price" type="number" step="0.01" defaultValue={initial.compare_at_price != null ? String(initial.compare_at_price) : ""} className="w-full rounded border px-2 py-1" />
        </div>
        <div>
          <label className="mb-1 block">Currency</label>
          <input name="currency" defaultValue={initial.currency || "PKR"} className="w-full rounded border px-2 py-1" />
        </div>
        <div className="flex items-end gap-4">
          <label className="inline-flex items-center gap-2"><input type="checkbox" name="is_sale" defaultChecked={!!initial.is_sale} /> <span>Sale</span></label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" name="is_new" defaultChecked={!!initial.is_new} /> <span>New</span></label>
        </div>
      </div>
      <div>
        <label className="mb-1 block">Fabric</label>
        <input name="fabric" defaultValue={initial.fabric || ""} className="w-full rounded border px-2 py-1" />
      </div>
      <div>
        <label className="mb-1 block">Description</label>
        <textarea name="description" rows={4} defaultValue={initial.description || ""} className="w-full rounded border px-2 py-1" />
      </div>
      <div>
        <div className="mb-1 text-sm font-medium">Images</div>
        <p className="mb-2 text-xs text-neutral-600">Paste image URLs or upload files. If a file is uploaded, it will be used instead of the URL.</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-1">
              <label className="mb-1 block">Image {idx + 1}</label>
              <input name={`image${idx + 1}`} defaultValue={initial.images?.[idx] || ""} placeholder="https://..." className="w-full rounded border px-2 py-1" />
              <input name={`file${idx + 1}`} type="file" accept="image/*" className="w-full rounded border px-2 py-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded bg-black px-3 py-1 text-xs font-medium text-white disabled:opacity-60 hover:cursor-pointer" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  )
}

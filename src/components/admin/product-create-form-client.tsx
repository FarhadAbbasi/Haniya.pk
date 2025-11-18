"use client"

import * as React from "react"

export function ProductCreateFormClient({ actionUrl, categories }: { actionUrl: string; categories: Array<{ id: string; name: string }> }) {
  const [saving, setSaving] = React.useState(false)
  return (
    <form action={actionUrl} method="post" onSubmit={() => setSaving(true)} className="p-3 text-sm space-y-3">
      <div>
        <label className="mb-1 block">Title</label>
        <input name="title" required className="w-full rounded border px-2 py-1" />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block">Price</label>
          <input name="price" type="number" step="0.01" required className="w-full rounded border px-2 py-1" />
        </div>
        <div>
          <label className="mb-1 block">Compare at price</label>
          <input name="compare_at_price" type="number" step="0.01" className="w-full rounded border px-2 py-1" />
        </div>
        <div>
          <label className="mb-1 block">Currency</label>
          <input name="currency" defaultValue="PKR" className="w-full rounded border px-2 py-1" />
        </div>
        <div className="md:col-span-3">
          <label className="mb-1 block">Fabric</label>
          <input name="fabric" placeholder="e.g. Cotton, Lawn" className="w-full rounded border px-2 py-1" />
        </div>
        <div className="md:col-span-3">
          <label className="mb-1 block">Description</label>
          <textarea name="description" rows={4} className="w-full rounded border px-2 py-1" />
        </div>
        <div>
          <label className="mb-1 block">Category</label>
          <select name="category_id" className="w-full rounded border px-2 py-1">
            <option value="">— None —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="is_sale" /> <span>Sale</span></label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="is_new" /> <span>New</span></label>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx}>
            <label className="mb-1 block">Image URL {idx + 1} (optional)</label>
            <input name={`image${idx + 1}`} placeholder="https://..." className="w-full rounded border px-2 py-1" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded bg-black px-3 py-1 text-xs font-medium text-white disabled:opacity-60 hover:cursor-pointer" disabled={saving}>
          {saving ? "Saving…" : "Create Product"}
        </button>
      </div>
    </form>
  )
}

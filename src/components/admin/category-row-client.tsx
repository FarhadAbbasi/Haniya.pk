"use client"

import * as React from "react"

export function CategoryRowForm({ id, is_featured, position }: { id: string; is_featured?: boolean; position?: number | null }) {
  const [saving, setSaving] = React.useState(false)
  return (
    <form action={`/api/admin/categories/${id}`} method="post" onSubmit={() => setSaving(true)} className="flex items-center gap-3">
      <input type="hidden" name="_method" value="PATCH" />
      <input type="hidden" name="is_featured_present" value="1" />
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="is_featured" defaultChecked={!!is_featured} /> Featured</label>
      <input name="position" type="number" defaultValue={position ?? ""} className="w-24 rounded border px-2 py-1" />
      <button className="rounded border px-2 py-1 text-xs" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
    </form>
  )
}

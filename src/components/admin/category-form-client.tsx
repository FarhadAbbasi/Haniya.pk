"use client"

import * as React from "react"

export function CategoryFormClient({
  actionUrl,
  defaultCategoryId,
  options,
}: {
  actionUrl: string
  defaultCategoryId: string
  options: Array<{ id: string; name: string }>
}) {
  const [saving, setSaving] = React.useState(false)

  return (
    <form action={actionUrl} method="post" onSubmit={() => setSaving(true)} className="text-sm">
      <label className="mb-1 block">Select category</label>
      <select
        name="category_id"
        defaultValue={defaultCategoryId || ""}
        className="w-full rounded border px-2 py-1"
      >
        <option value="">— None —</option>
        {options.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        className="mt-3 rounded bg-black px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
        disabled={saving}
        type="submit"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  )
}

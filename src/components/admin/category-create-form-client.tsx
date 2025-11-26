"use client"

import * as React from "react"

export function CategoryCreateForm() {
  const [saving, setSaving] = React.useState(false)
  return (
    <form className="p-3 text-sm" action="/api/admin/categories" method="post" onSubmit={() => setSaving(true)}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block">Name</label>
          <input name="name" required className="w-full rounded border px-3 py-2" placeholder="Women" />
        </div>
        <div>
          <label className="mb-1 block">Slug</label>
          <input name="slug" required className="w-full rounded border px-3 py-2" placeholder="women" />
        </div>
      </div>
      <button className="mt-3 rounded bg-black px-3 py-2 text-xs font-medium text-white disabled:opacity-60" disabled={saving}>
        {saving ? "Creating…" : "Create"}
      </button>
    </form>
  )
}

"use client"

import * as React from "react"

export function CategoryManageFormClient() {
  const [saving, setSaving] = React.useState(false)
  return (
    <div className="space-y-3">
      <button className="rounded bg-black px-3 py-2 text-xs font-medium text-white disabled:opacity-60" disabled={saving}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  )
}

export function DeleteCategoryClient({ action }: { action: string }) {
  const [saving, setSaving] = React.useState(false)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm("Delete this category? This cannot be undone.")) {
      e.preventDefault()
      return
    }
    setSaving(true)
  }
  return (
    <form action={action} method="post" onSubmit={onSubmit}>
      <input type="hidden" name="_method" value="DELETE" />
      <button className="rounded border px-3 py-2 text-xs disabled:opacity-60" disabled={saving}>{saving ? "Deleting…" : "Delete Category"}</button>
    </form>
  )
}

"use client"

import * as React from "react"
import { toast } from "sonner"
import { Trash2Icon } from "lucide-react"

type Variant = {
  id: string
  size: string
  color?: string | null
  sku?: string | null
  stock: number
  is_active: boolean
}

export function VariantTableClient({ variants: initial }: { variants: Variant[] }) {
  const [rows, setRows] = React.useState<Variant[]>(initial)
  const [saving, setSaving] = React.useState<string | null>(null)
  const [removing, setRemoving] = React.useState<string | null>(null)

  async function updateStock(variantId: string, stock: number) {
    try {
      setSaving(variantId)
      const res = await fetch("/api/admin/variants/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stock, reason: "manual" }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to update stock")
      toast.success("Stock updated")
    } catch (e: any) {
      toast.error(e?.message || "Could not update stock")
    } finally {
      setSaving(null)
    }
  }
  async function deleteVariant(variantId: string) {
    const ok = window.confirm("Delete this variant?")
    if (!ok) return
    try {
      setRemoving(variantId)
      const res = await fetch("/api/admin/variants/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to delete variant")
      setRows((r) => r.filter((x) => x.id !== variantId))
      toast.success("Variant deleted")
    } catch (e: any) {
      toast.error(e?.message || "Could not delete variant")
    } finally {
      setRemoving(null)
    }
  }


  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="px-3 py-2">Size</th>
            <th className="px-3 py-2">Color</th>
            <th className="px-3 py-2">SKU</th>
            <th className="px-3 py-2">Stock</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="px-3 py-2">{v.size}</td>
              <td className="px-3 py-2">{v.color || "—"}</td>
              <td className="px-3 py-2 font-mono text-xs">{v.sku || "—"}</td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  min={0}
                  className="w-24 rounded border px-2 py-1"
                  value={v.stock}
                  onChange={(e) => {
                    const next = [...rows]
                    const idx = next.findIndex((r) => r.id === v.id)
                    next[idx] = { ...v, stock: Number(e.target.value) }
                    setRows(next)
                  }}
                />
              </td>
              <td className="px-3 py-2 flex items-center gap-2">
                <button
                  className="rounded bg-black px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
                  disabled={saving === v.id}
                  onClick={() => updateStock(v.id, v.stock)}
                >
                  {saving === v.id ? "Saving…" : "Save"}
                </button>
                <button
                  aria-label="Delete variant"
                  title="Delete"
                  className="rounded border px-2 py-1 text-xs hover:bg-neutral-50 disabled:opacity-60"
                  disabled={removing === v.id}
                  onClick={() => deleteVariant(v.id)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

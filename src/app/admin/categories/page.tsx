import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { CategoryRowForm, DeleteCategoryForm } from "@/components/admin/category-row-client"
import { CategoryCreateForm } from "@/components/admin/category-create-form-client"

export default async function AdminCategoriesPage() {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, is_featured, position")
    .order("is_featured", { ascending: false })
    .order("position", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">Add Category</div>
        <CategoryCreateForm />
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">All Categories</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Featured</th>
                <th className="px-3 py-2">Position</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(categories || []).map((c: any) => (
                <tr key={c.id} className="border-t">
                  <td className="px-3 py-2" colSpan={5}>
                    <div className="flex items-center justify-between gap-3">
                      <Link href={`/admin/categories/${c.id}`} className="flex flex-1 items-center gap-3 rounded px-1 py-1 hover:bg-neutral-50">
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-neutral-500">/{c.slug}</div>
                        </div>
                      </Link>
                      <CategoryRowForm id={String(c.id)} is_featured={!!c.is_featured} position={c.position as number | null} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

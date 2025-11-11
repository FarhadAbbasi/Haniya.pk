import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function AdminCategoriesPage() {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">Add Category</div>
        <form className="p-3 text-sm" action="/api/admin/categories" method="post">
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
          <button className="mt-3 rounded bg-black px-3 py-2 text-xs font-medium text-white">Create</button>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-3 text-sm font-medium">All Categories</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {(categories || []).map((c: any) => (
                <tr key={c.id} className="border-t">
                  <td className="px-3 py-2">{c.name}</td>
                  <td className="px-3 py-2">{c.slug}</td>
                  <td className="px-3 py-2 text-right">
                    <form action={`/api/admin/categories/${c.id}`} method="post">
                      <input type="hidden" name="_method" value="DELETE" />
                      <button className="rounded border px-2 py-1 text-xs">Delete</button>
                    </form>
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

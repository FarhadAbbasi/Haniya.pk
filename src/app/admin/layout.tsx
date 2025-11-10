import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  // DB-based RBAC: admin_users table
  let isAllowed = false
  if (user?.email) {
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id, role")
      .eq("email", user.email)
      .maybeSingle()
    if (adminRow) isAllowed = true
    // Fallback to env allowlist if DB row missing
    if (!isAllowed) {
      const allowList = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim()).filter(Boolean)
      if (allowList.length > 0 && allowList.includes(user.email)) isAllowed = true
    }
  }

  if (!isAllowed) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Admin Access Required</h1>
        <p className="text-muted-foreground">Sign in with an authorized admin account to continue.</p>
        <a href="/" className="mt-6 inline-block rounded-md border px-4 py-2 text-sm">Back to Home</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-white md:block">
          <div className="sticky top-0 h-screen p-4">
            <div className="mb-6 text-lg font-semibold">Admin</div>
            <nav className="space-y-1 text-sm">
              <Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin">Dashboard</Link>
              <Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/orders">Orders</Link>
              <Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/products">Products</Link>
              <Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/categories">Categories</Link>
              <Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/content">Content</Link>
              <Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/settings">Settings</Link>
            </nav>
          </div>
        </aside>
        <main className="min-w-0">
          <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="text-sm text-neutral-600">Haniya.pk Admin</div>
              <div className="text-xs text-neutral-500">Signed in as {user?.email}</div>
            </div>
          </header>
          <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

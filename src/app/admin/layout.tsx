import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { BarChart3, FileText, LayoutDashboard, Package, Settings as SettingsIcon, ShoppingCart, Tags, Bell } from "lucide-react"

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

  if (!isAllowed) redirect("/signin")

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-white md:block">
          <div className="sticky top-0 h-screen p-4">
            <div className="mb-6 text-lg font-semibold">Admin</div>
            <nav className="space-y-1 text-sm">
              <Link href="/admin" className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                <ShoppingCart className="h-4 w-4" />
                <span>Orders</span>
              </Link>
              <Link href="/admin/analytics" className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
              <Link href="/admin/products" className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                <Package className="h-4 w-4" />
                <span>Products</span>
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                <Tags className="h-4 w-4" />
                <span>Categories</span>
              </Link>
              <Link href="/admin/content" className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                <FileText className="h-4 w-4" />
                <span>Content</span>
              </Link>
              <Link href="/admin/notifications" className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </aside>
        <main className="min-w-0">
          <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="md:hidden"><AdminMobileNav /></div>
                <div className="hidden md:block text-sm text-neutral-600">Haniya.pk Admin</div>
              </div>
              <div className="text-xs text-neutral-500">Signed in as {user?.email}</div>
            </div>
          </header>
          <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

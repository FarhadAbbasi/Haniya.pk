"use client"

import * as React from "react"
import { MenuIcon, LayoutDashboard, ShoppingCart, BarChart3, Package, Tags, FileText, Settings as SettingsIcon } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import Link from "next/link"

export function AdminMobileNav() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Open menu" className="inline-flex items-center gap-2 rounded border px-2 py-1 text-sm hover:bg-neutral-100">
          <MenuIcon className="h-4 w-4" />
          Menu
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="inset-y-auto top-24 bottom-0 w-[60%] sm:w-80 rounded-r-lg p-0">
        <SheetHeader>
          <SheetTitle>Admin</SheetTitle>
        </SheetHeader>
        <nav className="mt-2 text-sm">
          <div className="overflow-hidden rounded-md border divide-y bg-white">
            <SheetClose asChild>
              <Link className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50" href="/admin">
                <LayoutDashboard className="h-4 w-4 text-neutral-600" />
                <span>Dashboard</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50" href="/admin/orders">
                <ShoppingCart className="h-4 w-4 text-neutral-600" />
                <span>Orders</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50" href="/admin/analytics">
                <BarChart3 className="h-4 w-4 text-neutral-600" />
                <span>Analytics</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50" href="/admin/products">
                <Package className="h-4 w-4 text-neutral-600" />
                <span>Products</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50" href="/admin/categories">
                <Tags className="h-4 w-4 text-neutral-600" />
                <span>Categories</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50" href="/admin/content">
                <FileText className="h-4 w-4 text-neutral-600" />
                <span>Content</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50" href="/admin/settings">
                <SettingsIcon className="h-4 w-4 text-neutral-600" />
                <span>Settings</span>
              </Link>
            </SheetClose>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

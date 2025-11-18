"use client"

import * as React from "react"
import { MenuIcon } from "lucide-react"
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
      <SheetContent side="left" className="inset-y-auto top-14 bottom-0 w-[85%] sm:max-w-xs rounded-r-lg">
        <SheetHeader>
          <SheetTitle>Admin</SheetTitle>
        </SheetHeader>
        <nav className="mt-4 space-y-1 text-sm">
          <SheetClose asChild><Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin">Dashboard</Link></SheetClose>
          <SheetClose asChild><Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/orders">Orders</Link></SheetClose>
          <SheetClose asChild><Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/analytics">Analytics</Link></SheetClose>
          <SheetClose asChild><Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/products">Products</Link></SheetClose>
          <SheetClose asChild><Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/categories">Categories</Link></SheetClose>
          <SheetClose asChild><Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/content">Content</Link></SheetClose>
          <SheetClose asChild><Link className="block rounded px-2 py-1 hover:bg-neutral-100" href="/admin/settings">Settings</Link></SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

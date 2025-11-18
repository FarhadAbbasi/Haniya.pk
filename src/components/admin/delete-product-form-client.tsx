"use client"

import * as React from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"

export function DeleteProductFormClient({ actionUrl }: { actionUrl: string }) {
  const [open, setOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  return (
    <div className="p-3 text-sm">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 hover:cursor-pointer">Delete Product</button>
        </DialogTrigger>
        <DialogContent aria-label="Delete product">
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>This action cannot be undone. This will permanently delete the product and its images.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded border px-3 py-1 text-xs">Cancel</button>
            </DialogClose>
            <form action={actionUrl} method="post" onSubmit={() => setDeleting(true)}>
              <input type="hidden" name="_method" value="DELETE" />
              <button className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-60 hover:bg-red-700 hover:cursor-pointer" disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

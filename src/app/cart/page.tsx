"use client"

import { useCart } from "@/store/cart"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const cart = useCart()
  const items = cart.items
  const subtotal = cart.total()
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Your Cart</h1>
      {items.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="divide-y overflow-hidden rounded-lg border bg-white">
              {items.map((i) => (
                <div key={i.id + i.variant} className="flex items-center justify-between p-4 text-sm">
                  <div className="flex items-center gap-3">
                    {i.image ? (
                      <img src={i.image} alt={i.title} className="h-16 w-12 rounded border object-contain bg-white" />
                    ) : (
                      <div className="h-16 w-12 rounded border bg-muted" />
                    )}
                    <div>
                      <Link href={`/p/${i.id}`} className="font-medium hover:underline">{i.title}</Link>
                      <p className="text-muted-foreground">Rs. {i.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded border">
                      <button className="px-3 py-1" onClick={() => cart.updateQty(i.id, i.qty - 1)}>-</button>
                      <span className="w-10 text-center">{i.qty}</span>
                      <button className="px-3 py-1" onClick={() => cart.updateQty(i.id, i.qty + 1)}>+</button>
                    </div>
                    <Button variant="ghost" onClick={() => cart.removeItem(i.id)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="overflow-hidden rounded-lg border bg-white">
              <div className="border-b p-3 text-sm font-medium">Summary</div>
              <div className="space-y-1 p-3 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
                <div className="text-muted-foreground">Shipping calculated at checkout</div>
                <Button asChild className="mt-2 w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="mt-2 w-full" onClick={() => cart.clear()}>Clear Cart</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

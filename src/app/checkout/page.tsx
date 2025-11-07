"use client"

import * as React from "react"
import { useCart } from "@/store/cart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getTcsRateQuote } from "@/lib/shipping/tcs"
import { initEasypaisaPayment } from "@/lib/payments/easypaisa"
import { toast } from "sonner"

export default function CheckoutPage() {
  const cart = useCart()
  const [address, setAddress] = React.useState({
    name: "",
    phone: "",
    city: "Karachi",
    line1: "",
  })
  const [shipping, setShipping] = React.useState<{ cost: number; currency: string } | null>(null)
  const [payment, setPayment] = React.useState<"cod" | "easypaisa">("cod")
  const subtotal = cart.total()
  const total = subtotal + (shipping?.cost || 0)

  async function quote() {
    try {
      const q = await getTcsRateQuote({ fromCity: "Karachi", toCity: address.city, weightKg: 1 })
      setShipping({ cost: q.cost, currency: q.currency })
      toast.success(`Shipping: ${q.currency} ${q.cost}`)
    } catch (e) {
      toast.error("Could not fetch shipping rate")
    }
  }

  async function placeOrder() {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    if (!shipping) {
      toast.error("Please calculate shipping")
      return
    }

    if (payment === "cod") {
      toast.success("Order placed with Cash on Delivery")
      // TODO: Save order in Supabase
    } else {
      try {
        const res = await initEasypaisaPayment({
          amount: total,
          orderId: `order_${Date.now()}`,
          customerPhone: address.phone,
          returnUrl: "/checkout",
          callbackUrl: "/api/payments/easypaisa/callback",
        })
        window.location.href = res.redirectUrl
      } catch (e) {
        toast.error("Easypaisa init failed")
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="space-y-3">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="line1">Address</Label>
              <Input id="line1" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button variant="outline" onClick={quote}>Calculate Shipping</Button>
            {shipping && <span className="text-sm">{shipping.currency} {shipping.cost}</span>}
          </div>

          <div className="mt-8">
            <p className="mb-2 text-sm font-medium">Payment</p>
            <RadioGroup value={payment} onValueChange={(v) => setPayment(v as any)} className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
                <RadioGroupItem value="cod" id="cod" /> <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
                <RadioGroupItem value="easypaisa" id="easypaisa" /> <span>Easypaisa</span>
              </label>
            </RadioGroup>
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="border-b p-3 text-sm font-medium">Order Summary</div>
            <div className="divide-y">
              {cart.items.map((i) => (
                <div key={i.id + i.variant} className="flex items-center justify-between p-3 text-sm">
                  <div>
                    <p className="font-medium">{i.title}</p>
                    <p className="text-muted-foreground">Qty {i.qty}</p>
                  </div>
                  <div>Rs. {(i.price * i.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1 p-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping ? `${shipping.currency} ${shipping.cost}` : "-"}</span></div>
              <div className="flex justify-between font-medium"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
            </div>
          </div>

          <Button className="mt-4 w-full" onClick={placeOrder}>Place Order</Button>
        </div>
      </div>
    </div>
  )
}

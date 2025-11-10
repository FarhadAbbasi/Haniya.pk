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
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const cart = useCart()
  const router = useRouter()
  const [address, setAddress] = React.useState({
    name: "",
    phone: "",
    email: "",
    city: "Karachi",
    line1: "",
  })
  const [shipping, setShipping] = React.useState<{ cost: number; currency: string } | null>(null)
  const [payment, setPayment] = React.useState<"cod" | "easypaisa">("cod")
  const [placing, setPlacing] = React.useState(false)
  const [emailing, setEmailing] = React.useState(false)
  const [orderId, setOrderId] = React.useState<string | null>(null)
  const subtotal = cart.total()
  const total = subtotal + (shipping?.cost || 0)

  async function quote() {
    // try {
    //   const q = await getTcsRateQuote({ fromCity: "Islamabad", toCity: address.city, weightKg: 1 })
    //   setShipping({ cost: q.cost, currency: q.currency })
    //   toast.success(`Shipping: ${q.currency} ${q.cost}`)
    // } catch (e) {
    //   toast.error("Could not fetch shipping rate")
    // }
    
    // For Flat shipping PKR 200
    setShipping({ cost: 200, currency: "PKR" })
    toast.success(`Shipping: PKR 200`)
  }

  async function placeOrder() {
    if (placing) return
    if (cart.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    if (!shipping) {
      toast.error("Please calculate shipping")
      return
    }

    if (payment === "cod") {
      try {
        setPlacing(true)
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart.items.map((i) => ({ id: i.id, title: i.title, qty: i.qty, price: i.price, image: i.image })),
            address,
            shipping,
            currency: "PKR",
          }),
        })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json?.error || "Could not place order")
        }
        const oid = json.id as string
        setOrderId(oid)
        toast.success("Order placed with Cash on Delivery")
        cart.clear()
        // Show email sending progress on checkout page, then redirect
        setEmailing(true)
        const start = Date.now()
        const timeoutMs = 30000
        async function poll() {
          try {
            const r = await fetch(`/api/orders/status?id=${encodeURIComponent(oid)}`, { cache: "no-store" })
            if (r.ok) {
              const j = await r.json()
              if (j.email_sent) {
                router.push(`/order/success?id=${oid}`)
                return
              }
            }
          } catch {}
          if (Date.now() - start > timeoutMs) {
            router.push(`/order/success?id=${oid}`)
            return
          }
          setTimeout(poll, 1500)
        }
        poll()
      } catch (e: any) {
        toast.error(e?.message || "Could not place order")
      } finally {
        setPlacing(false)
      }
    } else {
      try {
        setPlacing(true)
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
      } finally {
        setPlacing(false)
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
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

          <Button className="mt-4 w-full" disabled={placing} onClick={placeOrder}>
            {placing ? (
              <span className="inline-flex items-center gap-2">
                <span>Placing order</span>
                <span className="relative inline-flex h-1 w-6">
                  <span className="absolute left-0 animate-bounce [animation-delay:-200ms]">•</span>
                  <span className="absolute left-2 animate-bounce">•</span>
                  <span className="absolute left-4 animate-bounce [animation-delay:200ms]">•</span>
                </span>
              </span>
            ) : (
              <span className="hover:scale-105 hover:cursor-pointer">Place Order</span>
            )}
          </Button>

          {(orderId || emailing) && (
            <div className="mt-3 text-center text-xs text-muted-foreground">
              {emailing ? (
                <span className="inline-flex items-center gap-2">
                  <span>Sending confirmation email</span>
                  <span className="relative inline-flex h-1 w-6">
                    <span className="absolute left-0 animate-bounce [animation-delay:-200ms]">•</span>
                    <span className="absolute left-2 animate-bounce">•</span>
                    <span className="absolute left-4 animate-bounce [animation-delay:200ms]">•</span>
                  </span>
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

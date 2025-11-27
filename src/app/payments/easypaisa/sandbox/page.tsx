"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function EasypaisaSandboxPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const orderId = sp.get("orderId") || ""
  const amount = sp.get("amount") || ""
  const token = sp.get("token") || ""

  async function report(success: boolean) {
    if (!orderId) return
    try {
      await fetch("/api/payments/easypaisa/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, success, token }),
      })
      if (success) {
        router.push(`/order/success?id=${encodeURIComponent(orderId)}`)
      } else {
        router.push(`/checkout?orderId=${encodeURIComponent(orderId)}&status=failed`)
      }
    } catch {
      router.push(`/checkout?orderId=${encodeURIComponent(orderId)}&status=failed`)
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold">Easypaisa Sandbox</h1>
        <p className="mb-4 text-sm text-foreground/70">Simulated payment screen for development.</p>
        <div className="mb-4 space-y-1 text-sm">
          <div><span className="text-foreground/60">Order ID:</span> <span className="font-medium">{orderId || "-"}</span></div>
          <div><span className="text-foreground/60">Amount:</span> <span className="font-medium">Rs. {amount || "0"}</span></div>
          <div><span className="text-foreground/60">Token:</span> <span className="font-mono text-xs break-all">{token || "-"}</span></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => report(true)} className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:opacity-90">Confirm Payment</button>
          <button onClick={() => report(false)} className="rounded-md bg-rose-600 px-4 py-2 text-white hover:opacity-90">Fail Payment</button>
        </div>
        <p className="mt-4 text-xs text-foreground/60">Note: This is a mock flow. Replace with Easypaisa hosted checkout or embedded flow in production.</p>
      </div>
    </div>
  )
}

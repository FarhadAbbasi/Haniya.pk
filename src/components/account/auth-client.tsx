"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function AuthClient() {
  const supabase = createClient()
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
        },
      })
      if (error) throw error
      toast.success("Check your email for the sign-in link")
    } catch (err: any) {
      toast.error(err?.message || "Could not send magic link")
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="border-b p-4 text-sm font-medium">Sign In</div>
      <form onSubmit={signIn} className="p-4 text-sm">
        <label className="mb-1 block">Email</label>
        <input
          type="email"
          className="w-full rounded border px-3 py-2"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-3 inline-flex items-center rounded bg-black px-3 py-2 text-xs font-medium text-white disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send magic link"}
        </button>
        <button
          type="button"
          onClick={signOut}
          className="ml-2 inline-flex items-center rounded border px-3 py-2 text-xs"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}

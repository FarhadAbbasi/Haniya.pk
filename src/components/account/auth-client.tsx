"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function AuthClient({ redirectPath = "/account" }: { redirectPath?: string }) {
  const supabase = createClient()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<"password" | "magic">("password")
  const router = useRouter()

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    try {
      setLoading(true)
      if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success("Signed in")
        router.replace(redirectPath)
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: (() => {
              if (typeof window !== "undefined") {
                const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
                const base = isLocal
                  ? window.location.origin
                  : (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)
                const sanitized = base.replace(/\/$/, "")
                return `${sanitized}/auth/callback?next=${encodeURIComponent(redirectPath)}`
              }
              if (process.env.NEXT_PUBLIC_SITE_URL) {
                const sanitized = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
                return `${sanitized}/auth/callback?next=${encodeURIComponent(redirectPath)}`
              }
              return undefined
            })(),
          },
        })
        if (error) throw error
        toast.success("Check your email for the sign-in link")
      }
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
        {mode === "password" && (
          <>
            <label className="mb-1 mt-3 block">Password</label>
            <input
              type="password"
              className="w-full rounded border px-3 py-2"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-3 inline-flex items-center rounded bg-black px-3 py-2 text-xs font-medium text-white disabled:opacity-60"
        >
          {loading ? (mode === "password" ? "Signing…" : "Sending…") : (mode === "password" ? "Sign in" : "Send magic link")}
        </button>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "password" ? "magic" : "password"))}
          className="ml-2 inline-flex items-center rounded border px-3 py-2 text-xs"
        >
          {mode === "password" ? "Use magic link" : "Use password"}
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

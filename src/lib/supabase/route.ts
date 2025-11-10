import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export function createRouteClient(res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get() {
          return undefined as any
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 })
        },
      },
    }
  )
}

export function jsonWithCookies(res: NextResponse, body: any, init?: ResponseInit) {
  const r = NextResponse.json(body, init)
  const setCookie = res.headers.getSetCookie?.() || []
  for (const c of setCookie) r.headers.append("Set-Cookie", c)
  return r
}

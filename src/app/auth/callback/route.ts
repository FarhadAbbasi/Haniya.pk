import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") || "/"

  // If there's no code, just go to next
  if (!code) return NextResponse.redirect(next)

  // Build a redirect response we can attach cookies to
  const redirectRes = NextResponse.redirect(next)
  const supabase = await createRouteClient(redirectRes)

  // Exchange the code for a session and set cookies on the response
  await supabase.auth.exchangeCodeForSession(code)

  return redirectRes
}

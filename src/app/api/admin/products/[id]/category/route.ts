import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const reqUrl = new URL(req.url)
  const backUrl = new URL(`/admin/products/${id}`, reqUrl.origin)
  backUrl.searchParams.set("saved", "1")
  const signInUrl = new URL(`/signin`, reqUrl.origin)
  const redirectRes = NextResponse.redirect(backUrl)
  try {
    const supabase = await createRouteClient(redirectRes)
    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user?.email) return NextResponse.redirect(signInUrl)

    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("email", user.email)
      .maybeSingle()
    if (!adminRow) return NextResponse.redirect(signInUrl)

    const bodyText = await req.text()
    const paramsBody = new URLSearchParams(bodyText)
    const raw = (paramsBody.get("category_id") || "").trim()
    const category_id = raw === "" ? null : raw

    await supabase.from("products").update({ category_id }).eq("id", id)
    return redirectRes
  } catch {
    return redirectRes
  }
}

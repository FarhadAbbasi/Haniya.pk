import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Prepare a redirect back to the product page
  const redirectRes = NextResponse.redirect(`/admin/products/${id}`)

  try {
    const supabase = await createRouteClient(redirectRes)
    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user?.email) return NextResponse.redirect(`/signin`)

    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("email", user.email)
      .maybeSingle()
    if (!adminRow) return NextResponse.redirect(`/signin`)

    const body = await req.text()
    const paramsBody = new URLSearchParams(body)
    const selected = paramsBody.getAll("category_ids").map((v) => String(v).trim()).filter(Boolean)

    // Try many-to-many via product_categories; if table missing, fall back to single category_id
    try {
      // Clear previous links
      await supabase.from("product_categories").delete().eq("product_id", id)
      // Insert new links
      if (selected.length) {
        const rows = selected.map((cid) => ({ product_id: id, category_id: cid }))
        await supabase.from("product_categories").insert(rows)
      }
    } catch {
      // Fallback: update products.category_id with first or null
      const category_id = selected.length ? selected[0] : null
      await supabase.from("products").update({ category_id }).eq("id", id)
    }

    return redirectRes
  } catch {
    return redirectRes
  }
}

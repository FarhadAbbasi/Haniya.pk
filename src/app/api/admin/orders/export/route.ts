import { NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase/route"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const res = new NextResponse()
  const supabase = await createRouteClient(res)

  // RBAC
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("email", user.email)
    .maybeSingle()
  if (!adminRow) return NextResponse.json({ error: "forbidden" }, { status: 403 })

  const status = url.searchParams.get("status") || undefined
  const range = url.searchParams.get("range") || undefined
  const details = url.searchParams.get("details") === "1"

  let query = supabase
    .from("orders")
    .select("id, created_at, total, status, email_sent")
    .order("created_at", { ascending: false }) as any

  if (status && ["pending","confirmed","shipped","cancelled"].includes(status)) {
    query = query.eq("status", status)
  }
  if (range === "7" || range === "30") {
    const days = Number(range)
    const since = new Date()
    since.setDate(since.getDate() - days)
    since.setHours(0,0,0,0)
    query = query.gte("created_at", since.toISOString())
  }

  const { data: orders, error } = await query.limit(2000)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = orders || []
  let csvLines: string[] = []
  if (!details) {
    const header = ["id","created_at","total","status","email_sent"]
    csvLines = [header.join(",")]
    for (const o of rows) {
      const line = [
        o.id,
        new Date(o.created_at).toISOString(),
        String(o.total ?? ""),
        o.status ?? "",
        o.email_sent ? "sent" : "pending",
      ].map(v => typeof v === "string" && v.includes(",") ? `"${v.replace(/"/g, '""')}"` : String(v))
      csvLines.push(line.join(","))
    }
  } else {
    // Include order items as rows; repeat order cols per item and enrich with product title, category, and variant details via varient_id
    const header = [
      "order_id","created_at","order_total","status","email_sent",
      "product_id","product_title","category","variant_size","variant_color","sku","qty","price","item_total"
    ]
    csvLines = [header.join(",")]
    const orderIds = (rows as any[]).map((o) => o.id)
    // Detect variant FK column name
    let variantCol: "varient_id" | "variant_id" = "varient_id"
    try {
      const t = await supabase.from("order_items").select("varient_id").limit(1)
      if ((t as any).error) throw (t as any).error
      variantCol = "varient_id"
    } catch {
      variantCol = "variant_id"
    }
    let items: Array<{ order_id: string; product_id: string; [key: string]: any; qty: number; price: number }> = []
    if (orderIds.length) {
      const { data: fetchedItems } = await supabase
        .from("order_items")
        .select(["order_id","product_id",variantCol,"qty","price"].join(", "))
        .in("order_id", orderIds)
      items = (fetchedItems as any[]) || []
    }
    // Fetch products and categories
    const productIds = Array.from(new Set(items.map((it) => String(it.product_id)))).filter(Boolean)
    const productsById = new Map<string, { title?: string; category_id?: string | null }>()
    const categoriesById = new Map<string, string>()
    if (productIds.length) {
      const { data: prods } = await supabase
        .from("products")
        .select("id, title, category_id")
        .in("id", productIds)
      for (const p of (prods as any[]) || []) {
        productsById.set(String(p.id), { title: p.title, category_id: p.category_id })
      }
      const catIds = Array.from(new Set(Array.from(productsById.values()).map((p) => String(p.category_id || "")).filter(Boolean)))
      if (catIds.length) {
        const { data: cats } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", catIds)
        for (const c of (cats as any[]) || []) categoriesById.set(String(c.id), String(c.name))
      }
    }
    // Fetch variant rows for varient_id
    const varientIds = Array.from(new Set(items.map((it) => String((it as any)[variantCol] || "")).filter(Boolean)))
    const variantsById = new Map<string, { size?: string | null; color?: string | null; sku?: string | null }>()
    if (varientIds.length) {
      const { data: vars } = await supabase
        .from("product_variants")
        .select("id, size, color, sku")
        .in("id", varientIds)
      for (const v of (vars as any[]) || []) variantsById.set(String(v.id), { size: v.size, color: v.color, sku: v.sku })
    }
    // Group items by order
    const itemsByOrder = new Map<string, any[]>()
    for (const it of items as any[]) {
      const key = String(it.order_id)
      const arr = itemsByOrder.get(key) || []
      arr.push(it)
      itemsByOrder.set(key, arr)
    }
    for (const o of rows as any[]) {
      const list = itemsByOrder.get(String(o.id)) || [null]
      for (const it of list) {
        const prodMeta = it ? productsById.get(String(it.product_id)) : undefined
        const catName = prodMeta && prodMeta.category_id ? categoriesById.get(String(prodMeta.category_id)) : ""
        const vmeta = it && (it as any)[variantCol] ? variantsById.get(String((it as any)[variantCol])) : undefined
        const lineVals = [
          o.id,
          new Date(o.created_at).toISOString(),
          String(o.total ?? ""),
          o.status ?? "",
          o.email_sent ? "sent" : "pending",
          it ? String(it.product_id ?? "") : "",
          prodMeta?.title || "",
          catName || "",
          vmeta?.size || "",
          vmeta?.color || "",
          vmeta?.sku || "",
          it ? String(it.qty ?? "") : "",
          it ? String(it.price ?? "") : "",
          it ? String(Number(it.qty || 0) * Number(it.price || 0)) : "",
        ]
        const safe = lineVals.map(v => typeof v === "string" && v.includes(",") ? `"${v.replace(/"/g, '""')}"` : String(v))
        csvLines.push(safe.join(","))
      }
    }
  }
  const csv = csvLines.join("\n")

  const resp = new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=orders_export.csv`,
    },
  })
  // carry over any set-cookies from res
  const setCookies = res.headers.getSetCookie?.()
  if (setCookies && setCookies.length) {
    for (const c of setCookies) resp.headers.append("Set-Cookie", c)
  }
  return resp
}

import { searchProducts } from "@/lib/data/products"
import Link from "next/link"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const q = typeof sp?.q === "string" ? sp.q.trim() : ""
  const results = q ? await searchProducts(q) : []
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Search</h1>
      <p className="mb-6 text-muted-foreground">{q ? `Results for "${q}"` : "Enter a search query using the header search."}</p>
      {q && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {results.map((p: any) => (
            <Link key={p.id} href={`/p/${p.id}`} className="overflow-hidden rounded-lg border bg-white">
              {p.image ? (
                <img src={p.image} alt={p.title} className="aspect-[3/4] w-full object-contain bg-white" />
              ) : (
                <div className="aspect-[3/4] w-full bg-muted" />
              )}
              <div className="p-3">
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-sm">
                  {p.compare_at_price ? (
                    <span className="mr-2 text-muted-foreground line-through">{p.currency} {Number(p.compare_at_price).toLocaleString()}</span>
                  ) : null}
                  <span>{p.currency} {Number(p.price).toLocaleString()}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

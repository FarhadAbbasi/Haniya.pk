import { CatalogFilters } from "@/components/catalog/filters"
import { getProductsByCategorySlug } from "@/lib/data/products"
import Link from "next/link"
export const revalidate = 60

export default async function PrintedWinterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const min = typeof sp?.min === "string" ? Number(sp.min) : undefined
  const max = typeof sp?.max === "string" ? Number(sp.max) : undefined
  const q = typeof sp?.q === "string" ? sp.q : undefined
  const products = await getProductsByCategorySlug("printed-winter", { min, max, q })
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Printed — Winter Collection</h1>
      <p className="mb-6 text-muted-foreground">Warm, cozy prints for the season.</p>
      <CatalogFilters />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {products.map((p) => (
          <Link href={`/p/${(p as any).slug}`} key={p.id} className="group relative overflow-hidden rounded-lg border bg-white">
            {(p as any).image ? (
              <img src={(p as any).image} alt={p.title} className="aspect-[3/4] w-full object-contain bg-white transition-transform duration-300 ease-out group-hover:scale-105" />
            ) : (
              <div className="aspect-[3/4] w-full bg-muted" />
            )}
            {(p as any).is_sale ? (
              <div className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold uppercase text-white shadow">Sale</div>
            ) : null}
            <div className="p-3">
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-sm">
                {(p as any).compare_at_price ? (
                  <span className="mr-2 text-muted-foreground line-through">{p.currency} {Number((p as any).compare_at_price).toLocaleString()}</span>
                ) : null}
                <span>{p.currency} {Number((p as any).price).toLocaleString()}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

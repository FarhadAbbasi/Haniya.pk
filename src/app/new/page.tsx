import { getNewProducts } from "@/lib/data/products"
import { CatalogFilters } from "@/components/catalog/filters"
import Link from "next/link"
export const revalidate = 60

export default async function NewArrivalsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const min = typeof sp?.min === "string" ? Number(sp.min) : undefined
  const max = typeof sp?.max === "string" ? Number(sp.max) : undefined
  const products = await getNewProducts({ min, max })
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">New Arrivals</h1>
      <p className="mb-6 text-muted-foreground">Latest products marked as new.</p>
      <CatalogFilters />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {products.map((p: any) => (
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
    </div>
  )
}

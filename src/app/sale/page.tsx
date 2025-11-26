import { CatalogFilters } from "@/components/catalog/filters"
import { getSaleProducts } from "@/lib/data/products"
import Link from "next/link"
export const revalidate = 60

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const min = typeof sp?.min === "string" ? Number(sp.min) : undefined
  const max = typeof sp?.max === "string" ? Number(sp.max) : undefined
  const products = await getSaleProducts({ min, max })
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Sale</h1>
      <p className="mb-6 text-muted-foreground">Discounted picks you will love.</p>
      <CatalogFilters />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {products.map((p: any) => (
          <Link key={p.id} href={`/p/${p.id}`} className="relative overflow-hidden rounded-lg border bg-white">
            {p.image ? (
              <img src={p.image} alt={p.title} className="aspect-[3/4] w-full object-contain bg-white" />
            ) : (
              <div className="aspect-[3/4] w-full bg-muted" />
            )}
            <div className="pointer-events-none absolute right-4 top-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">Sale</div>
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

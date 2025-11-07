export const dynamic = "force-dynamic"
import { CatalogFilters } from "@/components/catalog/filters"
import { getProductsByCategorySlug } from "@/lib/data/products"

export default async function EmbroideryWinterPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const min = typeof searchParams?.min === "string" ? Number(searchParams.min) : undefined
  const max = typeof searchParams?.max === "string" ? Number(searchParams.max) : undefined
  const q = typeof searchParams?.q === "string" ? searchParams.q : undefined
  const products = await getProductsByCategorySlug("embroidery-winter", { min, max, q })
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Embroidery — Winter Collection</h1>
      <p className="mb-6 text-muted-foreground">Detailed embroidery for the winter season.</p>
      <CatalogFilters />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-lg border bg-white">
            {(p as any).image ? (
              <img src={(p as any).image} alt={p.title} className="aspect-[3/4] w-full object-cover" />
            ) : (
              <div className="aspect-[3/4] w-full bg-muted" />
            )}
            <div className="p-3">
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-sm text-muted-foreground">{p.currency} {p.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

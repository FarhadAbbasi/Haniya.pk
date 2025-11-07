import { getLatestProducts } from "@/lib/data/products"

export default async function NewArrivalsPage() {
  const products = await getLatestProducts(4)
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">New Arrivals</h1>
      <p className="mb-6 text-muted-foreground">Latest 4 products.</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {products.map((p: any) => (
          <a key={p.id} href={`/p/${p.id}`} className="overflow-hidden rounded-lg border bg-white">
            {p.image ? (
              <img src={p.image} alt={p.title} className="aspect-[3/4] w-full object-cover" />
            ) : (
              <div className="aspect-[3/4] w-full bg-muted" />
            )}
            <div className="p-3">
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-sm text-muted-foreground">{p.currency} {Number(p.price).toLocaleString()}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, Phone, Shield } from "lucide-react";
import { getLatestProducts } from "@/lib/data/products";
import { getCategoryLead } from "@/lib/data/products";
import { createClient } from "@/lib/supabase/server";
// import VapiWidget from "@/components/site/vapi-widget";

function ProductCard({ href, title, price, compareAtPrice, image }: { href: string; title: string; price: string; compareAtPrice?: string; image?: string }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-lg border bg-white">
      {image ? (
        <img src={image} alt={title} className="aspect-[3/4] w-full object-cover bg-white transition-transform duration-1000 ease-out group-hover:scale-105" />
      ) : (
        <div className="aspect-[4/5] w-full bg-gradient-to-b from-muted to-muted/60" />
      )}
      <div className="p-3">
        <p className="text-sm uppercase tracking-[0.1em] font-medium drop-shado"> {title} </p>
        <p className="text-sm">
          {compareAtPrice ? (
            <span className="mr-2 text-muted-foreground line-through">{compareAtPrice}</span>
          ) : null}
          <span>{price}</span>
        </p>
      </div>
    </Link>
  );
}

async function CollectionTiles() {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, created_at, is_featured, position, featured_image_url, featured_image_id")
    .order("is_featured", { ascending: false })
    .order("position", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  const all = (categories || []).map((c: any) => ({ id: String(c.id), name: String(c.name), slug: String(c.slug), is_featured: !!c.is_featured, position: c.position as number | null, featured_image_url: c.featured_image_url as string | null, featured_image_id: c.featured_image_id as string | null }))

  const lower = (s: string) => s.toLowerCase()
  const isPrintedLawn = (n: string) => /printed/.test(lower(n)) && /lawn/.test(lower(n))
  const isPrintedWinter = (n: string) => /printed/.test(lower(n)) && /winter/.test(lower(n))
  const isEmbLawn = (n: string) => /embroi?d/.test(lower(n)) && /lawn/.test(lower(n))
  const isEmbWinter = (n: string) => /embroi?d/.test(lower(n)) && /winter/.test(lower(n))
  const isNew = (n: string) => /new\s*arrival/.test(lower(n))
  const isSale = (n: string) => /sale/.test(lower(n))
  const routeFor = (c: { name: string; slug: string }) => {
    if (isPrintedLawn(c.name)) return "/printed/lawn"
    if (isPrintedWinter(c.name)) return "/printed/winter"
    if (isEmbLawn(c.name)) return "/embroidery/lawn"
    if (isEmbWinter(c.name)) return "/embroidery/winter"
    return `/category/${c.slug}`
  }

  // Exclude New Arrivals and Sale from homepage tiles
  const filtered = all.filter(c => !isNew(c.name) && !isSale(c.name))
  // Take first 4
  const cats = filtered.slice(0, 4)

  const leads = await Promise.all(cats.map((c) => getCategoryLead(c.slug)))
  // Resolve featured_image_id URLs in one go
  const imageIds = cats.map(c => c.featured_image_id).filter(Boolean) as string[]
  let featuredById = new Map<string, string>()
  if (imageIds.length) {
    const { data: imgs } = await supabase
      .from("product_images")
      .select("id, url")
      .in("id", imageIds)
    for (const im of imgs || []) {
      featuredById.set(String((im as any).id), String((im as any).url))
    }
  }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
      {cats.map((c, i) => {
        const lead: any = leads[i]
        let image = c.featured_image_url || undefined
        if (!image) image = (c.featured_image_id && featuredById.get(c.featured_image_id)) || undefined
        if (!image) image = lead?.image as string | undefined
        return (
          <Link key={c.id} href={routeFor(c)} className="group relative overflow-hidden rounded-lg border bg-white">
            {image ? (
              <img src={image} alt={c.name} className="aspect-[2/3] w-full object-cover bg-white transition-transform duration-1200 ease-out group-hover:scale-105" />
            ) : (
              <div className="aspect-[4/5] w-full bg-muted" />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-sm uppercase tracking-[0.2em] font-medium text-white drop-shadow">{c.name}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// Rebuild this page at most once every 60s (ISR)
export const revalidate = 60

export default async function Home() {
  const products = await getLatestProducts(4)

  return (
    <div className="flex flex-col">
      {/* Full-bleed hero */}
      <section className="relative isolate w-full min-h-[60dvh] md:min-h-[70dvh]">
        {/* Background gradient fallback */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/40" />
        {/* Optional background image (place /public/hero.jpg to activate) */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-no-repeat bg-top md:hidden"
          // style={{ backgroundImage: "url('/Hero-Mob.jpg')" }}
          // style={{ backgroundImage: "url('/Hero-Mob1.jpg')" }}
          style={{ backgroundImage: "url('/Hero-Mob1.png')" }}
        />
        <div
          className="absolute inset-0 -z-10 hidden md:block bg-cover bg-no-repeat bg-cover"
          style={{ backgroundImage: "url('/Hero-Desk.jpg')" }}
        />
        <div className="items-end justify-start min-h-[60dvh] mx-auto flex w-full max-w-7xl items-center px-4 py-12 md:py-16">
          <div className="align-center justify-between min-h-[50dvh] flex flex-col max-w-2xl space-y-5 md:space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/80">New Season</p>
            <h1 className="hidden md:block text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl  text-foreground/80">
              Luxury Lawn & Winter Collections

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
            </h1>
            <p className="max-w-prose hidden md:block text-sm md:text-base text-foreground/70">
              Timeless designs with modern silhouettes. Crafted in premium fabrics for comfort in every season.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="default">
                <Link href="/new">Shop New Arrivals</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sale">View Sale</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Collection image tiles */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-12">
        <CollectionTiles />
      </section>

      {/* New Arrivals grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">New Arrivals</h2>
          <Link href="/new" className="text-sm hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {products.map((p: any) => (
            <ProductCard
              key={p.id}
              href={`/p/${p.slug}`}
              title={p.title}
              price={`${p.currency} ${Number(p.price).toLocaleString()}`}
              compareAtPrice={p.compare_at_price ? `${p.currency} ${Number(p.compare_at_price).toLocaleString()}` : undefined}
              image={p.image}
            />
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 text-sm md:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5" />
            <div>
              <p className="font-medium">TCS Shipping</p>
              <p className="opacity-90">Fast nationwide delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5" />
            <div>
              <p className="font-medium">Easypaisa & COD</p>
              <p className="opacity-90">Secure & convenient payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5" />
            <div>
              <p className="font-medium">Need help?</p>
              <p className="opacity-90">WhatsApp: 0092 317-2956790</p>
            </div>
          </div>
        </div>
      </section>

      {/* Styled By You (coming soon) */}
      <section className="relative isolate w-full">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/40" />
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-12">
          <div className="text-center text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.28em] opacity-80">Community</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Styled By You</h2>
            <p className="mt-3 text-white/70">Real looks from our customers — share your fit and get featured.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            <div className="h-28 rounded-lg bg-white/10 backdrop-blur-sm" />
            <div className="h-28 rounded-lg bg-white/10 backdrop-blur-sm" />
            <div className="h-28 rounded-lg bg-white/10 backdrop-blur-sm" />
            <div className="h-28 rounded-lg bg-white/10 backdrop-blur-sm" />
            <div className="h-28 rounded-lg bg-white/10 backdrop-blur-sm" />
            <div className="h-28 rounded-lg bg-white/10 backdrop-blur-sm" />
          </div>
          <div className="mt-10 text-center">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-gray-900/90 ring-1 ring-inset ring-gray-900/50">
              coming soon…
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

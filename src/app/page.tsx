import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, Phone, Shield } from "lucide-react";
import { getLatestProducts } from "@/lib/data/products";
import { getCategoryLead } from "@/lib/data/products";

function ProductCard({ href, title, price, compareAtPrice, image }: { href: string; title: string; price: string; compareAtPrice?: string; image?: string }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-lg border bg-white">
      {image ? (
        <img src={image} alt={title} className="aspect-[3/4] w-full object-contain bg-white" />
      ) : (
        <div className="aspect-[3/4] w-full bg-gradient-to-b from-muted to-muted/60" />
      )}
      <div className="p-3">
        <p className="text-sm font-medium">{title}</p>
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
  const slugs = ["printed-lawn", "printed-winter", "embroidery-lawn", "embroidery-winter"] as const
  const titles: Record<typeof slugs[number], string> = {
    "printed-lawn": "Printed Lawn",
    "printed-winter": "Printed Winter",
    "embroidery-lawn": "Embroidery Lawn",
    "embroidery-winter": "Embroidery Winter",
  }
  const hrefs: Record<typeof slugs[number], string> = {
    "printed-lawn": "/printed/lawn",
    "printed-winter": "/printed/winter",
    "embroidery-lawn": "/embroidery/lawn",
    "embroidery-winter": "/embroidery/winter",
  }
  const leads = await Promise.all(slugs.map((s) => getCategoryLead(s)))
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
      {slugs.map((slug, i) => {
        const lead: any = leads[i]
        const image = lead?.image as string | undefined
        return (
          <Link key={slug} href={hrefs[slug]} className="group relative overflow-hidden rounded-lg border bg-white">
            {image ? (
              <img src={image} alt={titles[slug]} className="aspect-[3/4] w-full object-contain bg-white" />
            ) : (
              <div className="aspect-[3/4] w-full bg-muted" />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-sm font-medium text-white drop-shadow">{titles[slug]}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default async function Home() {
  const products = await getLatestProducts(4)

  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col">
      {/* Full-bleed hero */}
      <section className="relative isolate w-full">
        {/* Background gradient fallback */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/40" />
        {/* Optional background image (place /public/hero.jpg to activate) */}
        <div
          className="absolute inset-0 -z-10 bg-contain bg-no-repeat bg-top md:bg-cover"
          style={{ backgroundImage: "url('/Hero.jpg'), url('/hero.jpg')" }}
        />
        <div className="mx-auto flex min-h-[35vh]  w-full max-w-7xl items-center px-4 py-12 md:min-h-[70vh] md:py-16">
          <div className="max-w-2xl space-y-5 md:space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/80">New Season</p>
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Luxury Lawn & Winter Collections
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
            </h1>
            <p className="max-w-prose hidden md:block text-sm md:text-base text-foreground/80">
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
              href={`/p/${p.id}`}
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
    </div>
  );
}

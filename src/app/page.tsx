import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, Phone, Shield } from "lucide-react";
import { getLatestProducts } from "@/lib/data/products";

function ProductCard({ href, title, price, image }: { href: string; title: string; price: string; image?: string }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-lg border bg-white">
      {image ? (
        <img src={image} alt={title} className="aspect-[3/4] w-full object-cover" />
      ) : (
        <div className="aspect-[3/4] w-full bg-gradient-to-b from-muted to-muted/60" />
      )}
      <div className="p-3">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{price}</p>
      </div>
    </Link>
  );
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
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/Hero.jpg'), url('/hero.jpg')" }}
        />
        <div className="mx-auto flex min-h-[55vh] w-full max-w-7xl items-center px-4 py-12 md:min-h-[70vh] md:py-16">
          <div className="max-w-2xl space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/80">New Season</p>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Luxury Lawn & Winter Collections
            </h1>
            <p className="max-w-prose text-base text-foreground/80">
              Timeless designs with modern silhouettes. Crafted in premium fabrics for comfort in every season.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/new">Shop New Arrivals</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sale">View Sale</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-12">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <Link href="/printed/lawn" className="rounded-lg border bg-white p-6 text-center hover:shadow-sm">
            <p className="text-sm font-medium">Printed Lawn</p>
          </Link>
          <Link href="/printed/winter" className="rounded-lg border bg-white p-6 text-center hover:shadow-sm">
            <p className="text-sm font-medium">Printed Winter</p>
          </Link>
          <Link href="/embroidery/lawn" className="rounded-lg border bg-white p-6 text-center hover:shadow-sm">
            <p className="text-sm font-medium">Embroidery Lawn</p>
          </Link>
          <Link href="/sale" className="rounded-lg border bg-white p-6 text-center hover:shadow-sm">
            <p className="text-sm font-medium">Sale</p>
          </Link>
        </div>
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
              image={p.image}
            />
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <section className="border-t bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 text-sm md:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5" />
            <div>
              <p className="font-medium">TCS Shipping</p>
              <p className="text-muted-foreground">Fast nationwide delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5" />
            <div>
              <p className="font-medium">Easypaisa & COD</p>
              <p className="text-muted-foreground">Secure & convenient payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5" />
            <div>
              <p className="font-medium">Need help?</p>
              <p className="text-muted-foreground">WhatsApp: 0092 317-2956790</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

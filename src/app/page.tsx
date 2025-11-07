import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col">
      <section className="relative isolate">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">New Season</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Modern Lawn, Khaddar, and Cotton Suits
            </h1>
            <p className="max-w-prose text-base text-muted-foreground">
              Elegant everyday wear tailored for comfort. Discover fresh prints and premium fabrics designed for Pakistan’s seasons.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/category/new">Shop New Arrivals</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/category/lawn">Lawn</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/category/khaddar">Khaddar</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/category/cotton">Cotton</Link>
              </Button>
            </div>
          </div>
          <div className="aspect-[4/5] w-full rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/20" />
        </div>
      </section>
    </div>
  );
}

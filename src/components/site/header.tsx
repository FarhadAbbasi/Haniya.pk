import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, User, Search, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchInline } from "@/components/search/search-inline"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/server"

export default async function Header() {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true })
  const cats = (categories || []).map((c: any) => ({ id: String(c.id), name: String(c.name), slug: String(c.slug) }))

  // Grouping: New Arrival, extras, Printed (lawn, winter), Embroidery (lawn, winter), Sale
  const lower = (s: string) => s.toLowerCase()
  const isNew = (n: string) => /new\s*arrival/.test(lower(n))
  const isSale = (n: string) => /sale/.test(lower(n))
  const isPrintedLawn = (n: string) => /printed/.test(lower(n)) && /lawn/.test(lower(n))
  const isPrintedWinter = (n: string) => /printed/.test(lower(n)) && /winter/.test(lower(n))
  const isEmbLawn = (n: string) => /embroi?d/.test(lower(n)) && /lawn/.test(lower(n))
  const isEmbWinter = (n: string) => /embroi?d/.test(lower(n)) && /winter/.test(lower(n))

  const pick = (pred: (n: string) => boolean) => cats.find(c => pred(c.name))
  const newCat = pick(isNew)
  const saleCat = pick(isSale)
  const printedLawn = pick(isPrintedLawn)
  const printedWinter = pick(isPrintedWinter)
  const embLawn = pick(isEmbLawn)
  const embWinter = pick(isEmbWinter)
  const usedIds = new Set([newCat?.id, saleCat?.id, printedLawn?.id, printedWinter?.id, embLawn?.id, embWinter?.id].filter(Boolean) as string[])
  const extras = cats.filter(c => !usedIds.has(c.id)).sort((a,b) => a.name.localeCompare(b.name))

  const routeFor = (c: { name: string; slug: string }) => {
    const n = lower(c.name)
    if (isNew(c.name)) return "/new"
    if (isSale(c.name)) return "/sale"
    if (isPrintedLawn(c.name)) return "/printed/lawn"
    if (isPrintedWinter(c.name)) return "/printed/winter"
    if (isEmbLawn(c.name)) return "/embroidery/lawn"
    if (isEmbWinter(c.name)) return "/embroidery/winter"
    return `/category/${c.slug}`
  }

  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="h-24 w-24 rounded rounded-xl inline-flex items-center justify-center" aria-label="HANIYA.PK">
          <Image src="/logo.png" alt="HANIYA.PK" width={80} height={80} className="h-24 w-24 object-contain" priority />
          {/* <Image src="/logo.jpg" alt="HANIYA.PK" width={80} height={80} className="h-24 w-24  object-contain" priority /> */}
        </Link>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-2">
            {newCat ? (
              <li key={newCat.id}>
                <Link href={routeFor(newCat)} className="px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground">New Arrivals</Link>
              </li>
            ) : null}

            {extras.map((c) => (
              <li key={c.id}>
                <Link href={routeFor(c)} className="px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground">{c.name}</Link>
              </li>
            ))}

            {(printedLawn || printedWinter) ? (
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground cursor-pointer inline-flex items-center gap-1 data-[state=open]:underline">
                    Printed <ChevronDown className="h-3.5 w-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {printedLawn ? (
                      <DropdownMenuItem asChild className="hover:underline focus:underline hover:bg-transparent focus:bg-transparent hover:text-foreground focus:text-foreground">
                        <Link href={routeFor(printedLawn)}>Lawn</Link>
                      </DropdownMenuItem>
                    ) : null}
                    {printedWinter ? (
                      <DropdownMenuItem asChild className="hover:underline focus:underline hover:bg-transparent focus:bg-transparent hover:text-foreground focus:text-foreground">
                        <Link href={routeFor(printedWinter)}>Winter Collection</Link>
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ) : null}

            {(embLawn || embWinter) ? (
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground cursor-pointer inline-flex items-center gap-1 data-[state=open]:underline">
                    Embroidery <ChevronDown className="h-3.5 w-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {embLawn ? (
                      <DropdownMenuItem asChild className="hover:underline focus:underline hover:bg-transparent focus:bg-transparent hover:text-foreground focus:text-foreground">
                        <Link href={routeFor(embLawn)}>Lawn</Link>
                      </DropdownMenuItem>
                    ) : null}
                    {embWinter ? (
                      <DropdownMenuItem asChild className="hover:underline focus:underline hover:bg-transparent focus:bg-transparent hover:text-foreground focus:text-foreground">
                        <Link href={routeFor(embWinter)}>Winter Collection</Link>
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ) : null}

            {saleCat ? (
              <li key={saleCat.id}>
                <Link href={routeFor(saleCat)} className="px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground">Sale</Link>
              </li>
            ) : null}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <SearchInline>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
          </SearchInline>
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="border-b p-4">
                <Link href="/" className="text-xl font-light tracking-tight">HANIYA.PK</Link>
              </div>
              <div className="p-4 space-y-1 text-sm">
                {newCat ? (
                  <Link href={routeFor(newCat)} className="block px-2 py-2">New Arrivals</Link>
                ) : null}
                {extras.length ? (
                  <div>
                    <div className="mt-2 px-2 py-2 font-medium">Categories</div>
                    <div className="ml-2 space-y-1">
                      {extras.map((c) => (
                        <Link key={c.id} href={routeFor(c)} className="block px-2 py-1">{c.name}</Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                {(printedLawn || printedWinter) ? (
                  <div>
                    <div className="mt-3 px-2 py-2 font-medium">Printed</div>
                    <div className="ml-2 space-y-1">
                      {printedLawn ? (<Link href={routeFor(printedLawn)} className="block px-2 py-1">Lawn</Link>) : null}
                      {printedWinter ? (<Link href={routeFor(printedWinter)} className="block px-2 py-1">Winter Collection</Link>) : null}
                    </div>
                  </div>
                ) : null}
                {(embLawn || embWinter) ? (
                  <div>
                    <div className="mt-3 px-2 py-2 font-medium">Embroidery</div>
                    <div className="ml-2 space-y-1">
                      {embLawn ? (<Link href={routeFor(embLawn)} className="block px-2 py-1">Lawn</Link>) : null}
                      {embWinter ? (<Link href={routeFor(embWinter)} className="block px-2 py-1">Winter Collection</Link>) : null}
                    </div>
                  </div>
                ) : null}
                {saleCat ? (
                  <Link href={routeFor(saleCat)} className="block px-2 py-2 mt-3">Sale</Link>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

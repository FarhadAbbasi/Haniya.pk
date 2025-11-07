import Link from "next/link"
import { ShoppingBag, User, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchInline } from "@/components/search/search-inline"

export default function Header() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-2xl font-light tracking-tight">
          HANIYA.PK
        </Link>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-2">
            <li>
              <Link href="/new" className="px-3 py-2 text-sm  text-foreground/80 transition-colors hover:text-foreground">
                New Arrivals
              </Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground cursor-pointer inline-flex items-center gap-1 data-[state=open]:underline">
                  Printed <ChevronDown className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild className="hover:underline focus:underline hover:bg-transparent focus:bg-transparent hover:text-foreground focus:text-foreground">
                    <Link href="/printed/lawn">Lawn</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:underline focus:underline hover:bg-transparent focus:bg-transparent hover:text-foreground focus:text-foreground">
                    <Link href="/printed/winter">Winter Collection</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground cursor-pointer inline-flex items-center gap-1 data-[state=open]:underline">
                  Embroidery <ChevronDown className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild className="hover:underline focus:underline hover:bg-transparent focus:bg-transparent hover:text-foreground focus:text-foreground">
                    <Link href="/embroidery/lawn">Lawn</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:underline focus:underline hover:bg-transparent focus:bg-transparent hover:text-foreground focus:text-foreground">
                    <Link href="/embroidery/winter">Winter Collection</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link href="/sale" className="px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground">
                Sale
              </Link>
            </li>
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
      </div>
    </header>
  )
}

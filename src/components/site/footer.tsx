import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Haniya.pk. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/policies/privacy" className="hover:underline">Privacy</Link>
            <Link href="/policies/returns" className="hover:underline">Returns</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"

export default function EmbroideryIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Embroidery</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <Link href="/embroidery/lawn" className="rounded-lg border bg-white p-6 text-center hover:shadow-sm">
          <p className="text-sm font-medium">Lawn</p>
        </Link>
        <Link href="/embroidery/winter" className="rounded-lg border bg-white p-6 text-center hover:shadow-sm">
          <p className="text-sm font-medium">Winter Collection</p>
        </Link>
      </div>
    </div>
  )
}

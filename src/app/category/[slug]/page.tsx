import Link from "next/link"

interface Props {
  params: { slug: string }
}

export default function CategoryPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{params.slug}</span>
      </div>
      <h1 className="mb-4 text-3xl font-semibold capitalize tracking-tight">{params.slug}</h1>
      <p className="text-muted-foreground">Products for this category will appear here.</p>
    </div>
  )
}

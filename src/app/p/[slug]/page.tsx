export const dynamic = "force-dynamic"
import { PdpClient } from "@/components/product/pdp-client"
import { getProductBySlug, getProductById, getProductByTitleLike } from "@/lib/data/products"
import { notFound } from "next/navigation"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let product = await getProductBySlug(slug)
  if (!product) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug)
    if (isUuid) {
      product = await getProductById(slug)
    } else {
      const guess = slug.replace(/-/g, " ")
      product = await getProductByTitleLike(guess)
    }
  }
  if (!product) return notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <PdpClient id={product.id} title={product.title} price={Number(product.price)} images={product.images} />
    </div>
  )
}

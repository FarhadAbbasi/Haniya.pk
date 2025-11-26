export const revalidate = 60
import { PdpClient } from "@/components/product/pdp-client"
import { RelatedProducts } from "@/components/product/related-products"
import { RecentlyViewed } from "@/components/product/recently-viewed"
import { getProductBySlug, getProductById, getProductByTitleLike, getRelatedProducts, getRelatedByPrice } from "@/lib/data/products"
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

  const related = await getRelatedProducts(product.id, 12)
  const relatedByPrice = await getRelatedByPrice(product.id, 0.2, 12)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <PdpClient
        id={product.id}
        title={product.title}
        price={Number(product.price)}
        compareAtPrice={product.compare_at_price ? Number(product.compare_at_price) : undefined}
        currency={product.currency as any}
        isSale={Boolean((product as any).is_sale)}
        fabric={(product as any).fabric}
        description={(product as any).description}
        images={product.images}
      />

      <RelatedProducts items={related as any} heading="You may also like" />
      <RelatedProducts items={relatedByPrice as any} heading="Similar price range" />
      <RecentlyViewed currentId={product.id} heading="Recently viewed" />
    </div>
  )
}

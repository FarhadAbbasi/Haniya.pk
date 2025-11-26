"use client"

import * as React from "react"
import Link from "next/link"

type Item = {
  id: string
  slug: string
  title: string
  price: number
  compare_at_price?: number | null
  currency: string
  image?: string
}

export function RelatedProducts({ items, heading = "You may also like" }: { items: Item[]; heading?: string }) {
  if (!items || items.length === 0) return null
  const many = items.length > 4
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
        <span className="hidden text-xs text-neutral-500 md:block">Curated for you</span>
      </div>

      <div className="md:hidden">
        <div className="-mx-4 overflow-x-auto px-4 pb-1">
          <div className="flex snap-x snap-mandatory gap-4">
            {items.map((p) => (
              <Link key={p.id} href={`/p/${p.slug}`} className="w-44 shrink-0 snap-start overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-200 hover:scale-105" />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-sm font-medium leading-snug">{p.title}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-semibold">{p.currency} {Number(p.price).toLocaleString()}</span>
                    {p.compare_at_price ? (
                      <span className="text-xs text-neutral-500 line-through">{p.currency} {Number(p.compare_at_price).toLocaleString()}</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop */}
      {!many ? (
        <div className="hidden md:grid md:grid-cols-4 md:gap-6">
          {items.map((p) => (
            <Link key={p.id} href={`/p/${p.slug}`} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <div className="p-4">
                <div className="line-clamp-2 text-sm font-medium leading-snug">{p.title}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{p.currency} {Number(p.price).toLocaleString()}</span>
                  {p.compare_at_price ? (
                    <span className="text-xs text-neutral-500 line-through">{p.currency} {Number(p.compare_at_price).toLocaleString()}</span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="hidden md:block">
          <div className="-mx-4 overflow-x-auto px-4 pb-1">
            <div className="flex gap-4">
              {items.map((p) => (
                <Link key={p.id} href={`/p/${p.slug}`} className="w-60 shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-200 hover:scale-105" />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="line-clamp-2 text-sm font-medium leading-snug">{p.title}</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-semibold">{p.currency} {Number(p.price).toLocaleString()}</span>
                      {p.compare_at_price ? (
                        <span className="text-xs text-neutral-500 line-through">{p.currency} {Number(p.compare_at_price).toLocaleString()}</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

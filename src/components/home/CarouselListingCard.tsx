"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useFavorite } from "@/hooks/useFavorite"
import { listingSlugPath } from "@/lib/slug"
import type { Listing } from "@/types"

export default function CarouselListingCard({ listing }: { listing: Listing }) {
  const { favorited, loading, toggle } = useFavorite(listing.id, false)
  const image = listing.images?.[0]
  const badge = listing.featured ? "人工精选" : listing.verification_status === "verified_available" ? "已核实" : null

  return (
    <Link href={`/listings/${listingSlugPath(listing)}`} className="block w-[220px] shrink-0 snap-start sm:w-[240px]">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="240px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-300">暂无图片</div>
        )}
        {badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-[#222222] shadow-sm">
            {badge}
          </span>
        )}
        <button
          onClick={toggle}
          disabled={loading}
          className="absolute right-2.5 top-2.5 p-1 text-white drop-shadow"
          aria-label={favorited ? "取消收藏" : "收藏"}
        >
          <Heart size={22} className={favorited ? "fill-[#2F6B52] text-[#2F6B52]" : "fill-black/25 text-white"} />
        </button>
      </div>
      <div className="mt-2.5">
        <p className="truncate font-medium text-[#222222]">{listing.title}</p>
        <p className="mt-0.5 text-sm text-gray-500">
          {listing.city}{listing.state ? `, ${listing.state}` : ""}
        </p>
        <p className="mt-0.5 text-sm">
          <span className="font-semibold text-[#222222]">
            {listing.price != null ? `$${listing.price.toLocaleString()}` : "价格待定"}
          </span>
          {listing.type === "rent" && <span className="text-gray-400"> /月</span>}
        </p>
      </div>
    </Link>
  )
}

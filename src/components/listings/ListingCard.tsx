"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Listing } from "@/types"
import { useFavorite } from "@/hooks/useFavorite"
import { useState } from "react"

interface Props {
  listing: Listing
  isFavorited?: boolean
}

export default function ListingCard({ listing, isFavorited = false }: Props) {
  const { favorited, loading, toggle } = useFavorite(listing.id, isFavorited)
  const [hovered, setHovered] = useState(false)

  const images = listing.images ?? []
  const showSecond = hovered && images.length > 1
  const badge = listing.featured
    ? "人工精选"
    : listing.verification_status === "verified_available"
      ? "已核实"
      : null

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
          {images[0] ? (
            <>
              <Image
                src={images[0]}
                alt={listing.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-300 ${showSecond ? "opacity-0" : "opacity-100"}`}
              />
              {images[1] && (
                <Image
                  src={images[1]}
                  alt={listing.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`object-cover transition-opacity duration-300 ${showSecond ? "opacity-100" : "opacity-0"}`}
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-300">
              暂无图片
            </div>
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
            <Heart size={22} className={favorited ? "fill-[#FF6B35] text-[#FF6B35]" : "fill-black/25 text-white"} />
          </button>

          {images.length > 1 && (
            <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
              {showSecond ? 2 : 1}/{images.length}
            </span>
          )}
        </div>

        <div className="mt-2.5">
          <p className="truncate font-medium text-[#222222]">{listing.title}</p>
          <p className="mt-0.5 truncate text-sm text-gray-500">
            {listing.city}{listing.state ? `, ${listing.state}` : ""}
          </p>
          <p className="mt-0.5 text-sm">
            <span className="font-semibold text-[#222222]">
              {listing.price != null ? `$${listing.price.toLocaleString()}` : "价格待定"}
            </span>
            {listing.type === "rent" && <span className="text-gray-400"> /月</span>}
          </p>
        </div>
      </div>
    </Link>
  )
}

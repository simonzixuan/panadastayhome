"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Listing } from "@/types"
import { PROPERTY_TYPE_LABELS } from "@/lib/constants"
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

  return (
    <Link href={`/listings/${listing.id}`}>
      <div
        className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 overflow-hidden h-full flex flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="h-52 bg-gray-100 relative flex-shrink-0">
          {images[0] ? (
            <>
              <img
                src={images[0]}
                alt={listing.title}
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${showSecond ? "opacity-0" : "opacity-100"}`}
              />
              {images[1] && (
                <img
                  src={images[1]}
                  alt={listing.title}
                  className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${showSecond ? "opacity-100" : "opacity-0"}`}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              暂无图片
            </div>
          )}
          {listing.featured && (
            <span className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              精选
            </span>
          )}
          <Badge
            className={listing.featured ? "absolute top-2 right-2" : "absolute top-2 left-2"}
            variant={listing.type === "rent" ? "default" : "secondary"}
          >
            {listing.type === "rent" ? "租房" : "买房"}
          </Badge>

          {/* 图片数量角标 */}
          {images.length > 1 && (
            <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
              {showSecond ? 2 : 1}/{images.length}
            </span>
          )}

          {/* 收藏按钮 */}
          <button
            onClick={toggle}
            disabled={loading}
            className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow"
            aria-label={favorited ? "取消收藏" : "收藏"}
          >
            <Heart
              size={18}
              className={favorited ? "fill-[#FF6B35] text-[#FF6B35]" : "text-gray-400"}
            />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-[#222222] line-clamp-2 leading-snug mb-1">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-400 mb-2">
            {listing.city}{listing.state ? `, ${listing.state}` : ""}
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
            {listing.area > 0 && <span>{listing.area.toLocaleString()} sq ft</span>}
            <span>{listing.bedrooms} bd</span>
            <span>{listing.bathrooms} ba</span>
            <span>{PROPERTY_TYPE_LABELS[listing.property_type] ?? listing.property_type}</span>
          </div>
          <div className="mt-auto">
            <p className="text-[#FF6B35] font-bold text-lg">
              {listing.price != null ? `$${listing.price.toLocaleString()}` : "价格待定"}
              {listing.type === "rent" && <span className="text-sm font-normal text-gray-400">/mo</span>}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

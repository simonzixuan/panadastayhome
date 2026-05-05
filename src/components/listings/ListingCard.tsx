import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Listing } from "@/types"
import { PROPERTY_TYPE_LABELS } from "@/lib/constants"

interface Props {
  listing: Listing
}

export default function ListingCard({ listing }: Props) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 overflow-hidden h-full flex flex-col">
        {/* 固定高度图片区 */}
        <div className="h-52 bg-gray-100 relative flex-shrink-0">
          {listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
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
        </div>

        {/* 内容区 */}
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
              ${listing.price.toLocaleString()}
              {listing.type === "rent" && <span className="text-sm font-normal text-gray-400">/mo</span>}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

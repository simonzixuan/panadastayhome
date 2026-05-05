import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Listing } from "@/types"
import { PROPERTY_TYPE_LABELS } from "@/lib/constants"

interface Props {
  listing: Listing
}

export default function ListingCard({ listing }: Props) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="hover:shadow-md transition-shadow overflow-hidden h-full">
        <div className="aspect-video bg-gray-100 relative">
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
            <span className="absolute top-2 left-2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
        <CardContent className="pt-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {listing.city}{listing.state ? `, ${listing.state}` : ""}
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
            <span>{listing.area.toLocaleString()} sq ft</span>
            <span>{listing.bedrooms} bd</span>
            <span>{listing.bathrooms} ba</span>
            <span>{PROPERTY_TYPE_LABELS[listing.property_type] ?? listing.property_type}</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-blue-600 font-bold text-lg">
            ${listing.price.toLocaleString()}
            {listing.type === "rent" && <span className="text-sm font-normal text-gray-500">/mo</span>}
          </p>
        </CardFooter>
      </Card>
    </Link>
  )
}

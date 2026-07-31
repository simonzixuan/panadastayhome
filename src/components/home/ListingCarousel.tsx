import Link from "next/link"
import type { Listing } from "@/types"
import CarouselListingCard from "./CarouselListingCard"

interface Props {
  title: string
  listings: Listing[]
  viewAllHref: string
}

export default function ListingCarousel({ title, listings, viewAllHref }: Props) {
  if (listings.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#222222]">{title}</h2>
        <Link href={viewAllHref} className="text-sm font-medium text-[#FF6B35] hover:text-[#e85a24]">
          查看全部 →
        </Link>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {listings.map((listing) => (
          <CarouselListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  )
}

import type { Listing } from "@/types"

export interface LandingStats {
  total: number
  minPrice: number | null
  maxPrice: number | null
  latestVerifiedAt: string | null
  latestUpdatedAt: string | null
}

export function getLandingStats(listings: Listing[], total: number): LandingStats {
  const prices = listings
    .map((listing) => Number(listing.price))
    .filter((price) => Number.isFinite(price) && price > 0)
  const verifiedDates = listings
    .map((listing) => listing.verified_at)
    .filter((date): date is string => Boolean(date))
    .sort()
  const updatedDates = listings
    .map((listing) => listing.updated_at)
    .filter(Boolean)
    .sort()

  return {
    total,
    minPrice: prices.length > 0 ? Math.min(...prices) : null,
    maxPrice: prices.length > 0 ? Math.max(...prices) : null,
    latestVerifiedAt: verifiedDates.at(-1) ?? null,
    latestUpdatedAt: updatedDates.at(-1) ?? null,
  }
}

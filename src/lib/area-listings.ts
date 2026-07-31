import { cache } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { areaPages } from "@/lib/area-pages"
import { buildListingCityFilter, buildListingKeywordFilter } from "@/lib/landing-query"
import type { Listing } from "@/types"

export const MIN_INDEXABLE_AREA_LISTINGS = 3

export const getAreaListings = cache(async (slug: string) => {
  const page = areaPages[slug as keyof typeof areaPages]
  if (!page) return null

  const supabase = createServerClient()
  const countryValues = page.country === "US"
    ? ["US", "United States"]
    : ["CA", "Canada"]
  const locationFilter = [
    buildListingCityFilter([page.area]),
    buildListingKeywordFilter([page.area]),
  ].filter(Boolean).join(",")

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("is_available", true)
    .in("country", countryValues)
    .eq("state", page.state)
    .or(locationFilter)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(12)

  return {
    listings: (data as Listing[]) ?? [],
    querySucceeded: !error,
  }
})

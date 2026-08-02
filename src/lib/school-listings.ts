import { cache } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { schoolPages } from "@/lib/landing-pages"
import { buildListingKeywordFilter } from "@/lib/landing-query"
import type { Listing } from "@/types"

export const MIN_INDEXABLE_SCHOOL_LISTINGS = 3

export const getSchoolListings = cache(async (slug: string) => {
  const page = schoolPages[slug as keyof typeof schoolPages]
  if (!page) return null

  const supabase = createServerClient()
  let query = supabase
    .from("listings")
    .select("*", { count: "exact" })
    .eq("is_available", true)
    .eq("type", "rent")
    .ilike("city", `%${page.city}%`)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(12)

  const keywordFilter = buildListingKeywordFilter(page.listingKeywords)
  if (keywordFilter) query = query.or(keywordFilter)

  const { data, error, count } = await query

  return {
    listings: (data as Listing[]) ?? [],
    total: count ?? 0,
    querySucceeded: !error,
  }
})

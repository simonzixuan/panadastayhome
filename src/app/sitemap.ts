import type { MetadataRoute } from "next"
import { createServerClient } from "@/lib/supabase/server"
import { cityPages, schoolPages } from "@/lib/landing-pages"
import { areaPages } from "@/lib/area-pages"
import { getAreaListings, MIN_INDEXABLE_AREA_LISTINGS } from "@/lib/area-listings"
import { getSchoolListings, MIN_INDEXABLE_SCHOOL_LISTINGS } from "@/lib/school-listings"
import { siteUrl } from "@/lib/site-url"

export const revalidate = 600

async function getAllAvailableListings() {
  const supabase = createServerClient()
  const listings: Array<{ id: string; updated_at: string | null }> = []

  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("listings")
      .select("id, updated_at")
      .eq("is_available", true)
      .order("id")
      .range(from, from + 999)

    if (error) throw error
    listings.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }

  return listings
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/listings`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/rental-check`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/publish`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ]

  const landingRoutes: MetadataRoute.Sitemap = [
    ...Object.keys(cityPages).map((slug) => ({
      url: `${siteUrl}/city/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ]

  try {
    const areaResults = await Promise.all(
      Object.keys(areaPages).map(async (slug) => ({
        slug,
        result: await getAreaListings(slug),
      }))
    )
    const areaRoutes: MetadataRoute.Sitemap = areaResults
      .filter(({ result }) =>
        result?.querySucceeded && result.listings.length >= MIN_INDEXABLE_AREA_LISTINGS
      )
      .map(({ slug }) => ({
        url: `${siteUrl}/area/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }))

    const schoolResults = await Promise.all(
      Object.keys(schoolPages).map(async (slug) => ({
        slug,
        result: await getSchoolListings(slug),
      }))
    )
    const schoolRoutes: MetadataRoute.Sitemap = schoolResults
      .filter(({ result }) =>
        result?.querySucceeded && result.listings.length >= MIN_INDEXABLE_SCHOOL_LISTINGS
      )
      .map(({ slug }) => ({
        url: `${siteUrl}/schools/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      }))

    const listings = await getAllAvailableListings()

    const listingRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
      url: `${siteUrl}/listings/${l.id}`,
      lastModified: new Date(l.updated_at ?? new Date()),
      changeFrequency: "weekly",
      priority: 0.7,
    }))

    return [...staticRoutes, ...landingRoutes, ...areaRoutes, ...schoolRoutes, ...listingRoutes]
  } catch {
    return [...staticRoutes, ...landingRoutes]
  }
}

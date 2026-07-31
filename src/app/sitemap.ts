import type { MetadataRoute } from "next"
import { createServerClient } from "@/lib/supabase/server"
import { cityPages, schoolPages } from "@/lib/landing-pages"
import { areaPages } from "@/lib/area-pages"
import { getAreaListings, MIN_INDEXABLE_AREA_LISTINGS } from "@/lib/area-listings"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.panadastayhome.com"

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
    ...Object.keys(schoolPages).map((slug) => ({
      url: `${siteUrl}/schools/${slug}`,
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

    const supabase = createServerClient()
    const { data: listings } = await supabase
      .from("listings")
      .select("id, updated_at")
      .eq("is_available", true)

    const listingRoutes: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
      url: `${siteUrl}/listings/${l.id}`,
      lastModified: new Date(l.updated_at ?? new Date()),
      changeFrequency: "weekly",
      priority: 0.7,
    }))

    return [...staticRoutes, ...landingRoutes, ...areaRoutes, ...listingRoutes]
  } catch {
    return [...staticRoutes, ...landingRoutes]
  }
}

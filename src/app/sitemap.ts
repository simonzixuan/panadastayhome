import type { MetadataRoute } from "next"
import { createServerClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/listings`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ]

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

  return [...staticRoutes, ...listingRoutes]
}

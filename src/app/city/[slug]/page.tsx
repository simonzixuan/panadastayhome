import { notFound } from "next/navigation"
import { cache } from "react"
import { createServerClient } from "@/lib/supabase/server"
import LandingListingPage from "@/components/landing/LandingListingPage"
import { cityPages } from "@/lib/landing-pages"
import { buildListingCityFilter } from "@/lib/landing-query"
import { getAreaLinksForCity } from "@/lib/area-pages"
import type { Listing } from "@/types"
import type { Metadata } from "next"

export const revalidate = 600

const getCityListings = cache(async (slug: string) => {
  const page = cityPages[slug as keyof typeof cityPages]
  if (!page) return null

  const supabase = createServerClient()
  const cityFilter = buildListingCityFilter(page.nearbyCities ?? [page.city])
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("is_available", true)
    .or(cityFilter)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(12)

  return {
    listings: (data as Listing[]) ?? [],
    querySucceeded: !error,
  }
})

export async function generateStaticParams() {
  return Object.keys(cityPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = cityPages[slug as keyof typeof cityPages]
  if (!page) return {}
  const result = await getCityListings(slug)
  const isEmpty = result?.querySucceeded && result.listings.length === 0

  return {
    title: page.metaTitle,
    description: `${page.description} ${page.searchIntent}，熊猫之家提供中文找房、房源确认和看房对接。`,
    keywords: page.searchIntent.split("、"),
    alternates: { canonical: `/city/${slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      url: `/city/${slug}`,
      type: "website",
    },
    ...(isEmpty ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = cityPages[slug as keyof typeof cityPages]
  if (!page) notFound()

  const result = await getCityListings(slug)

  return (
    <LandingListingPage
      title={page.title}
      description={page.description}
      searchIntent={page.searchIntent}
      listings={result?.listings ?? []}
      source={`city_${slug}`}
      canonicalPath={`/city/${slug}`}
      areas={page.areas}
      relatedLinks={getAreaLinksForCity(slug)}
      faqs={page.faqs}
    />
  )
}

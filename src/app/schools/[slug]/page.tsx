import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import LandingListingPage from "@/components/landing/LandingListingPage"
import { schoolPages } from "@/lib/landing-pages"
import { buildListingKeywordFilter } from "@/lib/landing-query"
import type { Listing } from "@/types"
import type { Metadata } from "next"

export const revalidate = 600

export async function generateStaticParams() {
  return Object.keys(schoolPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = schoolPages[slug as keyof typeof schoolPages]
  if (!page) return {}
  return {
    title: page.metaTitle,
    description: `${page.description} ${page.searchIntent}，熊猫之家提供中文找房、房源确认和看房对接。`,
    keywords: page.searchIntent.split("、"),
    alternates: { canonical: `/schools/${slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      url: `/schools/${slug}`,
      type: "website",
    },
  }
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = schoolPages[slug as keyof typeof schoolPages]
  if (!page) notFound()

  const supabase = createServerClient()
  let query = supabase
    .from("listings")
    .select("*")
    .eq("is_available", true)
    .ilike("city", `%${page.city}%`)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(12)

  const keywordFilter = buildListingKeywordFilter(page.listingKeywords)
  if (keywordFilter) query = query.or(keywordFilter)

  const { data } = await query

  return (
    <LandingListingPage
      title={page.title}
      description={page.description}
      searchIntent={page.searchIntent}
      listings={(data as Listing[]) ?? []}
      source={`school_${slug}`}
      canonicalPath={`/schools/${slug}`}
    />
  )
}

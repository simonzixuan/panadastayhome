import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import LandingListingPage from "@/components/landing/LandingListingPage"
import { cityPages } from "@/lib/landing-pages"
import type { Listing } from "@/types"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return Object.keys(cityPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = cityPages[slug as keyof typeof cityPages]
  if (!page) return {}
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
  }
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = cityPages[slug as keyof typeof cityPages]
  if (!page) notFound()

  const supabase = createServerClient()
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("is_available", true)
    .ilike("city", `%${page.city}%`)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(12)

  return (
    <LandingListingPage
      title={page.title}
      description={page.description}
      searchIntent={page.searchIntent}
      listings={(data as Listing[]) ?? []}
      source={`city_${slug}`}
      canonicalPath={`/city/${slug}`}
    />
  )
}

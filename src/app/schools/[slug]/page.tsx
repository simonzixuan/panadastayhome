import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import LandingListingPage from "@/components/landing/LandingListingPage"
import { schoolPages } from "@/lib/landing-pages"
import type { Listing } from "@/types"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return Object.keys(schoolPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = schoolPages[slug as keyof typeof schoolPages]
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
  }
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = schoolPages[slug as keyof typeof schoolPages]
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
      listings={(data as Listing[]) ?? []}
      source={`school_${slug}`}
    />
  )
}

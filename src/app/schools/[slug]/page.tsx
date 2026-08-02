import { notFound } from "next/navigation"
import LandingListingPage from "@/components/landing/LandingListingPage"
import { schoolPages } from "@/lib/landing-pages"
import { schoolGuides } from "@/lib/landing-guides"
import { getLandingStats } from "@/lib/landing-stats"
import { getSchoolListings, MIN_INDEXABLE_SCHOOL_LISTINGS } from "@/lib/school-listings"
import type { Metadata } from "next"

export const revalidate = 600

export async function generateStaticParams() {
  return Object.keys(schoolPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = schoolPages[slug as keyof typeof schoolPages]
  if (!page) return {}
  const guide = schoolGuides[slug]
  const result = await getSchoolListings(slug)
  const shouldNoindex =
    result?.querySucceeded && result.listings.length < MIN_INDEXABLE_SCHOOL_LISTINGS

  return {
    title: guide?.metaTitle ?? page.metaTitle,
    description: guide?.metaDescription ?? `${page.description} ${page.searchIntent}，熊猫之家提供中文找房、房源确认和看房对接。`,
    keywords: page.searchIntent.split("、"),
    alternates: { canonical: `/schools/${slug}` },
    openGraph: {
      title: guide?.metaTitle ?? page.metaTitle,
      description: guide?.metaDescription ?? page.description,
      url: `/schools/${slug}`,
      type: "website",
    },
    ...(shouldNoindex ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = schoolPages[slug as keyof typeof schoolPages]
  if (!page) notFound()

  const result = await getSchoolListings(slug)
  const guide = schoolGuides[slug]
  const listings = result?.listings ?? []
  const parentLink = page.city === "Los Angeles"
    ? { label: "洛杉矶租房", href: "/city/los-angeles" }
    : page.city === "Vancouver"
      ? { label: "温哥华租房", href: "/city/vancouver" }
      : undefined

  return (
    <LandingListingPage
      title={page.title}
      description={page.description}
      searchIntent={page.searchIntent}
      listings={listings}
      source={`school_${slug}`}
      canonicalPath={`/schools/${slug}`}
      areas={page.areas}
      faqs={page.faqs}
      parentLink={parentLink}
      relatedLinks={guide?.relatedLinks}
      guide={guide}
      stats={getLandingStats(listings, result?.total ?? listings.length)}
    />
  )
}

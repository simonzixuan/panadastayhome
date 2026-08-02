import type { Metadata } from "next"
import { notFound } from "next/navigation"
import LandingListingPage from "@/components/landing/LandingListingPage"
import { areaPages, getRelatedAreaLinks } from "@/lib/area-pages"
import { getAreaListings, MIN_INDEXABLE_AREA_LISTINGS } from "@/lib/area-listings"
import { areaGuides } from "@/lib/landing-guides"
import { getLandingStats } from "@/lib/landing-stats"

export const revalidate = 600

export function generateStaticParams() {
  return Object.keys(areaPages).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = areaPages[slug as keyof typeof areaPages]
  if (!page) return {}
  const guide = areaGuides[slug]

  const result = await getAreaListings(slug)
  const shouldNoindex =
    result?.querySucceeded && result.listings.length < MIN_INDEXABLE_AREA_LISTINGS

  return {
    title: guide?.metaTitle ?? page.metaTitle,
    description: guide?.metaDescription ?? page.metaDescription,
    keywords: page.searchIntent.split("、"),
    alternates: { canonical: `/area/${slug}` },
    openGraph: {
      title: guide?.metaTitle ?? page.metaTitle,
      description: guide?.metaDescription ?? page.metaDescription,
      url: `/area/${slug}`,
      type: "website",
    },
    ...(shouldNoindex ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = areaPages[slug as keyof typeof areaPages]
  if (!page) notFound()

  const result = await getAreaListings(slug)
  const guide = areaGuides[slug]
  const listings = result?.listings ?? []

  return (
    <LandingListingPage
      title={page.title}
      description={page.description}
      searchIntent={page.searchIntent}
      listings={listings}
      source={`area_${slug}`}
      canonicalPath={`/area/${slug}`}
      areas={[page.area, page.cityLabel]}
      faqs={page.faqs}
      parentLink={{ label: `${page.cityLabel}租房`, href: `/city/${page.citySlug}` }}
      relatedLinks={guide?.relatedLinks ?? getRelatedAreaLinks(slug)}
      guide={guide}
      stats={getLandingStats(listings, result?.total ?? listings.length)}
    />
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import LandingListingPage from "@/components/landing/LandingListingPage"
import { areaPages, getRelatedAreaLinks } from "@/lib/area-pages"
import { getAreaListings, MIN_INDEXABLE_AREA_LISTINGS } from "@/lib/area-listings"

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

  const result = await getAreaListings(slug)
  const shouldNoindex =
    result?.querySucceeded && result.listings.length < MIN_INDEXABLE_AREA_LISTINGS

  return {
    title: page.metaTitle,
    description: `${page.description} 熊猫之家提供中文找房、房源确认和看房对接。`,
    keywords: page.searchIntent.split("、"),
    alternates: { canonical: `/area/${slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
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

  return (
    <LandingListingPage
      title={page.title}
      description={page.description}
      searchIntent={page.searchIntent}
      listings={result?.listings ?? []}
      source={`area_${slug}`}
      canonicalPath={`/area/${slug}`}
      areas={[page.area, page.cityLabel]}
      faqs={page.faqs}
      parentLink={{ label: `${page.cityLabel}租房`, href: `/city/${page.citySlug}` }}
      relatedLinks={getRelatedAreaLinks(slug)}
    />
  )
}

import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Listing } from "@/types"
import { PROPERTY_TYPE_LABELS } from "@/lib/constants"
import ContactSection from "@/components/listings/ContactSection"
import MessageForm from "@/components/listings/MessageForm"
import LandlordReviews from "@/components/listings/LandlordReviews"
import ImageGallery from "@/components/listings/ImageGallery"
import FavoriteButton from "@/components/listings/FavoriteButton"
import ListingMap from "@/components/listings/ListingMap"
import LeadForm from "@/components/listings/LeadForm"
import StickyContactBar from "@/components/listings/StickyContactBar"
import TrackEvent from "@/components/analytics/TrackEvent"
import type { Metadata } from "next"
import { Bath, BedDouble, Home, MapPin, Ruler, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { getListingEditorialSummary } from "@/lib/listing-editorial"
import { getListingVerification } from "@/lib/listing-verification"
import { getAreaLinkForListing, getAreaLinksForListing } from "@/lib/area-pages"
import { siteUrl } from "@/lib/site-url"
import { extractListingId, listingSlugPath } from "@/lib/slug"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id: rawId } = await params
  const id = extractListingId(rawId)
  const supabase = createServerClient()
  const { data: listing } = await supabase
    .from("listings")
    .select("title, city, state, zip_code, price, type, description, images, area, bedrooms, bathrooms")
    .eq("id", id)
    .single()

  if (!listing) return {}

  const l = listing as Partial<Listing> & typeof listing
  const location = [l.city, l.state].filter(Boolean).join(", ")
  const priceLabel =
    l.type === "rent"
      ? `$${l.price?.toLocaleString()}/月`
      : `$${l.price?.toLocaleString()}`
  const title = `${l.title} - ${location} ${priceLabel}`
  const description = `${location} ${l.type === "rent" ? "租房" : "买房"}，${l.bedrooms}室${l.bathrooms}卫，${l.area} sq ft，${priceLabel}。${l.description?.slice(0, 80) ?? ""}`
  const image = l.images?.[0]

  return {
    title,
    description,
    keywords: [
      l.city, l.state,
      l.type === "rent" ? "租房" : "买房",
      l.type === "rent" ? "出租" : "出售",
      "北美华人租房", "华人找房", "Panda Stay Home",
      ...(l.zip_code ? [l.zip_code] : []),
    ].filter(Boolean) as string[],
    alternates: { canonical: `/listings/${listingSlugPath({ id, title: l.title ?? null })}` },
    openGraph: {
      title,
      description,
      type: "article",
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: rawId } = await params
  const id = extractListingId(rawId)
  const supabase = createServerClient()

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single()

  if (!listing) notFound()

  const l = listing as Listing
  const editorialSummary = getListingEditorialSummary(l)
  const verification = getListingVerification(l)
  const areaLink = getAreaLinkForListing(l)
  const relatedAreaLinks = getAreaLinksForListing(l)
  const qualityBadges = [
    l.images?.length >= 3 ? "图片较完整" : null,
    l.contact_phone || l.contact_email ? "可联系确认" : null,
    l.featured ? "人工精选" : null,
  ].filter(Boolean) as string[]


  const listingUrl = `${siteUrl}/listings/${listingSlugPath(l)}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": l.type === "rent" ? "ApartmentComplex" : "SingleFamilyResidence",
        "@id": `${listingUrl}#listing`,
        "name": l.title,
        "description": l.description,
        "url": listingUrl,
        "numberOfRooms": l.bedrooms,
        "floorSize": { "@type": "QuantitativeValue", "value": l.area, "unitCode": "FTK" },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": l.address,
          "addressLocality": l.city,
          "addressRegion": l.state,
          "postalCode": l.zip_code,
          "addressCountry": l.country,
        },
        ...(l.images?.[0] ? { "image": l.images[0] } : {}),
        ...(l.price != null
          ? {
              "offers": {
                "@type": "Offer",
                "price": l.price,
                "priceCurrency": "USD",
                "availability": l.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "url": listingUrl,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${listingUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "首页", "item": siteUrl },
          ...(areaLink
            ? [{ "@type": "ListItem", "position": 2, "name": areaLink.label, "item": `${siteUrl}${areaLink.href}` }]
            : []),
          { "@type": "ListItem", "position": areaLink ? 3 : 2, "name": l.title, "item": listingUrl },
        ],
      },
    ],
  }

  return (
    <>
      <TrackEvent
        eventName="view_item"
        parameters={{
          currency: "USD",
          value: l.price ?? 0,
          listing_id: l.id,
          listing_type: l.type,
          property_type: l.property_type,
          city: l.city ?? "",
          country: l.country ?? "",
          items: [{ item_id: l.id }],
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="bg-[#F7F7F7] pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
          <main className="min-w-0">
            {l.images?.length > 0 ? (
              <ImageGallery images={l.images} title={l.title} />
            ) : (
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-6">
                暂无图片
              </div>
            )}

            <section className="bg-white border rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant={l.type === "rent" ? "default" : "secondary"}>
                      {l.type === "rent" ? "租房 For Rent" : "买房 For Sale"}
                    </Badge>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF1EC] px-2.5 py-1 text-xs font-medium text-[#2F6B52]">
                      <ShieldCheck className="size-3.5" />
                      中文协助确认
                    </span>
                    {qualityBadges.map((label) => (
                      <span key={label} className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                        {label}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{l.title}</h1>
                  <p className="mt-3 flex items-center gap-1.5 text-gray-500">
                    <MapPin className="size-4 shrink-0" />
                    {[l.address, l.district, l.city, l.state, l.zip_code].filter(Boolean).join(", ") || "地址待确认"}
                  </p>
                  {areaLink && (
                    <Link href={areaLink.href} className="mt-2 inline-flex text-sm text-[#2F6B52] hover:underline">
                      查看{areaLink.label}
                    </Link>
                  )}
                </div>
                <FavoriteButton listingId={l.id} />
              </div>

              <p className="text-3xl font-bold text-[#2F6B52] mb-6">
                {l.price != null ? `$${l.price.toLocaleString()}` : "价格待定"}
                {l.type === "rent" && <span className="text-base font-normal text-gray-500">/mo</span>}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {l.area != null && l.area > 0 && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <Ruler className="size-5 text-[#2F6B52] mb-2" />
                    <p className="text-sm text-gray-500">面积</p>
                    <p className="font-semibold">{l.area.toLocaleString()} sq ft</p>
                  </div>
                )}
                <div className="rounded-xl bg-gray-50 p-4">
                  <BedDouble className="size-5 text-[#2F6B52] mb-2" />
                  <p className="text-sm text-gray-500">卧室</p>
                  <p className="font-semibold">{l.bedrooms} bd</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <Bath className="size-5 text-[#2F6B52] mb-2" />
                  <p className="text-sm text-gray-500">卫生间</p>
                  <p className="font-semibold">{l.bathrooms} ba</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <Home className="size-5 text-[#2F6B52] mb-2" />
                  <p className="text-sm text-gray-500">类型</p>
                  <p className="font-semibold">{PROPERTY_TYPE_LABELS[l.property_type] ?? l.property_type}</p>
                </div>
              </div>
            </section>

            <section className="bg-white border rounded-xl p-6 mb-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold">熊猫之家摘要</h2>
                  <span className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-500">
                    {verification.label} · {verification.dateLabel}
                  </span>
                </div>
                <p className="mt-3 text-gray-600 leading-7">{editorialSummary}</p>
              </div>

              {l.description && (
                <div className="mt-6 border-t pt-6">
                  <h2 className="text-lg font-semibold mb-3">房源描述</h2>
                  <p className="text-gray-600 leading-7 whitespace-pre-wrap">{l.description}</p>
                </div>
              )}

              <div className="mt-6 border-t pt-6">
                <h2 className="text-lg font-semibold mb-3">位置与周边</h2>
                <ListingMap
                  address={l.address}
                  city={l.city}
                  state={l.state}
                  zipCode={l.zip_code}
                />
              </div>
            </section>

            {relatedAreaLinks.length > 0 && (
              <section className="bg-white border rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">附近热门租房区域</h2>
                <p className="mt-2 text-sm text-gray-500">继续查看同一城市范围内的区域房源。</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedAreaLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border bg-gray-50 px-3 py-1.5 text-sm text-gray-600 hover:border-[#2F6B52] hover:text-[#2F6B52]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {l.user_id && <LandlordReviews userId={l.user_id} />}

            <div className="lg:hidden space-y-6">
              <ContactSection listingId={l.id} />
              {l.user_id && <MessageForm listingId={l.id} ownerUserId={l.user_id} />}
            </div>
          </main>

          <aside id="contact-form" className="scroll-mt-20 lg:sticky lg:top-24 space-y-5">
            <LeadForm listingId={l.id} />
            <div className="hidden lg:block space-y-5">
              <ContactSection listingId={l.id} />
              {l.user_id && <MessageForm listingId={l.id} ownerUserId={l.user_id} />}
            </div>
          </aside>
        </div>
      </div>
      <StickyContactBar listing={l} />
    </div>
    </>
  )
}

import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Listing } from "@/types"
import { PROPERTY_TYPE_LABELS } from "@/lib/constants"
import ContactSection from "@/components/listings/ContactSection"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = createServerClient()
  const { data: listing } = await supabase
    .from("listings")
    .select("title, city, state, price, type, description, images, area, bedrooms, bathrooms")
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
      "北美华人租房", "华人找房", "Panda House",
      ...(l.zip_code ? [l.zip_code] : []),
    ].filter(Boolean) as string[],
    alternates: { canonical: `/listings/${id}` },
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
  const { id } = await params
  const supabase = createServerClient()

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single()

  if (!listing) notFound()

  const l = listing as Listing

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://panadastayhome.com"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": l.type === "rent" ? "ApartmentComplex" : "SingleFamilyResidence",
    "name": l.title,
    "description": l.description,
    "url": `${siteUrl}/listings/${l.id}`,
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
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 图片画廊 */}
      {l.images?.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 mb-6">
          <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
            <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
          </div>
          {l.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {l.images.slice(1, 5).map((url, i) => (
                <div key={i} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-6">
          暂无图片
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{l.title}</h1>
        <Badge variant={l.type === "rent" ? "default" : "secondary"} className="shrink-0">
          {l.type === "rent" ? "租房 For Rent" : "买房 For Sale"}
        </Badge>
      </div>

      <p className="text-3xl font-bold text-blue-600 mb-6">
        ${l.price.toLocaleString()}
        {l.type === "rent" && <span className="text-base font-normal text-gray-500">/mo</span>}
      </p>

      {/* 详细参数 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">面积</p>
          <p className="font-semibold">{l.area.toLocaleString()} sq ft</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">卧室</p>
          <p className="font-semibold">{l.bedrooms} bd</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">卫生间</p>
          <p className="font-semibold">{l.bathrooms} ba</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">类型</p>
          <p className="font-semibold">{PROPERTY_TYPE_LABELS[l.property_type] ?? l.property_type}</p>
        </div>
      </div>

      {/* 地址 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">地址</h2>
        <p className="text-gray-600">
          {l.address}
          {l.district ? `, ${l.district}` : ""}
          {`, ${l.city}`}
          {l.state ? `, ${l.state}` : ""}
          {l.zip_code ? ` ${l.zip_code}` : ""}
        </p>
      </div>

      {/* 描述 */}
      {l.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">房源描述</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{l.description}</p>
        </div>
      )}

      {/* 联系方式（登录后可见） */}
      <ContactSection listingId={l.id} />
    </div>
    </>
  )
}

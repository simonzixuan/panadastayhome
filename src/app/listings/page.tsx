export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "找房源",
  description:
    "浏览北美华人租房、买房房源，按城市、价格、户型筛选，快速找到理想住所。覆盖美国、加拿大各大城市。",
}
import { Suspense } from "react"
import ListingCard from "@/components/listings/ListingCard"
import ListingFilters from "@/components/search/ListingFilters"
import { Listing } from "@/types"

interface SearchParams {
  type?: string
  city?: string
  zip?: string
  country?: string
  state?: string
  property_type?: string
  min_price?: string
  max_price?: string
  bedrooms?: string
  bathrooms?: string
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = createServerClient()

  let query = supabase
    .from("listings")
    .select("*")
    .eq("is_available", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })

  if (params.type) query = query.eq("type", params.type)
  if (params.zip) query = query.ilike("zip_code", `%${params.zip}%`)
  if (params.city) query = query.ilike("city", `%${params.city}%`)
  if (params.country) query = query.eq("country", params.country)
  if (params.state) query = query.eq("state", params.state)
  if (params.property_type) query = query.eq("property_type", params.property_type)
  if (params.min_price) query = query.gte("price", Number(params.min_price))
  if (params.max_price) query = query.lte("price", Number(params.max_price))
  if (params.bedrooms) query = query.gte("bedrooms", Number(params.bedrooms))
  if (params.bathrooms) query = query.gte("bathrooms", Number(params.bathrooms))

  const { data: listings, error } = await query

  const hasFilter = Object.values(params).some(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          找房源
          {listings && (
            <span className="text-base font-normal text-gray-400 ml-2">
              共 {listings.length} 套
            </span>
          )}
        </h1>
      </div>

      <Suspense>
        <ListingFilters />
      </Suspense>

      {error ? (
        <p className="text-red-500 text-center py-16">加载失败，请稍后重试</p>
      ) : !listings || listings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-2">没有找到符合条件的房源</p>
          {hasFilter && (
            <p className="text-gray-400 text-sm">试试调整筛选条件</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(listings as Listing[]).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}

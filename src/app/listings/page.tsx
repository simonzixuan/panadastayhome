export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "找房源",
  description:
    "浏览北美华人租房、买房房源，按城市、价格、户型筛选，快速找到理想住所。覆盖美国、加拿大各大城市。",
}
import { Suspense } from "react"
import Link from "next/link"
import ListingsGrid from "@/components/listings/ListingsGrid"
import ListingFilters from "@/components/search/ListingFilters"
import type { Listing } from "@/types"

const PAGE_SIZE = 9

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
  page?: string
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = createServerClient()

  const page = Math.max(1, Number(params.page) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from("listings")
    .select("*", { count: "exact" })
    .eq("is_available", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })

  if (params.type) query = query.eq("type", params.type)
  if (params.zip) query = query.ilike("zip_code", `%${params.zip}%`)
  if (params.city) query = query.ilike("city", `%${params.city}%`)
  if (params.country) query = query.eq("country", params.country)
  if (params.state) query = query.eq("state", params.state)
  if (params.property_type) query = query.eq("property_type", params.property_type)
  const minPrice = Number(params.min_price)
  const maxPrice = Number(params.max_price)
  const bedrooms = Number(params.bedrooms)
  const bathrooms = Number(params.bathrooms)
  if (params.min_price && !isNaN(minPrice)) query = query.gte("price", minPrice)
  if (params.max_price && !isNaN(maxPrice)) query = query.lte("price", maxPrice)
  if (params.bedrooms && !isNaN(bedrooms)) query = query.gte("bedrooms", bedrooms)
  if (params.bathrooms && !isNaN(bathrooms)) query = query.gte("bathrooms", bathrooms)

  const { data: listings, error, count } = await query.range(from, to)

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const hasFilter = Object.entries(params).filter(([k]) => k !== "page").some(([, v]) => Boolean(v))

  function pageUrl(p: number) {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v && k !== "page") sp.set(k, v) })
    if (p > 1) sp.set("page", String(p))
    const qs = sp.toString()
    return `/listings${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          找房源
          {count != null && (
            <span className="text-base font-normal text-gray-400 ml-2">
              共 {count} 套
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
        <>
          <ListingsGrid listings={listings as Listing[]} />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {page > 1 && (
                <Link href={pageUrl(page - 1)} className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">
                  上一页
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={pageUrl(p)}
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    p === page
                      ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link href={pageUrl(page + 1)} className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">
                  下一页
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

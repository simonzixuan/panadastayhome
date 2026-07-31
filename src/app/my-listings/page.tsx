"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Listing } from "@/types"

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: Array<number | "start-ellipsis" | "end-ellipsis"> = [1]
  const start = Math.max(2, currentPage - 2)
  const end = Math.min(totalPages - 1, currentPage + 2)

  if (start > 2) items.push("start-ellipsis")
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < totalPages - 1) items.push("end-ellipsis")
  items.push(totalPages)

  return items
}

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 9

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login?redirect=/my-listings")
        return
      }
      supabase
        .from("listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setListings((data as Listing[]) ?? [])
          setLoading(false)
        })
    })
  }, [router])

  async function handleDelete(id: string) {
    if (!confirm("确定要删除这条房源吗？")) return
    setDeletingId(id)
    const { error } = await supabase.from("listings").delete().eq("id", id)
    if (error) {
      alert("删除失败，请稍后重试")
    } else {
      setListings((prev) => prev.filter((l) => l.id !== id))
    }
    setDeletingId(null)
  }

  async function handleToggle(listing: Listing) {
    const newValue = !listing.is_available
    setListings((prev) =>
      prev.map((l) => l.id === listing.id ? { ...l, is_available: newValue } : l)
    )
    const { error } = await supabase
      .from("listings")
      .update({ is_available: newValue })
      .eq("id", listing.id)
    if (error) {
      setListings((prev) =>
        prev.map((l) => l.id === listing.id ? { ...l, is_available: listing.is_available } : l)
      )
      alert("更新失败，请稍后重试")
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">加载中...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的房源</h1>
        <Link href="/publish">
          <Button>+ 发布新房源</Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white border rounded-xl p-16 text-center">
          <p className="text-gray-400 mb-4">还没有发布过房源</p>
          <Link href="/publish">
            <Button>立即发布</Button>
          </Link>
        </div>
      ) : (
        <>
        <div className="space-y-4">
          {listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((listing) => (
            <div key={listing.id} className="bg-white border rounded-xl p-4 flex gap-4">
              {/* 图片 */}
              <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {listing.images?.[0] ? (
                  <img src={listing.images[0]} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">暂无图片</div>
                )}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                  <Badge variant={listing.type === "rent" ? "default" : "secondary"} className="shrink-0">
                    {listing.type === "rent" ? "租房" : "买房"}
                  </Badge>
                  {listing.featured && (
                    <Badge className="shrink-0 bg-[#FF6B35] text-white">⭐ 精选</Badge>
                  )}
                  {!listing.is_available && (
                    <Badge variant="outline" className="shrink-0 text-gray-400">待审核</Badge>
                  )}
                </div>
                <p className="text-blue-600 font-bold">
                  {listing.price != null ? `$${listing.price.toLocaleString()}` : "价格待定"}
                  {listing.type === "rent" && <span className="text-sm font-normal text-gray-400">/mo</span>}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {listing.city}{listing.state ? `, ${listing.state}` : ""}{listing.area != null && listing.area > 0 ? ` · ${listing.area.toLocaleString()} sq ft` : ""}
                </p>
              </div>

              {/* 操作 */}
              <div className="flex flex-col gap-2 shrink-0">
                <Link href={`/listings/${listing.id}`}>
                  <Button variant="outline" size="sm" className="w-full">查看</Button>
                </Link>
                <Link href={`/my-listings/${listing.id}/edit`}>
                  <Button variant="outline" size="sm" className="w-full">编辑</Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!listing.is_available}
                  onClick={() => handleToggle(listing)}
                  className="w-full"
                >
                  {listing.is_available ? "下架" : "等待审核"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-500 hover:text-red-600"
                  disabled={deletingId === listing.id}
                  onClick={() => handleDelete(listing.id)}
                >
                  {deletingId === listing.id ? "删除中..." : "删除"}
                </Button>
              </div>
            </div>
          ))}
        </div>
        {Math.ceil(listings.length / PAGE_SIZE) > 1 && (() => {
          const totalPages = Math.ceil(listings.length / PAGE_SIZE)
          const paginationItems = getPaginationItems(page, totalPages)
          return (
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {page > 1 && (
                  <button onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">上一页</button>
                )}
                {paginationItems.map((item) =>
                  typeof item === "number" ? (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      aria-current={item === page ? "page" : undefined}
                      className={`min-w-10 rounded-lg border px-3 py-2 text-center text-sm ${
                        item === page
                          ? "border-[#FF6B35] bg-[#FF6B35] text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={item} className="px-1 text-sm text-gray-400" aria-hidden="true">
                      …
                    </span>
                  ),
                )}
                {page < totalPages && (
                  <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">下一页</button>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const input = e.currentTarget.elements.namedItem("page-jump") as HTMLInputElement
                  const target = Math.min(totalPages, Math.max(1, Number(input.value) || 1))
                  setPage(target)
                }}
                className="flex items-center gap-2 text-sm"
              >
                <label htmlFor="page-jump" className="text-gray-500">跳至</label>
                <input
                  key={page}
                  id="page-jump"
                  name="page-jump"
                  type="number"
                  min={1}
                  max={totalPages}
                  defaultValue={page}
                  inputMode="numeric"
                  aria-label={`输入页码，范围 1 到 ${totalPages}`}
                  className="h-10 w-20 rounded-lg border bg-white px-3 text-center outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                />
                <span className="text-gray-500">/ {totalPages} 页</span>
                <button type="submit" className="h-10 rounded-lg border px-4 hover:bg-gray-50">跳转</button>
              </form>
            </div>
          )
        })()}
        </>
      )}
    </div>
  )
}

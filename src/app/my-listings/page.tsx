"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Listing } from "@/types"

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login")
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
        <div className="space-y-4">
          {listings.map((listing) => (
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
                    <Badge variant="outline" className="shrink-0 text-gray-400">已下架</Badge>
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
                  onClick={() => handleToggle(listing)}
                  className="w-full"
                >
                  {listing.is_available ? "下架" : "上架"}
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
      )}
    </div>
  )
}

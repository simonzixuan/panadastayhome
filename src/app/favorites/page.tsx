"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import ListingCard from "@/components/listings/ListingCard"
import type { Listing } from "@/types"

export default function FavoritesPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push("/auth/login?redirect=/favorites"); return }

      const res = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) { setLoading(false); return }

      const { favorites: ids } = await res.json() as { favorites: string[] }
      if (ids.length === 0) { setLoading(false); return }

      const { data } = await supabase
        .from("listings")
        .select("*")
        .in("id", ids)
        .order("created_at", { ascending: false })

      setListings((data as Listing[]) ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">我的收藏</h1>

      {loading ? (
        <div className="text-center py-16 text-gray-400">加载中...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">暂无收藏</p>
          <p className="text-sm">浏览房源时点击心形图标即可收藏</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 lg:grid-cols-3">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} isFavorited={true} />
          ))}
        </div>
      )}
    </div>
  )
}

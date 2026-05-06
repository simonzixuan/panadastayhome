"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Props {
  listingId: string
}

export default function FavoriteButton({ listingId }: Props) {
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function checkFavorite() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setChecked(true); return }

      const res = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        const { favorites } = await res.json()
        setFavorited((favorites as string[]).includes(listingId))
      }
      setChecked(true)
    }
    checkFavorite()
  }, [listingId])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = "/auth/login"; return }

    setLoading(true)
    const res = await fetch("/api/favorites", {
      method: favorited ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ listing_id: listingId }),
    })
    if (res.ok) setFavorited(!favorited)
    setLoading(false)
  }

  if (!checked) return null

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-[#FF6B35] transition-colors text-sm font-medium"
      aria-label={favorited ? "取消收藏" : "收藏"}
    >
      <Heart
        size={18}
        className={favorited ? "fill-[#FF6B35] text-[#FF6B35]" : "text-gray-400"}
      />
      {favorited ? "已收藏" : "收藏"}
    </button>
  )
}

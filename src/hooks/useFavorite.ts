"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"

export function useFavorite(listingId: string, initialFavorited: boolean) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.href = "/auth/login"
      return
    }

    setLoading(true)
    const method = favorited ? "DELETE" : "POST"
    const res = await fetch("/api/favorites", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ listing_id: listingId }),
    })

    if (res.ok) setFavorited(!favorited)
    setLoading(false)
  }

  return { favorited, loading, toggle }
}

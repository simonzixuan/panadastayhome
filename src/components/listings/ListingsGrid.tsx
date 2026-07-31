"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import ListingCard from "@/components/listings/ListingCard"
import type { Listing } from "@/types"

interface Props {
  listings: Listing[]
}

export default function ListingsGrid({ listings }: Props) {
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadFavorites() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) return

      const { favorites } = await res.json() as { favorites: string[] }
      setFavoritedIds(new Set(favorites))
    }
    loadFavorites()
  }, [])

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          isFavorited={favoritedIds.has(listing.id)}
        />
      ))}
    </div>
  )
}

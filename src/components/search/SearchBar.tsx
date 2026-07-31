"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

function isZipCode(value: string) {
  return /^\d{5}(-\d{4})?$/.test(value.trim()) || /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value.trim())
}

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [type, setType] = useState("")

  function handleSearch() {
    const params = new URLSearchParams()
    const locationType = isZipCode(query) ? "zip_code" : query.trim() ? "city" : "all"
    if (query) {
      if (isZipCode(query)) {
        params.set("zip", query.trim())
      } else {
        params.set("city", query.trim())
      }
    }
    if (type) params.set("type", type)
    trackEvent("search", {
      search_term: locationType,
      listing_type: type || "all",
      search_source: "homepage",
    })
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Input
        placeholder="城市或 Zip Code..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 h-12 rounded-xl border-gray-200 text-[#222222] placeholder:text-gray-400 text-sm focus-visible:ring-[#FF6B35]"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full sm:w-28 h-12 rounded-xl border border-gray-200 bg-white text-gray-600 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
      >
        <option value="">类型</option>
        <option value="rent">租房</option>
        <option value="sale">买房</option>
      </select>
      <Button
        onClick={handleSearch}
        className="h-12 w-full sm:w-auto px-8 bg-[#FF6B35] hover:bg-[#e85a24] text-white rounded-xl font-medium"
      >
        搜索
      </Button>
    </div>
  )
}

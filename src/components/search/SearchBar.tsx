"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const router = useRouter()
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")
  const [type, setType] = useState("")

  function handleSearch() {
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    if (zip) params.set("zip", zip)
    if (type) params.set("type", type)
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 w-full">
      <Input
        placeholder="城市..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 h-12 rounded-xl border-gray-200 text-[#222222] placeholder:text-gray-400 text-sm focus-visible:ring-[#FF6B35]"
      />
      <Input
        placeholder="Zip Code"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-32 h-12 rounded-xl border-gray-200 text-[#222222] placeholder:text-gray-400 text-sm focus-visible:ring-[#FF6B35]"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-28 h-12 rounded-xl border border-gray-200 bg-white text-gray-600 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
      >
        <option value="">类型</option>
        <option value="rent">租房</option>
        <option value="sale">买房</option>
      </select>
      <Button
        onClick={handleSearch}
        className="h-12 px-8 bg-[#FF6B35] hover:bg-[#e85a24] text-white rounded-xl font-medium"
      >
        搜索
      </Button>
    </div>
  )
}

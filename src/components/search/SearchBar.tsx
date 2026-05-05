"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const router = useRouter()
  const [city, setCity] = useState("")
  const [type, setType] = useState("")

  function handleSearch() {
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    if (type) params.set("type", type)
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="flex gap-3 w-full max-w-2xl">
      <Input
        placeholder="输入城市或地区..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 bg-white text-gray-900 placeholder:text-gray-400"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-32 h-10 rounded-md border border-input bg-white text-gray-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">类型</option>
        <option value="rent">租房</option>
        <option value="sale">买房</option>
      </select>
      <Button onClick={handleSearch}>搜索</Button>
    </div>
  )
}

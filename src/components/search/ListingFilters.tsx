"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { US_STATES, CA_PROVINCES, COUNTRIES, PROPERTY_TYPE_LABELS } from "@/lib/constants"

const selectClass = "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"

export default function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [city, setCity] = useState(searchParams.get("city") ?? "")
  const [country, setCountry] = useState(searchParams.get("country") ?? "")
  const [state, setState] = useState(searchParams.get("state") ?? "")
  const [type, setType] = useState(searchParams.get("type") ?? "")
  const [propertyType, setPropertyType] = useState(searchParams.get("property_type") ?? "")
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") ?? "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") ?? "")
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "")
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") ?? "")

  const regions = country === "CA" ? CA_PROVINCES : country === "US" ? US_STATES : []
  const stateLabel = country === "CA" ? "省份" : "州"

  function handleCountryChange(val: string) {
    setCountry(val)
    setState("")
  }

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    if (country) params.set("country", country)
    if (state) params.set("state", state)
    if (type) params.set("type", type)
    if (propertyType) params.set("property_type", propertyType)
    if (minPrice) params.set("min_price", minPrice)
    if (maxPrice) params.set("max_price", maxPrice)
    if (bedrooms) params.set("bedrooms", bedrooms)
    if (bathrooms) params.set("bathrooms", bathrooms)
    router.push(`/listings?${params.toString()}`)
  }, [city, country, state, type, propertyType, minPrice, maxPrice, bedrooms, router])

  const handleReset = useCallback(() => {
    setCity(""); setCountry(""); setState(""); setType("")
    setPropertyType(""); setMinPrice(""); setMaxPrice(""); setBedrooms(""); setBathrooms("")
    router.push("/listings")
  }, [router])

  const hasFilters = city || country || state || type || propertyType || minPrice || maxPrice || bedrooms || bathrooms

  return (
    <div className="bg-white border rounded-xl p-4 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

        {/* 城市 */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">城市</label>
          <Input
            placeholder="Los Angeles"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* 国家 */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">国家</label>
          <select value={country} onChange={(e) => handleCountryChange(e.target.value)} className={selectClass}>
            <option value="">全部</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* 州 / 省（仅选国家后显示） */}
        {country && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">{stateLabel}</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass}>
              <option value="">全部</option>
              {regions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* 类型 */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">租 / 买</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
            <option value="">全部</option>
            <option value="rent">租房 For Rent</option>
            <option value="sale">买房 For Sale</option>
          </select>
        </div>

        {/* 户型 */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">户型</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={selectClass}>
            <option value="">全部</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* 价格 */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">最低价格（$）</label>
          <Input type="number" placeholder="0" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">最高价格（$）</label>
          <Input type="number" placeholder="不限" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>

        {/* 卧室 */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">最少卧室数</label>
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={selectClass}>
            <option value="">不限</option>
            <option value="1">1 bedroom+</option>
            <option value="2">2 bedrooms+</option>
            <option value="3">3 bedrooms+</option>
            <option value="4">4 bedrooms+</option>
          </select>
        </div>

        {/* 浴室 */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">最少浴室数</label>
          <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={selectClass}>
            <option value="">不限</option>
            <option value="1">1 bath+</option>
            <option value="1.5">1.5 baths+</option>
            <option value="2">2 baths+</option>
            <option value="2.5">2.5 baths+</option>
            <option value="3">3 baths+</option>
            <option value="3.5">3.5 baths+</option>
            <option value="4">4 baths+</option>
          </select>
        </div>

        {/* 按钮 */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 invisible">操作</label>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">搜索</Button>
            {hasFilters && (
              <Button variant="outline" onClick={handleReset} className="px-3">清空</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

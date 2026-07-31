import { PROPERTY_TYPE_LABELS } from "@/lib/constants"
import type { Listing } from "@/types"

export function getListingEditorialSummary(listing: Listing) {
  if (listing.editorial_summary?.trim()) return listing.editorial_summary.trim()

  const location = [listing.district, listing.city, listing.state].filter(Boolean).join("、") || "当前区域"
  const propertyType = PROPERTY_TYPE_LABELS[listing.property_type] ?? "住宅"
  const price = listing.price != null
    ? `$${listing.price.toLocaleString()}${listing.type === "rent" ? "/月" : ""}`
    : "价格待确认"
  const layout = `${listing.bedrooms}室${listing.bathrooms}卫`
  const area = listing.area && listing.area > 0 ? `，约 ${listing.area.toLocaleString()} 平方英尺` : ""

  return `这套${propertyType}位于${location}，当前标价${price}，户型为${layout}${area}。页面信息便于初步比较，实际可入住时间、费用包含范围及最新状态请在预约前再次确认。`
}

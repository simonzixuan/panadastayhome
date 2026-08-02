"use client"

import type { Listing } from "@/types"
import { trackEvent } from "@/lib/analytics"

export default function StickyContactBar({ listing }: { listing: Listing }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-[#222222]">
            {listing.price != null ? `$${listing.price.toLocaleString()}` : "价格待定"}
            {listing.type === "rent" && <span className="text-sm font-normal text-gray-400"> /月</span>}
          </p>
          <p className="text-xs text-gray-400">中文协助确认</p>
        </div>
        <a
          href="#contact-form"
          onClick={() => trackEvent("contact_click", {
            method: "mobile_sticky_bar",
            listing_id: listing.id,
          })}
          className="shrink-0 rounded-full bg-[#2F6B52] px-6 py-3 text-sm font-semibold text-white hover:bg-[#24543f]"
        >
          咨询 / 预约看房
        </a>
      </div>
    </div>
  )
}

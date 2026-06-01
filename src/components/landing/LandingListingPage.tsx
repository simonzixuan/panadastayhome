import Link from "next/link"
import InlineLeadForm from "@/components/leads/InlineLeadForm"
import ListingsGrid from "@/components/listings/ListingsGrid"
import type { Listing } from "@/types"

interface Props {
  title: string
  description: string
  listings: Listing[]
  source: string
}

export default function LandingListingPage({ title, description, listings, source }: Props) {
  return (
    <div className="bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="bg-white border rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="grid lg:grid-cols-[1fr_460px] gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">{title}</h1>
              <p className="mt-4 text-gray-500 leading-7 max-w-2xl">
                {description} 留下预算、入住时间和联系方式，我们用中文帮你确认房源并对接看房。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/listings" className="rounded-xl border px-4 py-2 text-sm font-medium hover:border-[#FF6B35] hover:text-[#FF6B35]">
                  浏览全部房源
                </Link>
                <Link href="/publish" className="rounded-xl border px-4 py-2 text-sm font-medium hover:border-[#FF6B35] hover:text-[#FF6B35]">
                  免费发布房源
                </Link>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-5">
              <h2 className="text-lg font-semibold mb-2">找不到合适的？</h2>
              <p className="text-sm text-gray-500 mb-4">告诉我们需求，我们帮你匹配。</p>
              <InlineLeadForm source={source} />
            </div>
          </div>
        </section>

        {listings.length > 0 ? (
          <ListingsGrid listings={listings} />
        ) : (
          <section className="bg-white border rounded-2xl p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">当前暂无完全匹配的公开房源</p>
            <p className="text-gray-500 mt-2 mb-6">可以先留下需求，我们帮你人工筛选。</p>
            <InlineLeadForm source={`${source}_empty`} />
          </section>
        )}
      </div>
    </div>
  )
}

import Link from "next/link"
import InlineLeadForm from "@/components/leads/InlineLeadForm"
import ListingsGrid from "@/components/listings/ListingsGrid"
import type { Listing } from "@/types"

interface Props {
  title: string
  description: string
  searchIntent: string
  listings: Listing[]
  source: string
  canonicalPath: string
  areas?: readonly string[]
  faqs?: readonly (readonly [string, string])[]
  parentLink?: { label: string; href: string }
  relatedLinks?: readonly { label: string; href: string }[]
}

export default function LandingListingPage({
  title,
  description,
  searchIntent,
  listings,
  source,
  canonicalPath,
  areas = [],
  faqs = [],
  parentLink,
  relatedLinks = [],
}: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.panadastayhome.com"
  const canonicalUrl = `${siteUrl}${canonicalPath}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        "name": title,
        "serviceType": "中文找房与房源确认服务",
        "provider": {
          "@type": "Organization",
          "name": "熊猫之家",
          "url": siteUrl,
        },
        "areaServed": searchIntent,
        "description": `${description} ${searchIntent}`,
        "url": canonicalUrl,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "首页", "item": siteUrl },
          ...(parentLink
            ? [{ "@type": "ListItem", "position": 2, "name": parentLink.label, "item": `${siteUrl}${parentLink.href}` }]
            : []),
          { "@type": "ListItem", "position": parentLink ? 3 : 2, "name": title, "item": canonicalUrl },
        ],
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonicalUrl}#faq`,
              "mainEntity": faqs.map(([question, answer]) => ({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": { "@type": "Answer", "text": answer },
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <div className="bg-[#F7F7F7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="bg-white border rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="grid lg:grid-cols-[1fr_460px] gap-8 items-center">
            <div>
              {parentLink && (
                <Link href={parentLink.href} className="mb-4 inline-flex text-sm text-gray-500 hover:text-[#FF6B35]">
                  ← {parentLink.label}
                </Link>
              )}
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">{title}</h1>
              <p className="mt-4 text-gray-500 leading-7 max-w-2xl">
                {description} 留下预算、入住时间和联系方式，我们用中文帮你确认房源并对接看房。
              </p>
              <p className="mt-3 text-sm text-gray-400">
                常见搜索：{searchIntent}
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
              <InlineLeadForm source={source} compact />
            </div>
          </div>
        </section>

        {listings.length > 0 ? (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">{title}房源推荐</h2>
            <ListingsGrid listings={listings} />
          </section>
        ) : (
          <section className="bg-white border rounded-2xl p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">当前暂无完全匹配的公开房源</p>
            <p className="text-gray-500 mt-2 mb-6">可以先留下需求，我们帮你人工筛选。</p>
            <InlineLeadForm source={`${source}_empty`} />
          </section>
        )}

        <section className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            ["适合谁", "留学生、新移民、华人家庭、短期过渡和长期居住用户。"],
            ["我们帮什么", "根据预算和入住时间筛选房源，确认是否可看房，并协助对接。"],
            ["怎么开始", "提交城市、预算、入住时间和微信或电话，不需要先注册账号。"],
          ].map(([heading, body]) => (
            <div key={heading} className="bg-white border rounded-xl p-5">
              <h2 className="font-semibold text-gray-900">{heading}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">{body}</p>
            </div>
          ))}
        </section>

        {(areas.length > 0 || relatedLinks.length > 0 || faqs.length > 0) && (
          <section className="mt-8 grid lg:grid-cols-[360px_1fr] gap-4">
            {(areas.length > 0 || relatedLinks.length > 0) && (
              <div className="bg-white border rounded-xl p-5">
                <h2 className="font-semibold text-gray-900">{relatedLinks.length > 0 ? "相关区域" : "热门区域"}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border bg-gray-50 px-3 py-1.5 text-sm text-gray-600 hover:border-[#FF6B35] hover:text-[#FF6B35]"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {areas.map((area) => (
                    <span key={area} className="rounded-full border bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {faqs.length > 0 && (
              <div className="bg-white border rounded-xl p-5">
                <h2 className="font-semibold text-gray-900">常见问题</h2>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  {faqs.map(([question, answer]) => (
                    <div key={question} className="rounded-xl bg-gray-50 p-4">
                      <h3 className="font-medium text-gray-900">{question}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-500">{answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

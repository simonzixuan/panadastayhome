import SearchBar from "@/components/search/SearchBar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import HomeLeadForm from "@/components/leads/HomeLeadForm"
import { CheckCircle2, ClipboardList, Home, MapPin, MessageCircle, Search, ShieldCheck, Sparkles, UserRoundCheck } from "lucide-react"

const features = [
  {
    icon: Home,
    title: "租房",
    desc: "找公寓、合租、整租，先确认再联系",
    href: "/listings?type=rent",
    label: "浏览租房",
  },
  {
    icon: MapPin,
    title: "买房",
    desc: "中文沟通，适合新移民和华人家庭",
    href: "/listings?type=sale",
    label: "浏览买房",
  },
  {
    icon: Sparkles,
    title: "发布房源",
    desc: "免费发布，我们帮你做中文推广",
    href: "/publish",
    label: "立即发布",
  },
]

const steps = [
  { icon: ClipboardList, title: "提交需求", desc: "城市、预算、入住时间" },
  { icon: Search, title: "筛选房源", desc: "按你的条件做初筛" },
  { icon: ShieldCheck, title: "确认信息", desc: "减少过期和无效房源" },
  { icon: UserRoundCheck, title: "对接看房", desc: "联系房东或经纪人" },
]

const cities = [
  ["温哥华租房", "/city/vancouver"],
  ["多伦多租房", "/city/toronto"],
  ["洛杉矶租房", "/city/los-angeles"],
  ["西雅图租房", "/city/seattle"],
  ["纽约租房", "/city/new-york"],
  ["UBC 附近租房", "/schools/ubc"],
]

export default function HomePage() {
  return (
    <div className="bg-[#F7F7F7] text-[#222222]">
      <section className="relative overflow-hidden bg-white px-4 pt-14 pb-16">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[#F7F7F7]" />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="py-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1EA] px-3 py-1.5 text-sm font-medium text-[#FF6B35] mb-5">
              <MessageCircle className="size-4" />
              华人找房助手
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5 tracking-normal">
              北美华人找房，<br />中文帮你确认
            </h1>
            <p className="text-gray-500 text-lg leading-8 mb-8 max-w-xl">
              不用自己到处问群、筛假房源、联系房东。告诉我们城市、预算和入住时间，我们帮你筛选房源、确认信息，并对接房东或经纪人。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#find-help">
                <Button className="h-12 px-7 bg-[#FF6B35] hover:bg-[#e85a24] text-white">
                  提交找房需求
                </Button>
              </a>
              <Link href="/listings">
                <Button variant="outline" className="h-12 px-7">
                  浏览房源
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl text-sm">
              {[
                ["中文沟通", "适合留学生、新移民、华人家庭"],
                ["人工确认", "减少过期房源和无效沟通"],
                ["不用注册", "先留下需求，再帮你匹配"],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-2.5 rounded-xl border bg-white/80 p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#FF6B35]" />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-gray-400 mt-1 leading-5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-8 hidden h-36 w-36 rounded-full bg-[#FF6B35]/10 lg:block" />
            <div className="absolute -left-10 bottom-8 hidden h-28 w-28 rounded-full bg-blue-100 lg:block" />
            <div id="find-help" className="relative bg-white border rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.12)] p-6">
              <div className="mb-5 overflow-hidden rounded-xl border bg-gray-50">
                <div className="h-32 bg-[linear-gradient(135deg,#fff7f3_0%,#f5fbff_50%,#ffffff_100%)] p-4">
                  <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-3">
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <p className="text-xs font-medium text-gray-400">找房需求</p>
                      <p className="mt-2 text-sm font-semibold">多伦多 2B，7月入住</p>
                      <p className="mt-1 text-xs text-gray-400">预算 $2500-3000/月</p>
                      <div className="mt-3 h-2 w-24 rounded-full bg-[#FF6B35]/20" />
                    </div>
                    <div className="rounded-lg bg-[#222222] p-3 text-white shadow-sm">
                      <p className="text-xs text-white/60">已确认</p>
                      <p className="mt-2 text-2xl font-bold">3</p>
                      <p className="text-xs text-white/60">套可约看房</p>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">先告诉我们你想找什么房</h2>
              <p className="text-sm text-gray-500 mb-5">我们会把合适房源和看房方式发给你。</p>
              <HomeLeadForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F7] px-4 py-10">
        <div className="max-w-6xl mx-auto rounded-2xl bg-white border p-5 shadow-sm">
          <div className="grid md:grid-cols-4 gap-3">
            {steps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1EA] text-[#FF6B35]">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-y px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">也可以直接搜房源</h2>
              <p className="text-sm text-gray-400 mt-1">已有目标城市或 Zip Code，可以先浏览现有房源。</p>
            </div>
          </div>
          <SearchBar />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-14 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">热门找房入口</h2>
            <p className="text-gray-400 mt-2">先从城市、学校和生活圈开始。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cities.map(([city, href]) => (
              <Link
                key={city}
                href={href}
                className="rounded-full border bg-white px-4 py-2 text-sm text-gray-600 hover:border-[#FF6B35] hover:text-[#FF6B35]"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, href, label }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-7 border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#FFF1EA] text-[#FF6B35]">
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#222222] mb-2">{title}</h3>
              <p className="text-gray-400 text-sm mb-6">{desc}</p>
              <Link href={href}>
                <Button className="w-full bg-[#FF6B35] hover:bg-[#e85a24] text-white rounded-xl h-11 font-medium">
                  {label}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

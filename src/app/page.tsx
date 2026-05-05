import SearchBar from "@/components/search/SearchBar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: "🏠",
    title: "租房",
    desc: "按月租，灵活居住",
    href: "/listings?type=rent",
    label: "浏览租房",
  },
  {
    icon: "🏡",
    title: "买房",
    desc: "置业安家，长久居住",
    href: "/listings?type=sale",
    label: "浏览买房",
  },
  {
    icon: "📝",
    title: "发布房源",
    desc: "免费发布，快速出租",
    href: "/publish",
    label: "立即发布",
  },
]

export default function HomePage() {
  return (
    <div className="bg-[#F7F7F7]">
      {/* Hero */}
      <section className="bg-white px-4 pt-20 pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#222222] leading-tight mb-5">
            找到你的<br />理想家园
          </h1>
          <p className="text-gray-400 text-lg mb-12">
            海量真实房源，轻松找到心仪的家
          </p>

          {/* Floating search card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-3 max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc, href, label }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              <div className="text-5xl mb-5">{icon}</div>
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

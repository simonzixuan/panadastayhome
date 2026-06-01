import SearchBar from "@/components/search/SearchBar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import HomeLeadForm from "@/components/leads/HomeLeadForm"

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
    <div className="bg-[#F7F7F7] text-[#222222]">
      <section className="bg-white px-4 pt-16 pb-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
              北美华人找房，<br />中文帮你确认
            </h1>
            <p className="text-gray-500 text-lg leading-8 mb-8 max-w-2xl">
              告诉我们城市、预算和入住时间，我们帮你筛选房源、确认信息，并对接房东或经纪人。
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
            <div className="grid grid-cols-3 gap-4 max-w-xl text-sm">
              <div>
                <p className="font-semibold">中文沟通</p>
                <p className="text-gray-400 mt-1">适合留学生、新移民、华人家庭</p>
              </div>
              <div>
                <p className="font-semibold">人工确认</p>
                <p className="text-gray-400 mt-1">减少过期房源和无效沟通</p>
              </div>
              <div>
                <p className="font-semibold">不用注册</p>
                <p className="text-gray-400 mt-1">先留下需求，再帮你匹配</p>
              </div>
            </div>
          </div>

          <div id="find-help" className="bg-white border rounded-2xl shadow-[0_12px_50px_rgba(0,0,0,0.10)] p-6">
            <h2 className="text-xl font-bold mb-2">先告诉我们你想找什么房</h2>
            <p className="text-sm text-gray-500 mb-5">我们会把合适房源和看房方式发给你。</p>
            <HomeLeadForm />
          </div>
        </div>
      </section>

      <section className="bg-white border-t px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <SearchBar />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(({ icon, title, desc, href, label }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-7 text-center border shadow-sm hover:shadow-md transition-shadow"
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

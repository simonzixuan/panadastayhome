import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ClipboardCheck, MessageCircle, ShieldCheck, UserRoundCheck } from "lucide-react"

const steps = [
  ["提交需求", "告诉我们城市、预算、入住时间和联系方式。"],
  ["人工筛选", "我们根据条件初筛房源，减少过期、重复和明显无效信息。"],
  ["确认信息", "优先确认是否可看房、是否支持中文沟通、联系方式是否有效。"],
  ["对接看房", "把合适房源和下一步看房方式发给你。"],
]

const trustItems = [
  ["不公开联系方式", "找房需求和联系方式只用于人工匹配，不会展示在公开页面。"],
  ["房源先审核", "新发布房源默认等待审核，通过后才公开展示。"],
  ["中文沟通优先", "面向留学生、新移民和华人家庭，降低跨语言沟通成本。"],
]

export const metadata = {
  title: "关于熊猫之家 Panda Stay Home",
  description: "熊猫之家 Panda Stay Home 是面向北美华人的租房找房平台，帮助留学生、新移民和华人家庭提交需求、确认房源并对接看房。",
}

export default function AboutPage() {
  return (
    <div className="bg-[#F7F7F7]">
      <section className="bg-white border-b px-4 py-12">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF1EC] px-3 py-1.5 text-sm font-medium text-[#2F6B52] mb-5">
              <ShieldCheck className="size-4" />
              熊猫之家 Panda Stay Home
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              熊猫之家帮北美华人把租房找房变简单一点
            </h1>
            <p className="mt-5 text-gray-500 leading-8 max-w-2xl">
              熊猫之家 Panda Stay Home 是面向北美华人的租房找房平台，服务留学生、新移民、华人家庭、房东和经纪人。我们不是只做一个房源列表，而是帮用户提交需求、筛选房源、确认信息，并把合适的沟通方式对接起来。
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link href="/#find-help">
                <Button className="bg-[#2F6B52] hover:bg-[#24543f] text-white">提交找房需求</Button>
              </Link>
              <Link href="/publish">
                <Button variant="outline">发布房源合作</Button>
              </Link>
            </div>
          </div>
          <div className="bg-gray-50 border rounded-2xl p-5">
            {trustItems.map(([title, body]) => (
              <div key={title} className="flex gap-3 py-4 first:pt-0 last:pb-0 border-b last:border-b-0">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#2F6B52]" />
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map(([title, body], index) => (
            <div key={title} className="bg-white border rounded-xl p-5">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#EAF1EC] text-[#2F6B52] font-bold">
                {index + 1}
              </div>
              <h2 className="mt-4 font-semibold text-gray-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="bg-white border rounded-2xl p-6 md:p-8 grid md:grid-cols-3 gap-5">
          <div>
            <MessageCircle className="size-6 text-[#2F6B52]" />
            <h2 className="mt-3 font-semibold text-gray-900">找房用户</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">留下城市、预算和入住时间，我们会根据条件帮你匹配。</p>
          </div>
          <div>
            <ClipboardCheck className="size-6 text-[#2F6B52]" />
            <h2 className="mt-3 font-semibold text-gray-900">房东/经纪人</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">免费提交房源，审核通过后公开展示，并用于中文渠道推广。</p>
          </div>
          <div>
            <UserRoundCheck className="size-6 text-[#2F6B52]" />
            <h2 className="mt-3 font-semibold text-gray-900">联系方式</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">目前优先通过站内表单收集需求，再由人工通过你留下的微信或电话联系。</p>
          </div>
        </div>
      </section>
    </div>
  )
}

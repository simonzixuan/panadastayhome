import type { Metadata } from "next"
import Link from "next/link"
import RentalCheckLeadForm from "@/components/leads/RentalCheckLeadForm"
import RentalRiskTest from "@/components/leads/RentalRiskTest"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileText, MessageCircle, SearchCheck, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "付款前房源核实",
  description: "小红书、微信、Facebook 房源付款前先查风险，避免押金和合同骗局。",
}

const recentFindings = [
  "房东身份与收款人不一致",
  "房租低于同区域常见价格 40%",
  "合同缺少押金退款条款",
  "未视频看房就要求 Zelle / Wise 付款",
]

const checks = [
  "租金是否明显低于市场",
  "图片、地址、房源描述是否互相矛盾",
  "房东/中介身份和收款人是否一致",
  "是否要求没看房先转押金",
  "合同和付款流程是否有明显风险",
]

const trustPoints = [
  "AI 初筛 + 人工核实",
  "中文回复，适合留学生和家长",
  "10-30 分钟给初步判断",
  "不做真实性背书，只做付款前风险判断",
]

const deliverables = [
  "低 / 中 / 高风险等级",
  "主要风险点 3-5 条",
  "现在是否建议付款",
  "下一句该怎么问房东",
  "是否建议继续沟通",
]

const plans = [
  { name: "付款前人工快查", price: "$19 / ¥139", desc: "适合把截图发给我们，10-30 分钟拿到一句明确付款建议。" },
  { name: "人工核实 1 个房源", price: "$49 / ¥349", desc: "适合准备约看房或继续聊，人工看地址、价格、发布者和聊天风险。" },
  { name: "合同/付款前核实", price: "$99 / ¥699", desc: "适合对方已经发合同或催付款，重点看合同、收款人和付款流程。" },
]

const serviceTiers = [
  {
    title: "付款前人工快查",
    price: "$19 / ¥139",
    bestFor: "适合已经有截图或聊天记录，想快速知道现在能不能继续。",
    includes: ["人工看 1 个房源截图/链接", "聊天关键截图快查", "付款方式风险判断", "一句明确建议：继续聊/暂停/停止"],
    excludes: "不看长合同，不跟进后续聊天，不做详细身份核实。",
  },
  {
    title: "人工核实 1 个房源",
    price: "$49 / ¥349",
    bestFor: "适合已经和对方聊过，准备约看房或继续推进。",
    includes: ["人工看 1 个房源", "检查地址、租金、图片、发布者信息", "分析聊天风险点", "给中英文下一步话术", "可补充 1 轮材料"],
    excludes: "不看长合同，不做付款前最终检查。",
  },
  {
    title: "合同/付款前核实",
    price: "$99 / ¥699",
    bestFor: "适合已经收到合同，或对方正在催押金/首月租。",
    includes: ["房源和聊天记录风险分析", "合同重点检查", "收款方式和收款人检查", "付款前 checklist", "是否建议付款/暂停/停止"],
    excludes: "不代签合同，不代付押金，不提供法律意见。",
  },
  {
    title: "已经很急，需要全程陪跑",
    price: "$199 起 / ¥1399 起",
    bestFor: "适合 7 天内必须定房，想有人陪你筛到付款前。",
    includes: ["7 天内最多核实 3 个房源", "跟进房东/中介回复", "帮写英文沟通话术", "合同重点检查", "付款前最终检查"],
    excludes: "不保证租到，不做真实性背书，超过 3 个房源需加购。",
  },
]

export default function RentalCheckPage() {
  return (
    <div className="bg-[#F7F7F7] text-[#222222]">
      <section className="bg-white px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FFF1EA] px-3 py-1.5 text-sm font-medium text-[#FF6B35]">
              <ShieldCheck className="size-4" />
              Panda Stay Home 房源核实
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-normal">
              签合同前花 $19，避免被骗几千美元押金
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-500">
              小红书、微信群租房？付款前先查一遍。我们不对房源做真实性背书，只帮你判断押金、合同、收款人和房东身份里的高风险信号。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#risk-test">
                <Button className="h-12 px-7 bg-[#FF6B35] hover:bg-[#e85a24] text-white">
                  免费测风险
                </Button>
              </a>
              <Link href="/listings">
                <Button variant="outline" className="h-12 px-7">
                  浏览已发布房源
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["10-30 分钟", "先给初步判断"],
                ["付款前", "重点看押金和收款风险"],
                ["中文回复", "直接告诉你哪里危险"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-xl border bg-white p-4">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="risk-test">
            <RentalRiskTest />
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-bold">最近发现的高风险信号</h2>
            <p className="mt-3 text-gray-500 leading-7">
              这些问题只要踩中一个，几千美元押金就可能很难追回。先做初筛，再决定要不要继续。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {recentFindings.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border bg-white p-4">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#FF6B35]" />
                <p className="text-sm font-medium leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-y px-4 py-12">
        <div className="max-w-6xl mx-auto grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-bold">为什么相信 Panda House</h2>
            <p className="mt-3 text-gray-500 leading-7">
              我们是面向北美华人的租房平台，长期处理租房信息、房源发布和中文找房需求。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trustPoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border bg-white p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#FF6B35]" />
                <p className="text-sm font-medium leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-bold">我们具体查什么</h2>
            <p className="mt-3 text-gray-500 leading-7">
              这个服务不承诺 100% 保真，也不替房源做认证。目标是在你付款前发现明显骗局、异常条款和不合理付款要求。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {checks.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border bg-white p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#FF6B35]" />
                <p className="text-sm font-medium leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-y px-4 py-12">
        <div className="max-w-6xl mx-auto grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-bold">你会收到什么</h2>
            <p className="mt-3 text-gray-500 leading-7">
              我们给的是付款前决策建议，不是泛泛提醒。你可以直接照着结论继续问房东，或先暂停付款。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {deliverables.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border bg-white p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#FF6B35]" />
                <p className="text-sm font-medium leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div id="top-form" className="max-w-3xl mx-auto rounded-2xl border bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
          <h2 className="text-xl font-bold">提交房源，获取人工报告</h2>
          <p className="mt-2 mb-5 text-sm leading-6 text-gray-500">
            先提交信息，我们确认范围后发付款链接。截图和合同可以先在微信里补发。
          </p>
          <p className="mb-4 rounded-xl bg-[#FFF1EA] px-4 py-3 text-sm leading-6 text-[#B94820]">
            支持美元 / 加币 / 人民币付款。国内用户可用微信或支付宝，北美用户可用信用卡、e-Transfer 或 Zelle。
          </p>
          <RentalCheckLeadForm />
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold">适合这些情况</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { icon: AlertTriangle, title: "对方催你今天转押金", desc: "房源看起来很好，但对方一直催付款或说很多人抢。" },
              { icon: MessageCircle, title: "只在小红书/微信聊过", desc: "没有正规平台记录，也不知道对方是不是房东本人。" },
              { icon: FileText, title: "已经收到合同", desc: "准备签约前，想先看合同和付款流程有没有明显风险。" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border bg-white p-6">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#FFF1EA] text-[#FF6B35]">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-y px-4 py-12">
        <div className="max-w-6xl mx-auto grid gap-6 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
          <div>
            <h2 className="text-2xl font-bold">不想冒险？也可以直接看 Panda House 房源</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              如果你不想继续和陌生房东来回确认，可以先看我们站内已发布房源，或者直接提交城市、预算和入住时间，让我们帮你匹配。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link href="/listings">
              <Button className="h-11 w-full bg-[#FF6B35] px-6 text-white hover:bg-[#e85a24] sm:w-auto">
                浏览房源
              </Button>
            </Link>
            <Link href="/#find-help">
              <Button variant="outline" className="h-11 w-full px-6 sm:w-auto">
                帮我找房
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-xl border bg-white p-6">
              <p className="text-sm font-medium text-[#FF6B35]">{plan.name}</p>
              <p className="mt-3 text-3xl font-bold">{plan.price}</p>
              <p className="mt-3 min-h-16 text-sm leading-6 text-gray-500">{plan.desc}</p>
              <a href="#top-form" className="mt-5 inline-flex text-sm font-semibold text-[#FF6B35]">
                先提交房源
              </a>
            </div>
          ))}
          <p className="md:col-span-3 text-sm leading-6 text-gray-500">
            不确定选哪个？只想快速看一眼先选 $19；要完整核实 1 个房源选 $49；已经有合同或要付款选 $99。
          </p>
          <p className="md:col-span-3 rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-gray-500">
            付款方式：国内支持微信 / 支付宝 / 人民币转账；北美支持信用卡 / e-Transfer / Zelle。提交后我们会按你所在地区发送对应付款方式。
          </p>
        </div>
      </section>

      <section className="bg-white border-y px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 max-w-2xl">
              <h2 className="text-2xl font-bold">四档服务怎么选</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              免费自查只是入口；$19 是人工快查；$49 是完整核实 1 个房源；$99 才看合同和付款细节；$199 是 7 天陪跑。
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {serviceTiers.map((tier) => (
              <div key={tier.title} className="rounded-xl border bg-white p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{tier.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{tier.bestFor}</p>
                  </div>
                  <p className="shrink-0 text-lg font-bold text-[#FF6B35]">{tier.price}</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold">包含</p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-gray-500">
                      {tier.includes.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">不包含</p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">{tier.excludes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14">
        <div className="max-w-6xl mx-auto rounded-2xl bg-[#222222] p-6 text-white md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: ClipboardCheck, title: "提交材料", desc: "房源链接、聊天记录、地址、租金、付款要求。" },
              { icon: SearchCheck, title: "风险检查", desc: "先看价格、地址、图片、身份、付款和合同。" },
              { icon: ShieldCheck, title: "给你结论", desc: "低/中/高风险，附下一步该问对方的话术。" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FF6B35]">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

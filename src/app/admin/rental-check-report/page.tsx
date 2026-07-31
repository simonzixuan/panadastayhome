"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const serviceTypes = [
  "$19 付款前人工快查",
  "$49 人工核实 1 个房源",
  "$99 合同/付款前核实",
  "$199 签约前陪跑",
]

const scamPatterns = [
  "租金明显低于同区域市场价",
  "未看房/未视频看房前要求押金或首月租",
  "催促今天付款保留房源",
  "房东人在外地/国外，无法现场或视频核实",
  "图片疑似盗用或出现在其他地址/平台",
  "收款人和房东/合同人不一致",
  "要求 Zelle / Wise / wire / crypto / gift card 等难追回付款方式",
  "合同缺少房东姓名、地址、租期、押金或退款条款",
  "小红书/微信账号新号，或频繁发布不同城市房源",
]

const defaultScript =
  "Before I send any deposit, could we do a live video tour of the unit and building entrance? Could you also confirm that the name on the lease matches the payment recipient?"

function toLines(value: string, fallback: string) {
  const lines = value
    .split(/[；;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)

  return lines.length > 0 ? lines.map((item) => `- ${item}`).join("\n") : `- ${fallback}`
}

export default function RentalCheckReportPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([])
  const [form, setForm] = useState({
    serviceType: "$49 人工核实 1 个房源",
    customer: "",
    city: "",
    listing: "",
    rent: "",
    riskLevel: "中风险",
    recommendation: "可以继续沟通，但暂时不要付款",
    riskPoints: "",
    missingVerification: "视频看房；确认合同姓名和收款人一致；确认房东或中介授权证明",
    contractNotes: "",
    paymentNotes: "",
    followUpStatus: "",
    script: defaultScript,
    pandaSuggestion: "建议先补齐以上验证，再决定是否继续。若对方拒绝补充验证，建议停止沟通并改看 Panda House 房源。",
    reviewer: "",
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || user.app_metadata?.role !== "admin") {
        router.replace("/")
      } else {
        setReady(true)
      }
    })
  }, [router])

  const report = useMemo(() => {
    const header = `客户：${form.customer || "未填写"}
城市/区域：${form.city || "未填写"}
房源信息：${form.listing || "未填写"}
租金/房型：${form.rent || "未填写"}
服务类型：${form.serviceType}`
    const patterns = selectedPatterns.length > 0
      ? selectedPatterns.map((item) => `- ${item}`).join("\n")
      : "- 暂未匹配到明确骗局模式，但仍需完成付款前验证"
    const riskPoints = toLines(form.riskPoints, "暂未填写具体风险点")
    const missingVerification = toLines(form.missingVerification, "暂未填写")
    const contractNotes = toLines(form.contractNotes, "未提供合同，暂未做合同重点检查")
    const paymentNotes = toLines(form.paymentNotes, "暂未填写收款方式或收款人信息")
    const followUpStatus = toLines(form.followUpStatus, "暂未填写陪跑进度")
    const disclaimer = `说明：本报告不对房源真实性做背书，不代表房源 100% 真实。Panda House 不替用户付款、不代签合同、不提供法律意见，只基于你提供的信息做付款前风险核实和沟通建议。`

    if (form.serviceType === "$19 付款前人工快查") {
      return `付款前人工快查结果

${header}

结论
风险等级：${form.riskLevel}
当前建议：${form.recommendation}

本次快查范围
- 房源链接/截图
- 聊天关键截图
- 租金、地址、付款要求里的明显风险
- 不包含长合同审查、后续聊天跟进、详细身份核实

匹配到的常见骗局信号
${patterns}

我们看到的主要问题
${riskPoints}

付款前还需要补齐
${missingVerification}

${disclaimer}

核实人：${form.reviewer || "Panda House"}
`
    }

    if (form.serviceType === "$99 合同/付款前核实") {
      return `合同/付款前风险核实报告

${header}

一、结论
风险等级：${form.riskLevel}
当前建议：${form.recommendation}

二、本档核实范围
- 房源和聊天记录风险分析
- 合同重点检查
- 收款方式和收款人检查
- 付款前 checklist
- 是否建议付款/暂停/停止

三、匹配到的常见骗局模式
${patterns}

四、房源和聊天记录风险点
${riskPoints}

五、合同重点检查
${contractNotes}

六、收款方式和付款风险
${paymentNotes}

七、付款前必须完成
${missingVerification}

八、建议发给对方的话术
${form.script || defaultScript}

九、Panda House 建议
${form.pandaSuggestion || "建议补充验证后再决定是否继续。"}

${disclaimer}

核实人：${form.reviewer || "Panda House"}
`
    }

    if (form.serviceType === "$199 签约前陪跑") {
      return `签约前陪跑进度报告

${header}

一、当前总判断
风险等级：${form.riskLevel}
当前建议：${form.recommendation}

二、陪跑进度
${followUpStatus}

三、已发现的风险点
${riskPoints}

四、匹配到的常见骗局模式
${patterns}

五、合同/付款前检查
合同重点：
${contractNotes}

收款和付款方式：
${paymentNotes}

六、下一步沟通动作
${form.script || defaultScript}

七、Panda House 建议
${form.pandaSuggestion || "建议继续跟进可验证房源，暂停高风险房源。"}

服务范围提醒：本档为 7 天内陪跑，最多核实 3 个房源。超过 3 个房源需加购。
${disclaimer}

核实人：${form.reviewer || "Panda House"}
`
    }

    return `房源人工核实报告

${header}

一、结论
风险等级：${form.riskLevel}
当前建议：${form.recommendation}

二、本档核实范围
- 人工核实 1 个房源
- 检查地址、租金、图片、发布者信息
- 分析已提供的聊天风险点
- 给下一步沟通话术
- 不包含长合同审查和付款前最终检查

三、匹配到的常见骗局模式
${patterns}

四、本房源主要风险点
${riskPoints}

五、还缺哪些验证
${missingVerification}

六、建议发给对方的话术
${form.script || defaultScript}

中文说明：付款前先要求 live video tour，并确认合同姓名、收款人、授权关系一致。如果对方拒绝、催促、转移话题，风险等级应上调。

七、Panda House 建议
${form.pandaSuggestion || "建议补充验证后再决定是否继续。"}

${disclaimer}

核实人：${form.reviewer || "Panda House"}
`
  }, [form, selectedPatterns])

  async function copyReport() {
    await navigator.clipboard.writeText(report)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function updateField(name: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function togglePattern(pattern: string) {
    setSelectedPatterns((prev) => (
      prev.includes(pattern) ? prev.filter((item) => item !== pattern) : [...prev, pattern]
    ))
  }

  if (!ready) return null

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-4 py-8 text-[#222222]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#EAF1EC] px-3 py-1.5 text-sm font-medium text-[#2F6B52]">
              <ShieldCheck className="size-4" />
              房源核实报告模板
            </div>
            <h1 className="text-3xl font-bold">自动生成客户报告</h1>
            <p className="mt-2 text-sm text-gray-500">按客户购买档位生成不同报告：人工快查、单房源核实、合同/付款前核实、签约前陪跑。</p>
          </div>
          <Button onClick={copyReport} className="h-11 bg-[#2F6B52] text-white hover:bg-[#24543f]">
            <Copy className="size-4" />
            {copied ? "已复制" : "复制报告"}
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[520px_minmax(0,1fr)]">
          <div className="space-y-4 rounded-xl border bg-white p-5">
            <select
              value={form.serviceType}
              onChange={(e) => updateField("serviceType", e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
            >
              {serviceTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input value={form.customer} onChange={(e) => updateField("customer", e.target.value)} placeholder="客户称呼" />
              <Input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="城市/区域" />
            </div>
            <Input value={form.listing} onChange={(e) => updateField("listing", e.target.value)} placeholder="房源链接/地址/小区" />
            <Input value={form.rent} onChange={(e) => updateField("rent", e.target.value)} placeholder="租金/房型，例如 $2500 1B1B" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                value={form.riskLevel}
                onChange={(e) => updateField("riskLevel", e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              >
                <option>低风险</option>
                <option>中风险</option>
                <option>高风险</option>
              </select>
              <select
                value={form.recommendation}
                onChange={(e) => updateField("recommendation", e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              >
                <option>可以继续沟通，但暂时不要付款</option>
                <option>暂停付款，先补充验证</option>
                <option>不建议继续沟通</option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">匹配到的骗局模式</p>
              <div className="grid gap-2">
                {scamPatterns.map((pattern) => (
                  <label key={pattern} className="flex gap-2 rounded-lg border px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedPatterns.includes(pattern)}
                      onChange={() => togglePattern(pattern)}
                      className="mt-1"
                    />
                    <span>{pattern}</span>
                  </label>
                ))}
              </div>
            </div>

            <textarea value={form.riskPoints} onChange={(e) => updateField("riskPoints", e.target.value)} placeholder="本房源主要风险点，一行一个" className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <textarea value={form.missingVerification} onChange={(e) => updateField("missingVerification", e.target.value)} placeholder="还缺哪些验证，用分号或换行分隔" className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <textarea value={form.contractNotes} onChange={(e) => updateField("contractNotes", e.target.value)} placeholder="合同重点检查，$99/$199 使用" className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <textarea value={form.paymentNotes} onChange={(e) => updateField("paymentNotes", e.target.value)} placeholder="收款方式和付款风险，$99/$199 使用" className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <textarea value={form.followUpStatus} onChange={(e) => updateField("followUpStatus", e.target.value)} placeholder="陪跑进度，$199 使用，例如：房源1 高风险已停止；房源2 等待视频看房" className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <textarea value={form.script} onChange={(e) => updateField("script", e.target.value)} placeholder="建议发给房东的英文/中文话术" className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <textarea value={form.pandaSuggestion} onChange={(e) => updateField("pandaSuggestion", e.target.value)} placeholder="Panda House 建议" className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <Input value={form.reviewer} onChange={(e) => updateField("reviewer", e.target.value)} placeholder="核实人" />
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">报告预览</h2>
              <Button variant="outline" onClick={copyReport}>
                <Copy className="size-4" />
                {copied ? "已复制" : "复制"}
              </Button>
            </div>
            <pre className="min-h-[720px] whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-800">
              {report}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

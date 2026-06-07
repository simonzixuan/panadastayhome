"use client"

import { useState } from "react"
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RentalRiskTest() {
  const [result, setResult] = useState<null | { level: string; points: string[] }>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const rent = Number(String(form.get("rent") ?? "").replace(/[^\d.]/g, ""))
    const platform = String(form.get("platform") ?? "")
    const toured = String(form.get("toured") ?? "")
    const deposit = String(form.get("deposit") ?? "")
    const payment = String(form.get("payment") ?? "")
    const points: string[] = []

    if (platform.includes("小红书") || platform.includes("微信") || platform.includes("Facebook")) {
      points.push("来自社交平台，需要额外确认发布者身份")
    }
    if (toured === "no") points.push("还没有 live video tour 或现场看房")
    if (deposit === "yes") points.push("对方已经要求押金或首月租")
    if (payment === "hard") points.push("付款方式追回难度较高")
    if (rent > 0 && rent < 1800) points.push("租金可能低于热门城市常见区间，需对比市场价")

    const level = points.length >= 3 ? "高风险" : points.length >= 1 ? "中风险" : "低风险"
    setResult({ level, points: points.length > 0 ? points : ["暂未发现明显高风险信号，但仍需完成付款前验证"] })
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
      <h2 className="text-xl font-bold">免费 30 秒自查</h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        只根据你填的几项信息做初步判断，不看聊天记录、合同和收款人。
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <Input name="city" placeholder="城市，例如 Los Angeles / Vancouver" />
        <Input name="rent" placeholder="月租，例如 1800" />
        <select name="platform" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none">
          <option>小红书 / 微信 / Facebook</option>
          <option>Zillow / Apartments / 正规公寓官网</option>
          <option>朋友介绍</option>
          <option>其他平台</option>
        </select>
        <select name="toured" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none">
          <option value="no">还没视频/现场看房</option>
          <option value="yes">已经完成 live video tour 或现场看房</option>
        </select>
        <select name="deposit" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none">
          <option value="yes">对方已要求押金/首月租</option>
          <option value="no">对方还没要求付款</option>
        </select>
        <select name="payment" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none">
          <option value="hard">Zelle / Wise / wire / 微信转账等</option>
          <option value="normal">信用卡 / 正规平台 / 公寓官网</option>
          <option value="unknown">还不知道付款方式</option>
        </select>
        <Button type="submit" className="h-11 w-full bg-[#FF6B35] text-white hover:bg-[#e85a24]">
          立即看初步风险
        </Button>
      </form>

      {result && (
        <div className="mt-5 rounded-xl border bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            {result.level === "低风险" ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : (
              <AlertTriangle className="size-5 text-[#FF6B35]" />
            )}
            <p className="font-semibold">初步结果：{result.level}</p>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm leading-6 text-gray-500">
            {result.points.map((point) => (
              <li key={point}>- {point}</li>
            ))}
          </ul>
          <a href="#top-form" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6B35]">
            让人工核实这个房源 <ArrowRight className="size-4" />
          </a>
        </div>
      )}
    </div>
  )
}

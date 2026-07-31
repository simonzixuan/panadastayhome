"use client"

import { useState } from "react"
import Link from "next/link"
import { LockKeyhole, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trackEvent } from "@/lib/analytics"

export default function RentalCheckLeadForm() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const message = [
      `套餐：${form.get("plan") || ""}`,
      `城市/区域：${form.get("city") || ""}`,
      `房源链接：${form.get("listing_url") || ""}`,
      `地址/小区：${form.get("address") || ""}`,
      `月租/房型：${form.get("rent") || ""}`,
      `对方要求付款：${form.get("payment_request") || ""}`,
      `补充说明：${form.get("notes") || ""}`,
    ].join("\n")

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        contact: form.get("contact"),
        budget: form.get("rent"),
        move_in_date: "",
        message,
        source: "rental-check",
        referrer: document.referrer || "",
        current_path: `${window.location.pathname}${window.location.search}`,
      }),
    })

    setSubmitting(false)

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? "提交失败，请重试")
      return
    }

    trackEvent("generate_lead", {
      lead_source: "rental_check",
      lead_type: "rental_check",
    })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-800">
        <p className="font-semibold">已收到房源信息</p>
        <p className="mt-1 text-sm leading-6">
          我们会先看风险点，再通过你留下的联系方式回复下一步。等待期间，你也可以先看 Panda House 房源或提交找房需求。
        </p>
        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium leading-6 text-green-900">
          如果今天就要付款，请直接加微信发送截图，备注“房源核实”。
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link href="/listings">
            <Button className="h-10 w-full bg-[#FF6B35] text-white hover:bg-[#e85a24]">
              浏览房源
            </Button>
          </Link>
          <Link href="/#find-help">
            <Button variant="outline" className="h-10 w-full border-green-300 bg-white text-green-800 hover:bg-green-100">
              帮我找房
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input name="name" placeholder="称呼 *" required />
        <Input name="contact" placeholder="微信或电话 *" required />
      </div>

      <select
        name="plan"
        defaultValue="人工核实 1 个房源 - $49 / ¥349"
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <option>付款前人工快查 - $19 / ¥139</option>
        <option>人工核实 1 个房源 - $49 / ¥349</option>
        <option>合同/付款前核实 - $99 / ¥699</option>
        <option>已经很急，需要全程陪跑 - $199 起 / ¥1399 起</option>
      </select>
      <p className="-mt-2 text-xs leading-5 text-gray-400">
        免费自查不看材料；$19 人工看截图和聊天关键点；$99 才看合同和收款人。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-gray-500">城市/区域</span>
          <Input name="city" placeholder="例如 Vancouver Downtown" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-gray-500">月租/房型</span>
          <Input name="rent" placeholder="例如 $2500 1B1B" />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-gray-500">房源链接</span>
        <Input name="listing_url" placeholder="小红书 / 微信 / Zillow 链接" />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-gray-500">地址或小区名</span>
        <Input name="address" placeholder="不确定可填大概位置" />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-gray-500">付款要求</span>
        <Input name="payment_request" placeholder="押金 / Zelle / Wise / 微信等" />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-gray-500">补充说明</span>
        <textarea
          name="notes"
          placeholder="聊天重点、担心点、合同情况"
          className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full h-12 bg-[#FF6B35] hover:bg-[#e85a24] text-white">
        {!submitting && <Send className="size-4" />}
        {submitting ? "提交中..." : "提交房源，获取人工报告"}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <LockKeyhole className="size-3.5" />
        第一版提交后人工联系；正式付款链接会在确认服务范围后发送
      </p>
    </form>
  )
}

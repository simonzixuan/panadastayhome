"use client"

import { useState } from "react"
import { LockKeyhole, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LeadForm({ listingId }: { listingId: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const params = new URLSearchParams(window.location.search)
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing_id: listingId,
        name: form.get("name"),
        contact: form.get("contact"),
        budget: form.get("budget"),
        move_in_date: form.get("move_in_date"),
        message: form.get("message"),
        source: params.get("utm_source") || params.get("source") || "",
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

    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-green-50 rounded-xl border border-green-200 p-6">
        <h2 className="text-lg font-semibold text-green-800 mb-2">已收到咨询</h2>
        <p className="text-sm text-green-700">我们会尽快确认房源情况，并通过你留下的联系方式回复。</p>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">预约看房 / 获取更多信息</h2>
      <p className="text-sm text-gray-500 mb-4">不用注册，留下联系方式后我们帮你确认房源。</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input name="name" placeholder="称呼 *" required />
          <Input name="contact" placeholder="微信或电话 *" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input name="budget" placeholder="预算，例如 $2500/月" />
          <Input name="move_in_date" placeholder="入住时间，例如 7月初" />
        </div>
        <textarea
          name="message"
          rows={3}
          placeholder="补充需求，例如想看房时间、是否需要中文沟通..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full h-11 bg-[#FF6B35] hover:bg-[#e85a24] text-white">
          {!submitting && <Send className="size-4" />}
          {submitting ? "提交中..." : "提交咨询"}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <LockKeyhole className="size-3.5" />
          信息仅用于本次房源咨询
        </p>
      </form>
    </div>
  )
}

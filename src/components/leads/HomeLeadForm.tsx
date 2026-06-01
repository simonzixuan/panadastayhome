"use client"

import { useState } from "react"
import { LockKeyhole, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomeLeadForm() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        contact: form.get("contact"),
        budget: form.get("budget"),
        move_in_date: form.get("move_in_date"),
        message: form.get("message"),
        source: "homepage",
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
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-800">
        <p className="font-semibold">已收到需求</p>
        <p className="mt-1 text-sm">我们会根据城市、预算和入住时间帮你确认合适房源。</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input name="name" placeholder="称呼 *" required />
        <Input name="contact" placeholder="微信或电话 *" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input name="budget" placeholder="预算，例如 $2500/月" />
        <Input name="move_in_date" placeholder="入住时间，例如 7月初" />
      </div>
      <Input name="message" placeholder="城市/学校/房型，例如 UBC 附近 2B" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={submitting} className="w-full h-12 bg-[#FF6B35] hover:bg-[#e85a24] text-white">
        {!submitting && <Send className="size-4" />}
        {submitting ? "提交中..." : "提交找房需求"}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <LockKeyhole className="size-3.5" />
        信息仅用于找房服务，不会公开展示
      </p>
    </form>
  )
}

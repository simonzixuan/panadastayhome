"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trackEvent } from "@/lib/analytics"

export default function InlineLeadForm({ source = "listings", compact = false }: { source?: string; compact?: boolean }) {
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
        source,
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

    trackEvent("generate_lead", { lead_source: source })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        已收到需求，我们会根据你的条件帮你匹配合适房源。
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 gap-3 min-[1100px]:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]"}
    >
      <Input name="name" placeholder="称呼 *" required />
      <Input name="contact" placeholder="微信或电话 *" required />
      <Input name="budget" placeholder="预算" />
      <Input name="move_in_date" placeholder="入住时间" />
      <Input name="message" placeholder="城市/学校/房型" />
      <Button type="submit" disabled={submitting} className="h-10 bg-[#2F6B52] hover:bg-[#24543f] text-white">
        {!submitting && <Send className="size-4" />}
        {submitting ? "提交中" : "帮我找"}
      </Button>
      {error && <p className={compact ? "text-sm text-red-500" : "min-[1100px]:col-span-6 text-sm text-red-500"}>{error}</p>}
    </form>
  )
}

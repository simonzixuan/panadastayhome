"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { trackEvent } from "@/lib/analytics"

interface Props {
  listingId: string
  ownerUserId: string
}

export default function MessageForm({ listingId, ownerUserId }: Props) {
  const [status, setStatus] = useState<"loading" | "guest" | "owner" | "idle" | "sending" | "sent">("loading")
  const [content, setContent] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [sendError, setSendError] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setStatus("guest"); return }
      if (user.id === ownerUserId) { setStatus("owner"); return }
      setCurrentUserId(user.id)
      setStatus("idle")
    })
  }, [ownerUserId])

  async function handleSend() {
    if (!content.trim() || !currentUserId) return
    setStatus("sending")
    setSendError("")
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ""
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ listing_id: listingId, receiver_id: ownerUserId, content }),
    })
    if (!res.ok) {
      setSendError("发送失败，请重试")
      setStatus("idle")
      return
    }
    setContent("")
    trackEvent("generate_lead", {
      lead_source: "listing_message",
      listing_id: listingId,
    })
    setStatus("sent")
  }

  if (status === "loading") return null
  if (status === "owner") return null
  if (status === "guest") return (
    <div className="bg-orange-50 rounded-xl p-6 text-center mt-6">
      <p className="text-gray-700 font-medium mb-1">登录后可向房东发送消息</p>
      <div className="flex justify-center gap-3 mt-3">
        <Link href="/auth/login">
          <Button variant="outline" size="sm">登录</Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm" className="bg-[#FF6B35] hover:bg-[#e85a24] text-white">免费注册</Button>
        </Link>
      </div>
    </div>
  )

  if (status === "sent") return (
    <div className="bg-green-50 rounded-xl p-6 text-center mt-6">
      <p className="text-green-700 font-medium">消息已发送！房东会尽快回复您。</p>
      <Button variant="outline" size="sm" className="mt-3" onClick={() => setStatus("idle")}>
        继续发送
      </Button>
    </div>
  )

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">发送消息给房东</h2>
      <textarea
        className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
        rows={4}
        placeholder="你好，我对这套房源感兴趣，请问..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {sendError && (
        <p className="mt-2 text-sm text-red-500">{sendError}</p>
      )}
      <Button
        className="mt-2 bg-[#FF6B35] hover:bg-[#e85a24] text-white"
        disabled={!content.trim() || status === "sending"}
        onClick={handleSend}
      >
        {status === "sending" ? "发送中..." : "发送消息"}
      </Button>
    </div>
  )
}

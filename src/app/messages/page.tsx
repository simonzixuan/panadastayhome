"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface Message {
  id: string
  content: string
  read: boolean
  created_at: string
  sender_name: string | null
  sender_email: string | null
  listing_id: string
  listings: { id: string; title: string } | null
}

export default function MessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return }

      const { data } = await supabase
        .from("messages")
        .select("*, listings(id, title)")
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false })

      setMessages((data as Message[]) ?? [])
      setLoading(false)

      // 标记所有未读消息为已读
      const unreadIds = (data ?? []).filter((m: Message) => !m.read).map((m: Message) => m.id)
      if (unreadIds.length > 0) {
        await supabase.from("messages").update({ read: true }).in("id", unreadIds)
      }
    })
  }, [router])

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">加载中...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">消息inbox</h1>

      {messages.length === 0 ? (
        <div className="bg-white border rounded-xl p-16 text-center">
          <p className="text-gray-400">暂无消息</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-white border rounded-xl p-4 ${!msg.read ? "border-[#FF6B35]" : "border-gray-100"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">
                      {msg.sender_name || msg.sender_email || "匿名用户"}
                    </span>
                    {!msg.read && (
                      <span className="text-xs bg-[#FF6B35] text-white px-2 py-0.5 rounded-full">新消息</span>
                    )}
                  </div>
                  {msg.listings && (
                    <Link href={`/listings/${msg.listings.id}`} className="text-xs text-blue-500 hover:underline mb-2 block truncate">
                      房源：{msg.listings.title}
                    </Link>
                  )}
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.sender_email && (
                    <a href={`mailto:${msg.sender_email}`} className="text-xs text-[#FF6B35] hover:underline mt-2 block">
                      回复：{msg.sender_email}
                    </a>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(msg.created_at).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

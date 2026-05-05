"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  content: string
  read: boolean
  created_at: string
  sender_id: string
  sender_name: string | null
  sender_email: string | null
  listing_id: string
  listings: { id: string; title: string } | null
}

export default function MessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [sendingId, setSendingId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return }
      setCurrentUserId(user.id)

      const { data } = await supabase
        .from("messages")
        .select("*, listings(id, title)")
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false })

      setMessages((data as Message[]) ?? [])
      setLoading(false)

    })
  }, [router])

  async function handleMarkRead(msg: Message) {
    if (msg.read) return
    await supabase.from("messages").update({ read: true }).eq("id", msg.id)
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m))
  }

  async function handleReply(msg: Message) {
    if (!replyContent.trim() || !currentUserId) return
    setSendingId(msg.id)

    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from("messages").insert({
      listing_id: msg.listing_id,
      sender_id: currentUserId,
      receiver_id: msg.sender_id,
      content: replyContent.trim(),
      sender_name: user?.user_metadata?.name || user?.email?.split("@")[0],
      sender_email: user?.email,
    })

    setReplyContent("")
    setReplyingId(null)
    setSendingId(null)
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">加载中...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">消息收件箱</h1>

      {messages.length === 0 ? (
        <div className="bg-white border rounded-xl p-16 text-center">
          <p className="text-gray-400">暂无消息</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-white border rounded-xl p-4 cursor-pointer ${!msg.read ? "border-[#FF6B35]" : "border-gray-100"}`} onClick={() => handleMarkRead(msg)}>
              <div className="flex items-start justify-between gap-4 mb-2">
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
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(msg.created_at).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {replyingId === msg.id ? (
                <div className="mt-3 border-t pt-3">
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    rows={3}
                    placeholder="输入回复内容..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="bg-[#FF6B35] hover:bg-[#e85a24] text-white"
                      disabled={!replyContent.trim() || sendingId === msg.id}
                      onClick={() => handleReply(msg)}
                    >
                      {sendingId === msg.id ? "发送中..." : "发送回复"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setReplyingId(null); setReplyContent("") }}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  className="mt-2 text-xs text-[#FF6B35] hover:underline"
                  onClick={() => { setReplyingId(msg.id); setReplyContent("") }}
                >
                  回复
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

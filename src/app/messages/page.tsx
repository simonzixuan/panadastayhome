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

interface Conversation {
  key: string
  sender_id: string
  sender_name: string | null
  sender_email: string | null
  listing_id: string
  listing_title: string | null
  listing_link: string
  messages: Message[]
  unread: number
  latest_at: string
}

function groupConversations(messages: Message[]): Conversation[] {
  const map = new Map<string, Conversation>()
  for (const msg of messages) {
    const key = `${msg.sender_id}__${msg.listing_id}`
    if (!map.has(key)) {
      map.set(key, {
        key,
        sender_id: msg.sender_id,
        sender_name: msg.sender_name,
        sender_email: msg.sender_email,
        listing_id: msg.listing_id,
        listing_title: msg.listings?.title ?? null,
        listing_link: `/listings/${msg.listing_id}`,
        messages: [],
        unread: 0,
        latest_at: msg.created_at,
      })
    }
    const conv = map.get(key)!
    conv.messages.push(msg)
    if (!msg.read) conv.unread++
    if (msg.created_at > conv.latest_at) conv.latest_at = msg.created_at
  }
  return Array.from(map.values()).sort((a, b) => b.latest_at.localeCompare(a.latest_at))
}

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return }
      setCurrentUserId(user.id)
      const { data } = await supabase
        .from("messages")
        .select("*, listings(id, title)")
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: true })
      setConversations(groupConversations((data as Message[]) ?? []))
      setLoading(false)
    })
  }, [router])

  async function handleOpen(conv: Conversation) {
    if (openKey === conv.key) { setOpenKey(null); return }
    setOpenKey(conv.key)
    setReplyContent("")
    if (conv.unread === 0) return
    const unreadIds = conv.messages.filter((m) => !m.read).map((m) => m.id)
    await supabase.from("messages").update({ read: true }).in("id", unreadIds)
    setConversations((prev) => prev.map((c) =>
      c.key === conv.key
        ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
        : c
    ))
  }

  async function handleReply(conv: Conversation) {
    if (!replyContent.trim() || !currentUserId) return
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: newMsg } = await supabase.from("messages").insert({
      listing_id: conv.listing_id,
      sender_id: currentUserId,
      receiver_id: conv.sender_id,
      content: replyContent.trim(),
      sender_name: user?.user_metadata?.name || user?.email?.split("@")[0],
      sender_email: user?.email,
      read: false,
    }).select("*, listings(id, title)").single()
    if (newMsg) {
      setConversations((prev) => prev.map((c) =>
        c.key === conv.key ? { ...c, messages: [...c.messages, newMsg as Message] } : c
      ))
    }
    setReplyContent("")
    setSending(false)
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">加载中...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">消息收件箱</h1>

      {conversations.length === 0 ? (
        <div className="bg-white border rounded-xl p-16 text-center">
          <p className="text-gray-400">暂无消息</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <div key={conv.key} className={`bg-white border rounded-xl overflow-hidden ${conv.unread > 0 ? "border-[#FF6B35]" : "border-gray-100"}`}>
              {/* 会话头部 */}
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => handleOpen(conv)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">
                      {conv.sender_name || conv.sender_email || "匿名用户"}
                    </span>
                    {conv.unread > 0 && (
                      <span className="text-xs bg-[#FF6B35] text-white px-2 py-0.5 rounded-full">{conv.unread} 条新消息</span>
                    )}
                  </div>
                  {conv.listing_title && (
                    <Link href={conv.listing_link} className="text-xs text-blue-500 hover:underline truncate block mt-0.5" onClick={(e) => e.stopPropagation()}>
                      房源：{conv.listing_title}
                    </Link>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {conv.messages[conv.messages.length - 1]?.content}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(conv.latest_at).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="text-gray-400 text-sm">{openKey === conv.key ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* 展开的消息记录 */}
              {openKey === conv.key && (
                <div className="border-t border-gray-100 px-4 pt-3 pb-4">
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {conv.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${msg.sender_id === currentUserId ? "bg-[#FF6B35] text-white" : "bg-gray-100 text-gray-800"}`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender_id === currentUserId ? "text-orange-100" : "text-gray-400"}`}>
                            {new Date(msg.created_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    rows={3}
                    placeholder="输入回复内容..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="mt-2 bg-[#FF6B35] hover:bg-[#e85a24] text-white"
                    disabled={!replyContent.trim() || sending}
                    onClick={() => handleReply(conv)}
                  >
                    {sending ? "发送中..." : "发送回复"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

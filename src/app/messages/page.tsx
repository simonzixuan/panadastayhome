"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import ReviewDialog from "@/components/listings/ReviewDialog"

interface Message {
  id: string
  content: string
  read: boolean
  created_at: string
  sender_id: string
  receiver_id: string
  sender_name: string | null
  sender_email: string | null
  listing_id: string
  listings: { id: string; title: string; user_id: string } | null
}

interface Conversation {
  key: string
  other_user_id: string
  other_name: string | null
  other_email: string | null
  listing_id: string
  listing_title: string | null
  listing_owner_id: string | null
  messages: Message[]
  unread: number
  latest_at: string
}

function groupConversations(messages: Message[], currentUserId: string): Conversation[] {
  const map = new Map<string, Conversation>()
  for (const msg of messages) {
    const otherId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
    const key = `${otherId}__${msg.listing_id}`
    if (!map.has(key)) {
      map.set(key, {
        key,
        other_user_id: otherId,
        other_name: msg.sender_id !== currentUserId ? msg.sender_name : null,
        other_email: msg.sender_id !== currentUserId ? msg.sender_email : null,
        listing_id: msg.listing_id,
        listing_title: msg.listings?.title ?? null,
        listing_owner_id: msg.listings?.user_id ?? null,
        messages: [],
        unread: 0,
        latest_at: msg.created_at,
      })
    }
    const conv = map.get(key)!
    conv.messages.push(msg)
    if (!msg.read && msg.receiver_id === currentUserId) conv.unread++
    if (msg.created_at > conv.latest_at) conv.latest_at = msg.created_at
    if (msg.sender_id !== currentUserId && !conv.other_name) {
      conv.other_name = msg.sender_name
      conv.other_email = msg.sender_email
    }
  }
  for (const conv of map.values()) {
    conv.messages.sort((a, b) => a.created_at.localeCompare(b.created_at))
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
  const [replyError, setReplyError] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [reviewTarget, setReviewTarget] = useState<Conversation | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return }
      setCurrentUserId(user.id)
      const meta = user.user_metadata ?? {}
      setEmailNotifications(meta.email_notifications !== false)
      const { data } = await supabase
        .from("messages")
        .select("*, listings(id, title, user_id)")
        .or(`receiver_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order("created_at", { ascending: true })
      setConversations(groupConversations((data as Message[]) ?? [], user.id))
      setLoading(false)
    })
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [openKey, conversations])

  async function handleToggleNotification(checked: boolean) {
    setEmailNotifications(checked)
    await supabase.auth.updateUser({ data: { email_notifications: checked } })
  }

  async function handleOpen(conv: Conversation) {
    if (openKey === conv.key) { setOpenKey(null); return }
    setOpenKey(conv.key)
    setReplyContent("")
    if (conv.unread === 0) return
    const unreadIds = conv.messages.filter((m) => !m.read && m.receiver_id === currentUserId).map((m) => m.id)
    if (unreadIds.length > 0) {
      await supabase.from("messages").update({ read: true }).in("id", unreadIds)
      setConversations((prev) => prev.map((c) =>
        c.key === conv.key
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      ))
    }
  }

  async function handleReply(conv: Conversation) {
    if (!replyContent.trim() || !currentUserId) return
    setSending(true)
    setReplyError("")
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ""
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        listing_id: conv.listing_id,
        receiver_id: conv.other_user_id,
        content: replyContent.trim(),
      }),
    })
    if (!res.ok) {
      setReplyError("发送失败，请重试")
      setSending(false)
      return
    }
    const newMsg = await res.json() as Message
    const enriched: Message = {
      ...newMsg,
      sender_name: newMsg.sender_name ?? null,
      sender_email: newMsg.sender_email ?? null,
      listings: newMsg.listings ?? (conv.messages[0]?.listings ?? null),
    }
    setConversations((prev) => prev.map((c) =>
      c.key === conv.key
        ? { ...c, messages: [...c.messages, enriched], latest_at: enriched.created_at }
        : c
    ))
    setReplyContent("")
    setSending(false)
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">加载中...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">消息收件箱</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">邮件通知</span>
          <Switch checked={emailNotifications} onCheckedChange={handleToggleNotification} />
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white border rounded-xl p-16 text-center">
          <p className="text-gray-400">暂无消息</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <div key={conv.key} className={`bg-white border rounded-xl overflow-hidden ${conv.unread > 0 ? "border-[#FF6B35]" : "border-gray-100"}`}>
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer hover:bg-gray-50" onClick={() => handleOpen(conv)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">
                      {conv.other_name || conv.other_email || "匿名用户"}
                    </span>
                    {conv.unread > 0 && (
                      <span className="text-xs bg-[#FF6B35] text-white px-2 py-0.5 rounded-full">{conv.unread} 条新消息</span>
                    )}
                  </div>
                  {conv.listing_title && (
                    <Link href={`/listings/${conv.listing_id}`} className="text-xs text-blue-500 hover:underline truncate block mt-0.5" onClick={(e) => e.stopPropagation()}>
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
                    <div ref={messagesEndRef} />
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    rows={3}
                    placeholder="输入回复内容..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  {replyError && (
                    <p className="text-sm text-red-500 mt-2">{replyError}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      className="bg-[#FF6B35] hover:bg-[#e85a24] text-white"
                      disabled={!replyContent.trim() || sending}
                      onClick={() => handleReply(conv)}
                    >
                      {sending ? "发送中..." : "发送回复"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReviewTarget(conv)}
                    >
                      评价对方
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {reviewTarget && currentUserId && (
        <ReviewDialog
          open={!!reviewTarget}
          onOpenChange={(open) => { if (!open) setReviewTarget(null) }}
          revieweeId={reviewTarget.other_user_id}
          listingId={reviewTarget.listing_id}
          reviewerRole={reviewTarget.listing_owner_id === currentUserId ? "landlord" : "tenant"}
          revieweeName={reviewTarget.other_name || reviewTarget.other_email || "对方"}
        />
      )}
    </div>
  )
}

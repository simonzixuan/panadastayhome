import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@/lib/supabase/server"
import { adminSupabase } from "@/lib/supabase/admin"
import { Resend } from "resend"
import NewMessageEmail from "@/emails/NewMessageEmail"

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@pandastayhome.com"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pandastayhome.com"

// BUG 1+2: 模块顶层初始化，key 不存在时只 warn 一次
const RESEND_API_KEY = process.env.RESEND_API_KEY
if (!RESEND_API_KEY) {
  console.warn("[Resend] RESEND_API_KEY 未配置，邮件通知功能已禁用")
}
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")
  const supabase = token
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      })
    : createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const body = await req.json()
  const { listing_id, receiver_id, content } = body

  if (!listing_id || !receiver_id || !content?.trim()) {
    return NextResponse.json({ error: "参数缺失" }, { status: 400 })
  }

  const senderName = user.user_metadata?.name || user.email?.split("@")[0] || "用户"

  // BUG 9: 查 receiver 信息，复用后续邮件通知的调用
  const { data: receiverData } = await adminSupabase.auth.admin.getUserById(receiver_id)
  const receiverName =
    receiverData?.user?.user_metadata?.name ||
    receiverData?.user?.email?.split("@")[0] ||
    "用户"

  // BUG 8: select 补 user_id；BUG 9: insert 补 receiver_name
  const { data: message, error } = await adminSupabase
    .from("messages")
    .insert({
      listing_id,
      sender_id: user.id,
      receiver_id,
      content: content.trim(),
      sender_name: senderName,
      sender_email: user.email,
      receiver_name: receiverName,
      read: false,
    })
    .select("*, listings(id, title, user_id)")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 发送邮件通知，失败不影响主流程
  // BUG 1+2: 使用模块级 resend 实例，key 不存在时跳过
  try {
    const receiverEmail = receiverData?.user?.email
    const emailNotifications = receiverData?.user?.user_metadata?.email_notifications
    if (resend && receiverEmail && emailNotifications !== false) {
      const listingTitle = (message.listings as { title: string } | null)?.title ?? "未知房源"
      const messagePreview = content.trim().slice(0, 100)
      await resend.emails.send({
        from: FROM_EMAIL,
        to: receiverEmail,
        subject: `${senderName} 给您发了一条新消息 - 熊猫之家`,
        react: NewMessageEmail({
          senderName,
          messagePreview,
          listingTitle,
          messagesUrl: `${SITE_URL}/messages`,
        }),
      })
    }
  } catch (emailError) {
    console.error("[Resend] 邮件发送失败:", emailError)
  }

  return NextResponse.json(message)
}

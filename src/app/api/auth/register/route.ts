import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: "请填写所有必填项" }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "密码至少6位" }, { status: 400 })
  }

  const { error } = await adminClient.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true,
  })

  if (error) {
    const message = error.message.includes("already been registered")
      ? "该邮箱已注册，请直接登录"
      : "注册失败，请稍后重试"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

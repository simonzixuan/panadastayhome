"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const TERMS_TEXT = `一、特别提示
我们的管理成员会尽可能尽快删除或编辑有争议或不健康的帖子，但不可能阅读所有的帖子内容。因此您应该承认这个论坛上所有的主题只由其发表者承担责任，而不是管理成员们。

二、使用规则
您必须同意不发表带有辱骂、淫秽、粗俗、诽谤、带有仇恨性、恐吓的、不健康的或是任何违反法律的内容（包括违反 House Finder《社群指南》或法律）。如果您这样做将导致您的账户将立即和永久性地被封锁，该 IP 地址的所有用户都将被记录。

您必须同意管理成员们有在任何时间删除、修改、移动或关闭任何主题的权力。

作为一个使用者，您必须同意您所提供的任何资料都将被存入数据库中，这些资料除非有您的同意，管理员们绝不会对第三方公开，然而我们不能保证任何可能导致资料泄露的黑客入侵行为。

本平台使用 Cookie 来储存您的个人信息，电子邮件地址只用来确认您的注册和发送密码。《隐私权政策》将会阐述我们如何处理您的个人资料和保障您的隐私。

三、管理规定——禁止发布的内容
本网站禁止发布：
1. 不实虚假广告
2. 与房源、租房、买房无关的商业广告
3. 多次发布相同广告信息
4. 任何传销形式的广告
5. 任何形式的网赚信息
6. 发布任何形式的 Affiliate Link 或推荐代码
7. 通过私人留言发送商业广告
8. 以获取流量为目的的网站推广信息
9. 平台性质的 App 或网站招人或推广信息
10. 涉嫌违反美国及加拿大法律的信息

三、管理规定——商家及商业用户
下列行为是禁止的：
1. 注册多个 ID，自问自答，发布不实的点评，或者攻击竞争对手
2. 各种不正当的竞争行为，攻击同行业的竞争对手
3. 发布各种形式的软文（变相广告文章）

四、发布声明
在 House Finder 发布的帖子需要满足下面的要求：
1. 帖子标题中不能有电话号码或者电子邮件
2. 帖子标题中不能有和内容无关的特殊符号
3. 帖子必须能够清楚表述要发布的内容

对于不满足上述要求的帖子，管理员有权删除帖子，恕不另行通知。`

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [agreed, setAgreed] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string
    const confirm = form.get("confirm") as string
    const name = form.get("name") as string

    if (password !== confirm) {
      setError("两次输入的密码不一致")
      setLoading(false)
      return
    }

    // 服务端创建用户（跳过邮件验证）
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    // 注册成功后直接登录
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError("注册成功，请前往登录")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white border rounded-xl p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">创建账号</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">姓名</label>
            <Input name="name" placeholder="Your Name" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">邮箱</label>
            <Input name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">密码</label>
            <Input name="password" type="password" placeholder="至少6位" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">确认密码</label>
            <Input name="confirm" type="password" placeholder="再次输入密码" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">注册服务条款</label>
            <div className="h-40 overflow-y-auto rounded-md border border-input bg-gray-50 px-3 py-2 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
              {TERMS_TEXT}
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
              />
              <span className="text-sm text-gray-600">
                我已阅读并同意以上注册服务条款及{" "}
                <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">
                  服务条款与隐私政策
                </Link>
              </span>
            </label>
          </div>

          <Button type="submit" disabled={loading || !agreed} className="w-full">
            {loading ? "注册中..." : "注册"}
          </Button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4">
          已有账号？{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}

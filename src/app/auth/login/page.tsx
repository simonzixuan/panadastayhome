"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError("邮箱或密码错误")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white border rounded-xl p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">登录</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">邮箱</label>
            <Input name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">密码</label>
            <Input name="password" type="password" placeholder="输入密码" required />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "登录中..." : "登录"}
          </Button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4">
          没有账号？{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            免费注册
          </Link>
        </p>
      </div>
    </div>
  )
}

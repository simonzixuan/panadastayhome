"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"

export default function NavbarAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    supabase
      .from("messages")
      .select("id", { count: "exact" })
      .eq("receiver_id", user.id)
      .eq("read", false)
      .then(({ count }) => setUnreadCount(count ?? 0))
  }, [user])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) return <div className="w-32 h-9" />

  if (user) {
    const name = user.user_metadata?.name || user.email?.split("@")[0]
    const isAdmin = user.app_metadata?.role === "admin"
    return (
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link href="/admin" className="text-sm font-medium text-[#FF6B35] hover:text-[#e85a24]">
            后台管理
          </Link>
        )}
        <Link href="/my-listings" className="text-sm text-gray-500 hover:text-[#222222]">
          我的房源
        </Link>
        <Link href="/messages" className="relative text-sm text-gray-500 hover:text-[#222222]">
          消息
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-[#FF6B35] text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {unreadCount}
            </span>
          )}
        </Link>
        <span className="text-sm text-gray-500">你好，{name}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="rounded-xl border-gray-200 text-gray-600 hover:text-[#222222] hover:border-gray-400"
        >
          退出
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/auth/login">
        <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-gray-600 hover:border-gray-400">
          登录
        </Button>
      </Link>
      <Link href="/auth/register">
        <Button size="sm" className="rounded-xl bg-[#FF6B35] hover:bg-[#e85a24] text-white">
          注册
        </Button>
      </Link>
    </div>
  )
}

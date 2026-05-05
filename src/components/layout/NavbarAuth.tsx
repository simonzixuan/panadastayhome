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

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) return <div className="w-32 h-8" />

  if (user) {
    const name = user.user_metadata?.name || user.email?.split("@")[0]
    const isAdmin = user.app_metadata?.role === "admin"
    return (
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            后台管理
          </Link>
        )}
        <Link href="/my-listings" className="text-sm text-gray-600 hover:text-gray-900">
          我的房源
        </Link>
        <span className="text-sm text-gray-600">你好，{name}</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>退出</Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/auth/login">
        <Button variant="outline" size="sm">登录</Button>
      </Link>
      <Link href="/auth/register">
        <Button size="sm">注册</Button>
      </Link>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function NavbarMobile() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    setOpen(false)
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const isAdmin = user?.app_metadata?.role === "admin"

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 text-gray-500 hover:text-gray-900"
        aria-label="菜单"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50 px-6 py-4 flex flex-col gap-4">
          <Link href="/listings" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
            浏览房源
          </Link>
          <Link href="/#find-help" className="text-sm font-medium text-[#FF6B35]" onClick={() => setOpen(false)}>
            帮我找房
          </Link>
          <Link href="/rental-check" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
            房源核实
          </Link>
          <Link href="/publish" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
            发布房源
          </Link>
          <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
            关于我们
          </Link>
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-sm font-medium text-[#FF6B35]" onClick={() => setOpen(false)}>
                    后台管理
                  </Link>
                )}
                <Link href="/my-listings" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
                  我的房源
                </Link>
                <Link href="/favorites" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
                  我的收藏
                </Link>
                <Link href="/messages" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
                  消息
                </Link>
                <button onClick={handleLogout} className="text-left text-sm text-gray-500 hover:text-gray-900">
                  退出
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
                  登录
                </Link>
                <Link href="/auth/register" className="text-sm font-medium text-[#FF6B35]" onClick={() => setOpen(false)}>
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

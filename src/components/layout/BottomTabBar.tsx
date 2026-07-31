"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Home, Search, MessageCircleHeart, Bell, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function BottomTabBar() {
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) { setUnreadCount(0); return }

    const fetchUnread = () => {
      supabase
        .from("messages")
        .select("id", { count: "exact" })
        .eq("receiver_id", user.id)
        .eq("read", false)
        .then(({ count }) => setUnreadCount(count ?? 0))
    }

    fetchUnread()

    const channel = supabase
      .channel("bottom-tab-unread")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `receiver_id=eq.${user.id}` }, fetchUnread)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  // 详情页有自己的吸底咨询栏，不需要再叠一层 tab bar
  if (pathname.startsWith("/listings/")) return null

  const items = [
    { key: "home", href: "/", label: "首页", icon: Home },
    { key: "listings", href: "/listings", label: "找房源", icon: Search },
    { key: "help", href: "/#find-help", label: "帮我找", icon: MessageCircleHeart, accent: true },
    { key: "messages", href: user ? "/messages" : "/auth/login?redirect=/messages", label: "消息", icon: Bell, badge: unreadCount },
    { key: "profile", href: user ? "/my-listings" : "/auth/login?redirect=/my-listings", label: "我的", icon: User },
  ]

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    if (href.startsWith("/#")) return false
    return pathname.startsWith(href.split("?")[0])
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-100 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map(({ key, href, label, icon: Icon, accent, badge }) => {
        const active = isActive(href)
        return (
          <Link
            key={key}
            href={href}
            className={`relative flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium ${
              accent ? "text-[#2F6B52]" : active ? "text-[#1A1A1A]" : "text-gray-400"
            }`}
          >
            <Icon className="size-5" strokeWidth={active || accent ? 2.4 : 2} />
            {label}
            {!!badge && (
              <span className="absolute right-[26%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2F6B52] px-1 text-[9px] font-bold text-white">
                {badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import AdminDashboard from "./AdminDashboard"

export default function AdminPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.app_metadata?.role === "admin") {
        setReady(true)
      } else {
        router.replace("/")
      }
    })
  }, [router])

  if (!ready) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">加载中...</div>
  }

  return <AdminDashboard />
}

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
      if (!user || user.app_metadata?.role !== "admin") {
        router.replace("/")
      } else {
        setReady(true)
      }
    })
  }, [router])

  if (!ready) return null

  return <AdminDashboard />
}

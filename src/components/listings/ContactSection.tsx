"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { trackEvent } from "@/lib/analytics"

interface ContactInfo {
  contact_name: string
  contact_phone: string
  contact_email?: string | null
}

export default function ContactSection({ listingId }: { listingId: string }) {
  const [status, setStatus] = useState<"loading" | "guest" | "shown">("loading")
  const [contact, setContact] = useState<ContactInfo | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setStatus("guest")
        return
      }
      const { data } = await supabase
        .from("listings")
        .select("contact_name, contact_phone, contact_email")
        .eq("id", listingId)
        .single()
      setContact(data)
      setStatus("shown")
    })
  }, [listingId])

  if (status === "loading") {
    return <div className="bg-gray-50 rounded-xl p-6 h-32 animate-pulse" />
  }

  if (status === "guest") {
    return (
      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <p className="text-gray-700 font-medium mb-1">登录后查看房东联系方式</p>
        <p className="text-gray-400 text-sm mb-4">注册免费，只需一分钟</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50"
          >
            登录
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            免费注册
          </Link>
        </div>
      </div>
    )
  }

  if (!contact) return null

  return (
    <div className="bg-blue-50 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-3">联系房东</h2>
      <p className="text-gray-700 mb-1">联系人：{contact.contact_name}</p>
      <p className="text-gray-700 mb-1">
        电话：
        <a
          href={`tel:${contact.contact_phone}`}
          onClick={() => trackEvent("contact_click", { method: "phone", listing_id: listingId })}
          className="text-blue-600 hover:underline"
        >
          {contact.contact_phone}
        </a>
      </p>
      {contact.contact_email && (
        <p className="text-gray-700">
          邮箱：
          <a
            href={`mailto:${contact.contact_email}`}
            onClick={() => trackEvent("contact_click", { method: "email", listing_id: listingId })}
            className="text-blue-600 hover:underline"
          >
            {contact.contact_email}
          </a>
        </p>
      )}
    </div>
  )
}

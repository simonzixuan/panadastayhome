"use client"

import { useEffect } from "react"
import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google"

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer ?? []
  }, [])

  return <NextGoogleAnalytics gaId={gaId} />
}

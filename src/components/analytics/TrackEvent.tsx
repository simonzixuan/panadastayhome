"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

export default function TrackEvent({
  eventName,
  parameters,
}: {
  eventName: string
  parameters?: Record<string, unknown>
}) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    trackEvent(eventName, parameters)
  }, [eventName, parameters])

  return null
}

"use client"

import { sendGAEvent } from "@next/third-parties/google"

type EventParameters = Record<string, unknown>

export function trackEvent(eventName: string, parameters: EventParameters = {}) {
  sendGAEvent("event", eventName, parameters)
}

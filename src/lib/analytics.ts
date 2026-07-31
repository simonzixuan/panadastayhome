"use client"

type EventParameters = Record<string, unknown>

export function trackEvent(eventName: string, parameters: EventParameters = {}) {
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(["event", eventName, parameters])
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

"use client"

type EventParameters = Record<string, unknown>

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void
}

export function trackEvent(eventName: string, parameters: EventParameters = {}) {
  const analyticsWindow = window as AnalyticsWindow
  analyticsWindow.gtag?.("event", eventName, parameters)
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.panadastayhome.com"

export const siteUrl = (() => {
  try {
    const url = new URL(configuredSiteUrl)
    if (url.hostname === "panadastayhome.com") url.hostname = "www.panadastayhome.com"
    return url.origin
  } catch {
    return "https://www.panadastayhome.com"
  }
})()

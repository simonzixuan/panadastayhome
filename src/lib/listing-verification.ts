import type { Listing, VerificationStatus } from "@/types"

const labels: Record<VerificationStatus, string> = {
  pending: "待核实",
  contacting: "联系核实中",
  verified_available: "已核实可租",
  stale: "需要重新核实",
  unavailable: "已失效",
}

export function getListingVerification(listing: Listing) {
  const status = listing.verification_status ?? "pending"
  const verifiedDate = listing.verified_at
    ? new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/Los_Angeles",
      }).format(new Date(listing.verified_at))
    : null

  return {
    status,
    label: labels[status],
    dateLabel: verifiedDate ? `最后核实：${verifiedDate}` : "尚未完成人工核实",
  }
}

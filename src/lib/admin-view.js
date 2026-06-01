export function filterAndPaginateLeads(leads, options) {
  const status = options?.status ?? "all"
  const search = String(options?.search ?? "").trim().toLowerCase()
  const pageSize = Math.max(1, Number(options?.pageSize) || 20)
  const page = Math.max(1, Number(options?.page) || 1)

  const filtered = leads.filter((lead) => {
    const leadStatus = lead.status || (lead.transferred ? "transferred" : "new")
    const matchesStatus = status === "all" || leadStatus === status
    const haystack = [
      lead.name,
      lead.contact,
      lead.budget,
      lead.move_in_date,
      lead.message,
      lead.source,
      lead.referrer,
      lead.listings?.title,
      lead.listings?.city,
      lead.listings?.state,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    return matchesStatus && (!search || haystack.includes(search))
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page: safePage,
    totalPages,
  }
}

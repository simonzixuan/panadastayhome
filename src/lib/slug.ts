export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

export function listingSlugPath(listing: { id: string; title: string | null }): string {
  const slug = listing.title ? slugify(listing.title) : ""
  return slug ? `${listing.id}-${slug}` : listing.id
}

// UUID 固定 36 位（8-4-4-4-12），从 "{uuid}-{slug}" 或纯 "{uuid}" 里提取真实 id
export function extractListingId(param: string): string {
  return param.slice(0, 36)
}

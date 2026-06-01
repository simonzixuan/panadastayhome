const LISTING_KEYWORD_FIELDS = ["title", "description", "district", "address"]

export function buildListingKeywordFilter(keywords) {
  return keywords
    .map((keyword) => String(keyword ?? "").trim())
    .filter(Boolean)
    .flatMap((keyword) => (
      LISTING_KEYWORD_FIELDS.map((field) => `${field}.ilike.%${keyword.replaceAll(",", " ")}%`)
    ))
    .join(",")
}

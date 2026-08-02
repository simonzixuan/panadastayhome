const LISTING_KEYWORD_FIELDS = ["title", "description", "district", "address"]

export function buildListingCityFilter(cities) {
  return cities
    .map((city) => String(city ?? "").trim())
    .filter(Boolean)
    .map((city) => `city.ilike.${city.replaceAll(",", " ")}`)
    .join(",")
}

export function buildListingKeywordFilter(keywords) {
  return keywords
    .map((keyword) => String(keyword ?? "").trim())
    .filter(Boolean)
    .flatMap((keyword) => (
      LISTING_KEYWORD_FIELDS.map((field) => `${field}.ilike.%${keyword.replaceAll(",", " ")}%`)
    ))
    .join(",")
}

import test from "node:test"
import assert from "node:assert/strict"
import { buildListingKeywordFilter } from "./landing-query.js"

test("builds a Supabase OR filter for listing keyword fields", () => {
  const filter = buildListingKeywordFilter(["UBC", "Point Grey"])

  assert.equal(
    filter,
    "title.ilike.%UBC%,description.ilike.%UBC%,district.ilike.%UBC%,address.ilike.%UBC%,title.ilike.%Point Grey%,description.ilike.%Point Grey%,district.ilike.%Point Grey%,address.ilike.%Point Grey%"
  )
})

test("drops empty keywords", () => {
  const filter = buildListingKeywordFilter(["", "UBC"])

  assert.equal(
    filter,
    "title.ilike.%UBC%,description.ilike.%UBC%,district.ilike.%UBC%,address.ilike.%UBC%"
  )
})

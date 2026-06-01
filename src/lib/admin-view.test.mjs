import test from "node:test"
import assert from "node:assert/strict"
import { filterAndPaginateLeads } from "./admin-view.js"

const leads = [
  { name: "Alice", contact: "wechat-a", status: "new", source: "homepage", listings: { title: "UBC 2B", city: "Vancouver", state: "BC" } },
  { name: "Bob", contact: "555-0101", status: "contacted", source: "city_vancouver", listings: null },
  { name: "Cindy", contact: "wechat-c", status: "transferred", source: "school_ubc", listings: { title: "Downtown studio", city: "Vancouver", state: "BC" } },
]

test("filters leads by status and keyword", () => {
  const result = filterAndPaginateLeads(leads, {
    status: "new",
    search: "ubc",
    page: 1,
    pageSize: 10,
  })

  assert.equal(result.total, 1)
  assert.equal(result.items[0].name, "Alice")
})

test("paginates filtered leads", () => {
  const result = filterAndPaginateLeads(leads, {
    status: "all",
    search: "",
    page: 2,
    pageSize: 2,
  })

  assert.equal(result.totalPages, 2)
  assert.deepEqual(result.items.map((lead) => lead.name), ["Cindy"])
})

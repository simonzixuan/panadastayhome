import assert from "node:assert/strict"
import test from "node:test"
import { validateLeadInput } from "./leads.js"

test("validates required lead fields", () => {
  const result = validateLeadInput({
    listing_id: "listing-1",
    name: "王同学",
    contact: "wechat-id",
  })

  assert.equal(result.ok, true)
})

test("allows homepage lead without listing id", () => {
  const result = validateLeadInput({
    name: "李同学",
    contact: "wechat-id",
  })

  assert.equal(result.ok, true)
})

test("keeps current page path for conversion tracking", () => {
  const result = validateLeadInput({
    name: "李同学",
    contact: "wechat-id",
    current_path: "/city/vancouver?utm_source=telegram",
  })

  assert.equal(result.ok, true)
  assert.equal(result.data.current_path, "/city/vancouver?utm_source=telegram")
})

test("rejects missing contact", () => {
  const result = validateLeadInput({
    listing_id: "listing-1",
    name: "王同学",
    contact: "",
  })

  assert.equal(result.ok, false)
  assert.equal(result.error, "请留下微信或电话")
})

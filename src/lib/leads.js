export function validateLeadInput(input) {
  const listingId = String(input?.listing_id ?? "").trim()
  const name = String(input?.name ?? "").trim()
  const contact = String(input?.contact ?? "").trim()

  if (!name) return { ok: false, error: "请填写称呼" }
  if (!contact) return { ok: false, error: "请留下微信或电话" }

  return {
    ok: true,
    data: {
      listing_id: listingId || null,
      name,
      contact,
      budget: String(input?.budget ?? "").trim() || null,
      move_in_date: String(input?.move_in_date ?? "").trim() || null,
      message: String(input?.message ?? "").trim() || null,
      source: String(input?.source ?? "").trim() || null,
      referrer: String(input?.referrer ?? "").trim() || null,
      current_path: String(input?.current_path ?? "").trim() || null,
    },
  }
}

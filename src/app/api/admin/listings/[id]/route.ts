import { adminSupabase } from "@/lib/supabase/admin"
import { verifyAdmin } from "@/lib/admin-auth"
import { NextRequest } from "next/server"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin(req)
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 403 })

  const { id } = await params

  const body = await req.json()
  const update: Record<string, unknown> = {}
  if ("is_available" in body) update.is_available = body.is_available
  if ("featured" in body) update.featured = body.featured
  if ("review_notes" in body) update.review_notes = String(body.review_notes || "")
  if ("editorial_summary" in body) update.editorial_summary = String(body.editorial_summary || "")
  if ("verification_status" in body) {
    const allowedStatuses = ["pending", "contacting", "verified_available", "stale", "unavailable"]
    if (!allowedStatuses.includes(body.verification_status)) {
      return Response.json({ error: "Invalid verification status" }, { status: 400 })
    }
    update.verification_status = body.verification_status
    if (body.verification_status === "verified_available") {
      update.verified_at = new Date().toISOString()
    }
  }

  const { error } = await adminSupabase
    .from("listings")
    .update(update)
    .eq("id", id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin(req)
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 403 })

  const { id } = await params

  const { error } = await adminSupabase
    .from("listings")
    .delete()
    .eq("id", id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

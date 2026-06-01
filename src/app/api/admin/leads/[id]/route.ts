import { adminSupabase } from "@/lib/supabase/admin"
import { verifyAdmin } from "@/lib/admin-auth"
import { NextRequest } from "next/server"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(req)
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const patch: Record<string, unknown> = {}

  if ("transferred" in body) patch.transferred = Boolean(body.transferred)
  if ("status" in body) patch.status = String(body.status || "new")
  if ("notes" in body) patch.notes = String(body.notes || "")
  if ("assigned_to" in body) patch.assigned_to = String(body.assigned_to || "")
  if ("next_follow_up_at" in body) patch.next_follow_up_at = body.next_follow_up_at || null

  const { error } = await adminSupabase
    .from("leads")
    .update(patch)
    .eq("id", id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

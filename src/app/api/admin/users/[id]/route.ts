import { adminSupabase } from "@/lib/supabase/admin"
import { verifyAdmin } from "@/lib/admin-auth"
import { NextRequest } from "next/server"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin(req)
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  if ("trusted_publisher" in body) {
    const trusted = Boolean(body.trusted_publisher)
    const { error } = await adminSupabase
      .from("trusted_publishers")
      .upsert({ user_id: id, trusted, updated_at: new Date().toISOString() })

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ success: true })
  }

  const { error } = await adminSupabase.auth.admin.updateUserById(id, {
    ban_duration: body.ban ? "87600h" : "none",
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

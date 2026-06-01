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

  const { error } = await adminSupabase
    .from("leads")
    .update({ transferred: Boolean(body.transferred) })
    .eq("id", id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

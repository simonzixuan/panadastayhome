import { adminSupabase } from "@/lib/supabase/admin"
import { verifyAdmin } from "@/lib/admin-auth"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req)
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 403 })

  const { data: { users }, error } = await adminSupabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const { data: trustedPublishers } = await adminSupabase
    .from("trusted_publishers")
    .select("user_id, trusted")
    .eq("trusted", true)
  const trustedUserIds = new Set((trustedPublishers ?? []).map((row) => row.user_id))

  return Response.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      name: (u.user_metadata?.name as string) ?? "",
      created_at: u.created_at,
      banned_until: u.banned_until ?? null,
      trusted_publisher: trustedUserIds.has(u.id),
    })),
  })
}

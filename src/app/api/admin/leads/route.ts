import { adminSupabase } from "@/lib/supabase/admin"
import { verifyAdmin } from "@/lib/admin-auth"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req)
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 403 })

  const { data, error } = await adminSupabase
    .from("leads")
    .select("id, listing_id, name, contact, budget, move_in_date, message, source, referrer, transferred, created_at, listings(id, title, city, state)")
    .order("created_at", { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ leads: data ?? [] })
}

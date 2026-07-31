import { adminSupabase } from "@/lib/supabase/admin"
import { verifyAdmin } from "@/lib/admin-auth"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req)
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 403 })

  const { data, error } = await adminSupabase
    .from("listings")
    .select("id, title, city, state, type, price, contact_name, is_available, featured, publisher_type, listing_source, review_notes, editorial_summary, verification_status, verified_at, created_at")
    .order("created_at", { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ listings: data ?? [] })
}

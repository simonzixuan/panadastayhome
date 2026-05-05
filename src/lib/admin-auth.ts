import { adminSupabase } from "@/lib/supabase/admin"
import { NextRequest } from "next/server"

export async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")
  if (!token) return null
  const { data: { user } } = await adminSupabase.auth.getUser(token)
  if (user?.app_metadata?.role !== "admin") return null
  return user
}

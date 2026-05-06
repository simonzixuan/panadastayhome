import { createClient } from "@supabase/supabase-js"
import { NextRequest } from "next/server"

function createUserClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}

function getToken(req: NextRequest) {
  return req.headers.get("Authorization")?.replace("Bearer ", "") ?? null
}

// GET /api/favorites — 获取当前用户所有收藏的 listing_id
export async function GET(req: NextRequest) {
  const token = getToken(req)
  if (!token) return Response.json({ error: "未登录" }, { status: 401 })

  const supabase = createUserClient(token)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return Response.json({ error: "未登录" }, { status: 401 })

  const { data, error } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ favorites: data.map(f => f.listing_id) })
}

// POST /api/favorites — 添加收藏 { listing_id }
export async function POST(req: NextRequest) {
  const token = getToken(req)
  if (!token) return Response.json({ error: "未登录" }, { status: 401 })

  const { listing_id } = await req.json()
  if (!listing_id) return Response.json({ error: "缺少 listing_id" }, { status: 400 })

  const supabase = createUserClient(token)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return Response.json({ error: "未登录" }, { status: 401 })

  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, listing_id })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

// DELETE /api/favorites — 取消收藏 { listing_id }
export async function DELETE(req: NextRequest) {
  const token = getToken(req)
  if (!token) return Response.json({ error: "未登录" }, { status: 401 })

  const { listing_id } = await req.json()
  if (!listing_id) return Response.json({ error: "缺少 listing_id" }, { status: 400 })

  const supabase = createUserClient(token)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return Response.json({ error: "未登录" }, { status: 401 })

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("listing_id", listing_id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

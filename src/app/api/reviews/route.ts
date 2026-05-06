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

// POST /api/reviews — 提交评价
export async function POST(req: NextRequest) {
  const token = getToken(req)
  if (!token) return Response.json({ error: "未登录" }, { status: 401 })

  const supabase = createUserClient(token)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return Response.json({ error: "未登录" }, { status: 401 })

  const body = await req.json()
  const { reviewee_id, listing_id, rating, comment, reviewer_role } = body

  if (!reviewee_id || !listing_id || rating == null || !reviewer_role) {
    return Response.json({ error: "缺少必填字段" }, { status: 400 })
  }
  if (user.id === reviewee_id) {
    return Response.json({ error: "不能评价自己" }, { status: 400 })
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "评分必须是 1-5 的整数" }, { status: 400 })
  }
  if (comment && comment.length > 500) {
    return Response.json({ error: "评论不能超过 500 字" }, { status: 400 })
  }
  if (!["tenant", "landlord"].includes(reviewer_role)) {
    return Response.json({ error: "reviewer_role 必须是 tenant 或 landlord" }, { status: 400 })
  }

  // BUG 4: 确认双方在该房源上存在对话记录
  const { data: convo, error: convoError } = await supabase
    .from("messages")
    .select("id")
    .eq("listing_id", listing_id)
    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${reviewee_id}),and(sender_id.eq.${reviewee_id},receiver_id.eq.${user.id})`)
    .limit(1)
    .single()

  if (convoError || !convo) {
    return Response.json({ error: "无权评价：与对方在该房源下无对话记录" }, { status: 403 })
  }

  const { error } = await supabase.from("reviews").insert({
    reviewer_id: user.id,
    reviewee_id,
    listing_id,
    rating,
    comment: comment ?? null,
    reviewer_role,
  })

  if (error) {
    if (error.code === "23505") {
      return Response.json({ error: "已经评价过该用户" }, { status: 409 })
    }
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true }, { status: 201 })
}

// GET /api/reviews?user_id=xxx — 获取某用户收到的评价列表 + 平均分
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get("user_id")
  if (!user_id) return Response.json({ error: "缺少 user_id" }, { status: 400 })

  // GET 查询无需登录，使用公共 key 即可（RLS SELECT 策略对外公开）
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, reviewer_role, created_at, reviewer_id")
    .eq("reviewee_id", user_id)
    .order("created_at", { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const avg =
    data.length > 0
      ? Math.round((data.reduce((sum, r) => sum + r.rating, 0) / data.length) * 10) / 10
      : null

  return Response.json({ reviews: data, average: avg, total: data.length })
}

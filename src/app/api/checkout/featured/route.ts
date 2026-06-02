import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "置顶付费暂未开放" }, { status: 503 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? null
  if (!token) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { listingId, plan } = await req.json()

  if (!listingId || !plan) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 })
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 })
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, title")
    .eq("id", listingId)
    .eq("user_id", user.id)
    .single()

  if (!listing) {
    return NextResponse.json({ error: "房源不存在或无权操作" }, { status: 404 })
  }

  const plans: Record<string, { amount: number; days: number; label: string }> = {
    week:  { amount: 900,  days: 7,  label: "精选置顶 7 天" },
    month: { amount: 2900, days: 30, label: "精选置顶 30 天" },
  }

  const selected = plans[plan]
  if (!selected) return NextResponse.json({ error: "无效套餐" }, { status: 400 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.panadastayhome.com"

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: {
          name: selected.label,
          description: listing.title,
        },
        unit_amount: selected.amount,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${siteUrl}/my-listings?featured=success`,
    cancel_url: `${siteUrl}/my-listings`,
    metadata: {
      listingId,
      days: String(selected.days),
    },
  })

  return NextResponse.json({ url: session.url })
}

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { listingId, plan } = await req.json()

  if (!listingId || !plan) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data: listing } = await supabase
    .from("listings")
    .select("id, title")
    .eq("id", listingId)
    .single()

  if (!listing) {
    return NextResponse.json({ error: "房源不存在" }, { status: 404 })
  }

  const plans: Record<string, { amount: number; days: number; label: string }> = {
    week:  { amount: 900,  days: 7,  label: "精选置顶 7 天" },
    month: { amount: 2900, days: 30, label: "精选置顶 30 天" },
  }

  const selected = plans[plan]
  if (!selected) return NextResponse.json({ error: "无效套餐" }, { status: 400 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://panadastayhome.com"

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

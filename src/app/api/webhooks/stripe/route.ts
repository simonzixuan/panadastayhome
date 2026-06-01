import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe 暂未配置" }, { status: 503 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "缺少签名" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Webhook 签名验证失败" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const { listingId, days } = session.metadata ?? {}

    if (!listingId || !days) return NextResponse.json({ ok: true })

    const featuredUntil = new Date()
    featuredUntil.setDate(featuredUntil.getDate() + Number(days))

    const supabase = createAdminClient()
    await supabase
      .from("listings")
      .update({ featured: true, featured_until: featuredUntil.toISOString() })
      .eq("id", listingId)
  }

  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

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

    const supabase = createServerClient()
    await supabase
      .from("listings")
      .update({ featured: true, featured_until: featuredUntil.toISOString() })
      .eq("id", listingId)
  }

  return NextResponse.json({ ok: true })
}

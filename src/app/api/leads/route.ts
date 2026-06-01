import { NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/supabase/admin"
import { validateLeadInput } from "@/lib/leads"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const result = validateLeadInput(body)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const lead = result.data
  if (!lead) return NextResponse.json({ error: "参数缺失" }, { status: 400 })

  const { data, error } = await adminSupabase
    .from("leads")
    .insert(lead)
    .select("id")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ id: data.id })
}

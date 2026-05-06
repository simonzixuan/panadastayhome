"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { US_STATES, CA_PROVINCES, COUNTRIES, PROPERTY_TYPE_LABELS } from "@/lib/constants"
import type { Listing } from "@/types"

export default function EditListingPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [listing, setListing] = useState<Listing | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [country, setCountry] = useState("US")

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return }
      const { data } = await supabase.from("listings").select("*").eq("id", id).single()
      if (!data || data.user_id !== user.id) { router.push("/my-listings"); return }
      setListing(data as Listing)
      setCountry(data.country ?? "US")
    })
  }, [id, router])

  const regions = country === "CA" ? CA_PROVINCES : US_STATES
  const stateLabel = country === "CA" ? "省份" : "州"
  const zipLabel = country === "CA" ? "邮政编码" : "ZIP Code"

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const form = new FormData(e.currentTarget)

    const { error: updateError } = await supabase
      .from("listings")
      .update({
        title: form.get("title"),
        description: form.get("description"),
        price: Number(form.get("price")),
        type: form.get("type"),
        property_type: form.get("property_type"),
        area: form.get("area") ? Number(form.get("area")) : null,
        bedrooms: Number(form.get("bedrooms")),
        bathrooms: Number(form.get("bathrooms")),
        country,
        address: form.get("address") || null,
        city: form.get("city") || null,
        district: form.get("district") || null,
        state: form.get("state") || null,
        zip_code: form.get("zip_code") || null,
        contact_name: form.get("contact_name"),
        contact_phone: form.get("contact_phone"),
        contact_email: form.get("contact_email") || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    setSubmitting(false)

    if (updateError) {
      setError("保存失败，请稍后重试")
      return
    }

    router.push("/my-listings")
  }

  if (!listing) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">加载中...</div>
  }

  const selectClass = "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">编辑房源</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

        <Section title="基本信息">
          <Field label="标题 *">
            <Input name="title" defaultValue={listing.title} required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="出租 / 出售 *">
              <select name="type" defaultValue={listing.type} required className={selectClass}>
                <option value="rent">租房 For Rent</option>
                <option value="sale">买房 For Sale</option>
              </select>
            </Field>
            <Field label="房屋类型 *">
              <select name="property_type" defaultValue={listing.property_type} required className={selectClass}>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="价格（USD $）*">
              <Input name="price" type="number" min={0} defaultValue={listing.price} required />
            </Field>
            <Field label="面积（sq ft）*">
              <Input name="area" type="number" min={1} defaultValue={listing.area ?? ""} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="卧室">
              <Input name="bedrooms" type="number" min={0} defaultValue={listing.bedrooms} />
            </Field>
            <Field label="卫生间">
              <select name="bathrooms" defaultValue={String(listing.bathrooms)} className={selectClass}>
                <option value="1">1 bath</option>
                <option value="1.5">1.5 baths</option>
                <option value="2">2 baths</option>
                <option value="2.5">2.5 baths</option>
                <option value="3">3 baths</option>
                <option value="3.5">3.5 baths</option>
                <option value="4">4 baths</option>
                <option value="4.5">4.5 baths</option>
                <option value="5">5+ baths</option>
              </select>
            </Field>
          </div>
          <Field label="描述">
            <textarea
              name="description"
              rows={4}
              defaultValue={listing.description}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
        </Section>

        <Section title="地址信息（选填）">
          <Field label="国家">
            <select value={country} onChange={(e) => { setCountry(e.target.value) }} className={selectClass}>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="街道地址">
            <Input name="address" defaultValue={listing.address ?? ""} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="城市">
              <Input name="city" defaultValue={listing.city ?? ""} />
            </Field>
            <Field label={stateLabel}>
              <select name="state" defaultValue={listing.state ?? ""} className={selectClass}>
                <option value="">请选择</option>
                {regions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={zipLabel}>
              <Input name="zip_code" defaultValue={listing.zip_code ?? ""} />
            </Field>
            <Field label="社区 / 区域">
              <Input name="district" defaultValue={listing.district ?? ""} />
            </Field>
          </div>
        </Section>

        <Section title="联系方式">
          <div className="grid grid-cols-2 gap-4">
            <Field label="联系人 *">
              <Input name="contact_name" defaultValue={listing.contact_name} required />
            </Field>
            <Field label="电话 *">
              <Input name="contact_phone" defaultValue={listing.contact_phone} required />
            </Field>
          </div>
          <Field label="邮箱（选填）">
            <Input name="contact_email" type="email" defaultValue={listing.contact_email ?? ""} />
          </Field>
        </Section>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? "保存中..." : "保存修改"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/my-listings")}>
            取消
          </Button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

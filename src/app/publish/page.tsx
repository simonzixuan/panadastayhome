"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ImageUpload from "@/components/listings/ImageUpload"
import type { ImageUploadHandle } from "@/components/listings/ImageUpload"
import { US_STATES, CA_PROVINCES, COUNTRIES, PROPERTY_TYPE_LABELS } from "@/lib/constants"

const selectClass = "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"

export default function PublishPage() {
  const router = useRouter()
  const imageUploadRef = useRef<ImageUploadHandle>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [country, setCountry] = useState("US")
  const [authChecked, setAuthChecked] = useState(false)
  const [listingType, setListingType] = useState("")
  const [propertyType, setPropertyType] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login?redirect=/publish")
        return
      }
      setAuthChecked(true)
    })
  }, [router])

  const regions = country === "CA" ? CA_PROVINCES : US_STATES
  const stateLabel = country === "CA" ? "省份" : "州"
  const zipLabel = country === "CA" ? "邮政编码" : "ZIP Code"
  const zipPlaceholder = country === "CA" ? "A1A 1A1" : "90001"

  if (!authChecked) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">加载中...</div>
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const images = await imageUploadRef.current?.uploadAll() ?? []
    const { data: { user } } = await supabase.auth.getUser()

    const { data: listing, error: insertError } = await supabase
      .from("listings")
      .insert({
        user_id: user?.id ?? null,
        title: form.get("title"),
        description: form.get("description"),
        price: Number(form.get("price")),
        type: form.get("type"),
        property_type: form.get("property_type"),
        area: form.get("area") ? Number(form.get("area")) : 0,
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
        images,
      })
      .select("id")
      .single()

    setSubmitting(false)

    if (insertError) {
      setError("发布失败，请稍后重试")
      return
    }

    router.push(`/listings/${listing.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">发布房源</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        {/* 基本信息 */}
        <Section title="基本信息">
          <Field label="标题 *">
            <Input name="title" placeholder="例：Bright 2BR Apartment Near Downtown" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="出租 / 出售 *">
              <select
                name="type"
                required
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className={selectClass}
              >
                <option value="">请选择</option>
                <option value="rent">租房 For Rent</option>
                <option value="sale">买房 For Sale</option>
              </select>
            </Field>
            <Field label="房屋类型 *">
              <select
                name="property_type"
                required
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={selectClass}
              >
                <option value="">请选择</option>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="价格（USD $）*">
              <Input name="price" type="number" min={0} placeholder="2500" required />
            </Field>
            <Field label="面积（sq ft）">
              <Input name="area" type="number" min={1} placeholder="900（选填）" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="卧室">
              <Input name="bedrooms" type="number" min={0} defaultValue={1} />
            </Field>
            <Field label="卫生间">
              <select name="bathrooms" defaultValue="1" className={selectClass}>
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
              placeholder="描述房源特点、装修情况、周边配套..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
        </Section>

        {/* 图片 */}
        <Section title="房源图片">
          <ImageUpload ref={imageUploadRef} maxFiles={10} />
        </Section>

        {/* 地址 */}
        <Section title="地址信息（选填）">
          <Field label="国家">
            <select
              value={country}
              onChange={(e) => { setCountry(e.target.value) }}
              className={selectClass}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="街道地址">
            <Input name="address" placeholder="123 Main Street, Apt 4B" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="城市">
              <Input name="city" placeholder={country === "CA" ? "Toronto" : "Los Angeles"} />
            </Field>
            <Field label={stateLabel}>
              <select name="state" className={selectClass}>
                <option value="">请选择</option>
                {regions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={zipLabel}>
              <Input name="zip_code" placeholder={zipPlaceholder} />
            </Field>
            <Field label="社区 / 区域">
              <Input name="district" placeholder="Downtown, Midtown..." />
            </Field>
          </div>
        </Section>

        {/* 联系方式 */}
        <Section title="联系方式">
          <div className="grid grid-cols-2 gap-4">
            <Field label="联系人 *">
              <Input name="contact_name" placeholder="John Smith" required />
            </Field>
            <Field label="电话 *">
              <Input name="contact_phone" type="tel" placeholder="(xxx) xxx-xxxx" required />
            </Field>
          </div>
          <Field label="邮箱（选填）">
            <Input name="contact_email" type="email" placeholder="example@email.com" />
          </Field>
        </Section>

        <Button type="submit" disabled={submitting} className="w-full" size="lg">
          {submitting ? "发布中，请稍候..." : "发布房源"}
        </Button>
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

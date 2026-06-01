"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ImageUpload from "@/components/listings/ImageUpload"
import type { ImageUploadHandle } from "@/components/listings/ImageUpload"
import { US_STATES, CA_PROVINCES, COUNTRIES, PROPERTY_TYPE_LABELS } from "@/lib/constants"
import { CheckCircle2, Megaphone, MessageCircle, Sparkles } from "lucide-react"

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

    const price = Number(form.get("price"))
    const area = form.get("area") ? Number(form.get("area")) : null
    if (price < 0) {
      setError("价格不能为负数")
      setSubmitting(false)
      return
    }
    if (area !== null && area < 0) {
      setError("面积不能为负数")
      setSubmitting(false)
      return
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      router.push("/auth/login?redirect=/publish")
      return
    }

    let images: string[] = []
    try {
      images = await imageUploadRef.current?.uploadAll() ?? []
    } catch {
      setError("图片上传失败，请重试")
      setSubmitting(false)
      return
    }

    const { data: listing, error: insertError } = await supabase
      .from("listings")
      .insert({
        user_id: user.id,
        title: form.get("title"),
        description: form.get("description"),
        price,
        type: form.get("type"),
        property_type: form.get("property_type"),
        area,
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
      setError(insertError.message)
      return
    }

    router.push(`/listings/${listing.id}`)
  }

  return (
    <div className="bg-[#F7F7F7]">
    <div className="max-w-5xl mx-auto px-4 py-8">
      <section className="bg-white border rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1EA] px-3 py-1.5 text-sm font-medium text-[#FF6B35] mb-4">
              <Megaphone className="size-4" />
              免费发布房源
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              发布房源，我们帮你触达北美华人租客/买家
            </h1>
            <p className="mt-4 text-gray-500 leading-7">
              适合房东、二房东和房产经纪人。填写基础信息后，你会得到一个中文房源页，可用于微信群、小红书、Telegram 和 Google 搜索承接。
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            {[
              ["中文包装", "把房源亮点讲给华人用户"],
              ["线索收集", "租客可直接留下微信或电话"],
              ["人工协助", "冷启动阶段先免费帮你分发"],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#FF6B35]" />
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        {/* 基本信息 */}
        <Section title="基本信息">
          <Field label="标题 *">
            <Input name="title" placeholder="例：Bright 2BR Apartment Near Downtown" required />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="价格（USD $）*">
              <Input name="price" type="number" min={0} placeholder="2500" required />
            </Field>
            <Field label="面积（sq ft）">
              <Input name="area" type="number" min={1} placeholder="900（选填）" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <Button type="submit" disabled={submitting} className="w-full bg-[#FF6B35] hover:bg-[#e85a24] text-white" size="lg">
          {!submitting && <Sparkles className="size-4" />}
          {submitting ? "发布中，请稍候..." : "发布房源"}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <MessageCircle className="size-3.5" />
          发布后可把房源链接发给我们，用于后续中文推广
        </p>
      </form>
    </div>
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

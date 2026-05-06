"use client"

interface Props {
  address: string
  city: string
  state?: string | null
  zipCode?: string | null
}

export default function ListingMap({ address, city, state, zipCode }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  const query = [address, city, state, zipCode].filter(Boolean).join(", ")
  if (!query) return null
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}`

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">地图位置</h2>
      <iframe
        src={src}
        width="100%"
        height="300"
        className="rounded-xl border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

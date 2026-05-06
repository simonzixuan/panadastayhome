"use client"

import { useEffect, useState } from "react"

interface Review {
  id: string
  rating: number
  comment: string | null
  reviewer_role: string
  created_at: string
  reviewer_id: string
}

interface Props {
  userId: string
}

export default function LandlordReviews({ userId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [average, setAverage] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/reviews?user_id=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews ?? [])
        setAverage(data.average ?? null)
      })
      .finally(() => setLoading(false))
  }, [userId])

  if (loading || reviews.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold">房东评价</h2>
        {average !== null && (
          <span className="text-sm text-gray-500">
            <span className="text-yellow-400">★</span> {average} · {reviews.length} 条
          </span>
        )}
      </div>
      <div className="space-y-3">
        {reviews.map((r) => {
          const name = "匿名用户"
          const initial = "匿"
          const date = new Date(r.created_at).toLocaleDateString("zh-CN")
          return (
            <div key={r.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-sm font-medium shrink-0">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">{name}</span>
                  <span className="text-xs text-gray-400 shrink-0">{date}</span>
                </div>
                <div className="text-yellow-400 text-sm my-0.5">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

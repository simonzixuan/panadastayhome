"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  revieweeId: string
  listingId: string
  reviewerRole: "landlord" | "tenant"
  revieweeName: string
}

export default function ReviewDialog({
  open,
  onOpenChange,
  revieweeId,
  listingId,
  reviewerRole,
  revieweeName,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (rating === 0) return
    setSubmitting(true)
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ""
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        reviewee_id: revieweeId,
        listing_id: listingId,
        rating,
        comment: comment.trim(),
        reviewer_role: reviewerRole,
      }),
    })
    setSubmitting(false)
    if (res.ok) {
      setDone(true)
      setTimeout(() => {
        setDone(false)
        setRating(0)
        setComment("")
        setError("")
        onOpenChange(false)
      }, 1200)
    } else {
      const data = await res.json()
      setError(data?.error ?? "提交失败，请稍后重试")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>评价 {revieweeName || "对方"}</DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center text-green-600 font-medium">评价提交成功！</div>
        ) : (
          <div className="space-y-4">
            {/* 星级 */}
            <div>
              <p className="text-sm text-gray-500 mb-2">评分</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <span className={(hovered || rating) >= star ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 文字评论 */}
            <div>
              <p className="text-sm text-gray-500 mb-2">评论（可选）</p>
              <textarea
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                rows={4}
                maxLength={500}
                placeholder="分享你的入住/合租体验..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <p className="text-xs text-gray-400 text-right">{comment.length}/500</p>
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            <Button
              className="w-full bg-[#FF6B35] hover:bg-[#e85a24] text-white"
              disabled={rating === 0 || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "提交中..." : "提交评价"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

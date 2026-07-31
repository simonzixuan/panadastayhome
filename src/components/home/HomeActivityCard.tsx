"use client"

import { useEffect, useState } from "react"

const cases = [
  {
    request: "温哥华 UBC 附近 1B",
    detail: "8月入住 · 预算 $2300/月",
    status: "已匹配",
    count: "4",
    label: "套可确认房源",
  },
  {
    request: "多伦多 North York 2B",
    detail: "7月入住 · 预算 $2800/月",
    status: "已联系",
    count: "3",
    label: "位房东/经纪人",
  },
  {
    request: "洛杉矶 Irvine 家庭房",
    detail: "9月入住 · 近学校社区",
    status: "筛选中",
    count: "6",
    label: "套候选房源",
  },
  {
    request: "西雅图 Bellevue 合租",
    detail: "近微软 · 预算 $1600/月",
    status: "可中文",
    count: "2",
    label: "套可约看房",
  },
]

export default function HomeActivityCard() {
  const [index, setIndex] = useState(0)
  const current = cases[index]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % cases.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="mb-5 overflow-hidden rounded-xl border bg-gray-50">
      <div className="h-32 bg-[linear-gradient(135deg,#fff7f3_0%,#f5fbff_50%,#ffffff_100%)] p-4">
        <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-3">
          <div className="rounded-lg bg-white p-3 shadow-sm">
            <p className="text-xs font-medium text-gray-400">正在处理</p>
            <p className="mt-2 text-sm font-semibold">{current.request}</p>
            <p className="mt-1 text-xs text-gray-400">{current.detail}</p>
            <div className="mt-3 h-2 w-24 overflow-hidden rounded-full bg-[#2F6B52]/15">
              <div className="h-full w-2/3 rounded-full bg-[#2F6B52]/25" />
            </div>
          </div>
          <div className="rounded-lg bg-[#222222] p-3 text-white shadow-sm">
            <p className="text-xs text-white/60">{current.status}</p>
            <p className="mt-2 text-2xl font-bold">{current.count}</p>
            <p className="text-xs text-white/60">{current.label}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

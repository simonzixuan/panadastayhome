"use client"

import { useState } from "react"
import Link from "next/link"

export default function NavbarMobile() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 text-gray-500 hover:text-gray-900"
        aria-label="菜单"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50 px-6 py-4 flex flex-col gap-4">
          <Link href="/listings" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
            浏览房源
          </Link>
          <Link href="/#find-help" className="text-sm font-medium text-[#FF6B35]" onClick={() => setOpen(false)}>
            帮我找房
          </Link>
          <Link href="/publish" className="text-sm text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
            发布房源
          </Link>
        </div>
      )}
    </div>
  )
}

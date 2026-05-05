import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <p>© 2026 House Finder. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-gray-900 transition-colors">
            服务条款
          </Link>
          <Link href="/listings" className="hover:text-gray-900 transition-colors">
            找房源
          </Link>
          <Link href="/publish" className="hover:text-gray-900 transition-colors">
            发布房源
          </Link>
        </div>
      </div>
    </footer>
  )
}

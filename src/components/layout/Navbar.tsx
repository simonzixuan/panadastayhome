import Link from "next/link"
import NavbarAuth from "./NavbarAuth"

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          House Finder
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/listings" className="text-sm text-gray-600 hover:text-gray-900">
            找房源
          </Link>
          <Link href="/publish" className="text-sm text-gray-600 hover:text-gray-900">
            发布房源
          </Link>
          <NavbarAuth />
        </div>
      </div>
    </nav>
  )
}

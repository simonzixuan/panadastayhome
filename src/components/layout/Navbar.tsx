import Link from "next/link"
import Image from "next/image"
import NavbarAuth from "./NavbarAuth"

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/export.png" alt="Panda House" width={80} height={80} className="object-contain invert mix-blend-multiply" />
          <span className="text-[#222222] font-semibold text-lg">Panda House</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/listings" className="text-sm text-gray-500 hover:text-[#222222] transition-colors">
            找房源
          </Link>
          <Link href="/publish" className="text-sm text-gray-500 hover:text-[#222222] transition-colors">
            发布房源
          </Link>
          <NavbarAuth />
        </div>
      </div>
    </nav>
  )
}

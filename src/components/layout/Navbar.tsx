import Link from "next/link"
import Image from "next/image"
import NavbarAuth from "./NavbarAuth"
import NavbarMobile from "./NavbarMobile"

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/LOGO 3.png" alt="Panda Stay Home" width={48} height={48} className="h-12 w-auto object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="text-[#222222] font-bold text-base">熊猫之家</span>
            <span className="text-gray-400 text-xs tracking-wide">中文找房助手</span>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/listings" className="text-sm text-gray-500 hover:text-[#222222] transition-colors">
              浏览房源
            </Link>
            <Link href="/#find-help" className="text-sm font-medium text-[#FF6B35] hover:text-[#e85a24] transition-colors">
              帮我找房
            </Link>
            <Link href="/publish" className="text-sm text-gray-500 hover:text-[#222222] transition-colors">
              发布房源
            </Link>
            <Link href="/about" className="text-sm text-gray-500 hover:text-[#222222] transition-colors">
              关于我们
            </Link>
          </div>
          <NavbarAuth />
          <NavbarMobile />
        </div>
      </div>
    </nav>
  )
}

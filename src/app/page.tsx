import SearchBar from "@/components/search/SearchBar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">找到你的理想房源</h1>
          <p className="text-blue-100 text-lg mb-10">
            海量房源，真实信息，轻松找到心仪的家
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">快速入口</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold mb-2">租房</h3>
            <p className="text-gray-500 text-sm mb-4">按月租，灵活居住</p>
            <Link href="/listings?type=rent">
              <Button variant="outline" className="w-full">浏览租房</Button>
            </Link>
          </div>
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🏡</div>
            <h3 className="text-lg font-semibold mb-2">买房</h3>
            <p className="text-gray-500 text-sm mb-4">置业安家，长久居住</p>
            <Link href="/listings?type=sale">
              <Button variant="outline" className="w-full">浏览买房</Button>
            </Link>
          </div>
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">发布房源</h3>
            <p className="text-gray-500 text-sm mb-4">免费发布，快速出租</p>
            <Link href="/publish">
              <Button variant="outline" className="w-full">立即发布</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

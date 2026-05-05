import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "北美华人找房 - 租房买房房源平台",
    template: "%s | 北美华人找房",
  },
  description:
    "北美华人专属找房平台，提供美国、加拿大租房、买房房源搜索服务。海量真实房源，按城市、价格、户型筛选，快速找到心仪住所。",
  keywords: [
    "北美华人租房",
    "美国租房",
    "加拿大租房",
    "华人找房",
    "美国买房",
    "留学生租房",
    "海外华人房源",
    "North America Chinese rental",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "北美华人找房",
    title: "北美华人找房 - 租房买房房源平台",
    description:
      "北美华人专属找房平台，提供美国、加拿大租房、买房房源搜索服务。",
  },
  twitter: {
    card: "summary_large_image",
    title: "北美华人找房 - 租房买房房源平台",
    description:
      "北美华人专属找房平台，提供美国、加拿大租房、买房房源搜索服务。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

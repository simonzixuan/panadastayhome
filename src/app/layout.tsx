import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomTabBar from "@/components/layout/BottomTabBar";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  title: {
    default: "熊猫之家 Panda Stay Home｜北美华人租房找房平台",
    template: "%s | 熊猫之家 Panda Stay Home",
  },
  description:
    "熊猫之家 Panda Stay Home 是面向北美华人的租房找房平台，覆盖美国、加拿大主要城市，帮助留学生、新移民和华人家庭提交找房需求、确认房源并对接看房。",
  keywords: [
    "熊猫之家",
    "熊猫之家 Panda Stay Home",
    "Panda Stay Home",
    "panadastayhome",
    "熊猫之家租房",
    "熊猫之家找房",
    "熊猫之家房源核实",
    "北美华人租房",
    "北美华人找房",
    "美国租房",
    "加拿大租房",
    "华人找房",
    "美国买房",
    "加拿大买房",
    "留学生租房",
    "海外华人房源",
    "洛杉矶华人租房",
    "旧金山租房",
    "纽约华人租房",
    "温哥华华人租房",
    "多伦多华人租房",
    "西雅图租房",
    "北美公寓出租",
    "华人房东",
    "中文找房",
    "熊猫租房",
    "North America Chinese rental",
    "Chinese apartment rental USA Canada",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "熊猫之家 Panda Stay Home",
    title: "熊猫之家 Panda Stay Home｜北美华人租房找房平台",
    description:
      "熊猫之家 Panda Stay Home 是面向北美华人的租房找房平台，帮助用户提交需求、确认房源并对接看房。",
  },
  twitter: {
    card: "summary_large_image",
    title: "熊猫之家 Panda Stay Home｜北美华人租房找房平台",
    description:
      "熊猫之家 Panda Stay Home 是面向北美华人的租房找房平台，帮助用户提交需求、确认房源并对接看房。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "熊猫之家 Panda Stay Home",
        "alternateName": ["熊猫之家", "Panda Stay Home", "panadastayhome", "熊猫之家租房", "熊猫之家找房"],
        "description": "北美华人租房找房平台",
        "inLanguage": "zh-CN",
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": `${siteUrl}/listings?city={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "熊猫之家 Panda Stay Home",
        "alternateName": ["熊猫之家", "Panda Stay Home", "panadastayhome", "熊猫之家租房"],
        "url": siteUrl,
        "logo": { "@type": "ImageObject", "url": `${siteUrl}/icon.png` },
        "description": "熊猫之家 Panda Stay Home 是面向北美华人的租房找房平台，提供美国、加拿大房源确认和看房对接服务。",
      },
    ],
  }

  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomTabBar />
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}

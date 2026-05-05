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
  icons: {
    icon: "/export.png",
    apple: "/export.png",
  },
  title: {
    default: "熊猫之家 | 北美华人租房买房平台",
    template: "%s | 熊猫之家",
  },
  description:
    "熊猫之家 - 北美华人专属找房平台。覆盖美国、加拿大主要城市，提供公寓、独栋、联排等真实房源。按城市、Zip Code、价格、户型一键筛选，快速找到心仪住所。",
  keywords: [
    "熊猫之家",
    "北美华人租房",
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
    "Panda Stay Home",
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
    siteName: "熊猫之家",
    title: "熊猫之家 | 北美华人租房买房平台",
    description:
      "北美华人专属找房平台，覆盖美国、加拿大主要城市，真实房源，按城市、Zip Code、价格筛选。",
  },
  twitter: {
    card: "summary_large_image",
    title: "熊猫之家 | 北美华人租房买房平台",
    description:
      "北美华人专属找房平台，覆盖美国、加拿大主要城市，真实房源，按城市、Zip Code、价格筛选。",
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
        "name": "熊猫之家",
        "description": "北美华人租房买房平台",
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
        "name": "熊猫之家",
        "url": siteUrl,
        "logo": { "@type": "ImageObject", "url": `${siteUrl}/LOGO2.png` },
        "description": "北美华人专属找房平台，提供美国、加拿大真实房源",
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
      </body>
    </html>
  );
}

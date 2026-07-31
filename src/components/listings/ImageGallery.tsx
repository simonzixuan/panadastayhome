"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react"

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  function openLightbox(index: number) { setLightboxIndex(index) }
  function closeLightbox() { setLightboxIndex(null) }
  function prev() { setLightboxIndex((i) => (i! > 0 ? i! - 1 : images.length - 1)) }
  function next() { setLightboxIndex((i) => (i! < images.length - 1 ? i! + 1 : 0)) }

  const thumbnails = images.slice(1, 5)
  const remaining = images.length - 5

  return (
    <>
      {/* 画廊：手机端主图+缩略图行；房源图片不足 5 张时桌面端沿用同一套布局 */}
      <div className={`grid grid-cols-1 gap-2 mb-6 ${images.length >= 5 ? "lg:hidden" : ""}`}>
        {/* 主图 */}
        <div
          className="aspect-video rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in relative"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0]}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 缩略图 */}
        {thumbnails.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {thumbnails.map((url, i) => {
              const isLast = i === thumbnails.length - 1 && remaining > 0
              return (
                <div
                  key={i}
                  className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
                  onClick={() => openLightbox(i + 1)}
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="25vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {isLast && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white font-semibold text-xl">
                      +{remaining}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 查看全部按钮（超过5张时显示） */}
        {images.length > 5 && (
          <button
            onClick={() => openLightbox(0)}
            className="text-sm text-gray-500 hover:text-gray-800 underline text-left"
          >
            查看全部 {images.length} 张照片
          </button>
        )}
      </div>

      {/* 桌面端：图片 ≥5 张时用"一大四小"网格 */}
      {images.length >= 5 && (
        <div className="relative mb-6 hidden aspect-[16/7] gap-2 overflow-hidden rounded-2xl lg:grid lg:grid-cols-4 lg:grid-rows-2">
          <div
            className="relative col-span-2 row-span-2 cursor-zoom-in bg-gray-100"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={images[0]}
              alt={title}
              fill
              priority
              sizes="50vw"
              className="object-cover transition hover:brightness-95"
            />
          </div>
          {thumbnails.map((url, i) => (
            <div
              key={i}
              className="relative cursor-zoom-in bg-gray-100"
              onClick={() => openLightbox(i + 1)}
            >
              <Image src={url} alt="" fill sizes="25vw" className="object-cover transition hover:brightness-95" />
            </div>
          ))}
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-semibold shadow hover:bg-gray-50"
          >
            <Grid3x3 className="size-3.5" />
            查看全部 {images.length} 张照片
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 transition-colors"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              className="absolute left-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={(e) => { e.stopPropagation(); prev() }}
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <div
            className="relative w-[90vw] h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={title}
              fill
              sizes="90vw"
              className="object-contain rounded-lg"
            />
          </div>

          {images.length > 1 && (
            <button
              className="absolute right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={(e) => { e.stopPropagation(); next() }}
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </>
  )
}

"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

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
      {/* 画廊 */}
      <div className="grid grid-cols-1 gap-2 mb-6">
        {/* 主图 */}
        <div
          className="aspect-video rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
          onClick={() => openLightbox(0)}
        >
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 缩略图 */}
        {thumbnails.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {thumbnails.map((url, i) => {
              const isLast = i === 3 && remaining > 0
              return (
                <div
                  key={i}
                  className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
                  onClick={() => openLightbox(i + 1)}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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

          <img
            src={images[lightboxIndex]}
            alt={title}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

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

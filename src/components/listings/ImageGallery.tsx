"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  function openLightbox(index: number) { setLightboxIndex(index) }
  function closeLightbox() { setLightboxIndex(null) }
  function prev() { setLightboxIndex((i) => (i! > 0 ? i! - 1 : images.length - 1)) }
  function next() { setLightboxIndex((i) => (i! < images.length - 1 ? i! + 1 : 0)) }

  return (
    <>
      {/* 画廊 */}
      <div className="grid grid-cols-1 gap-2 mb-6">
        <div
          className="aspect-video rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
          onClick={() => openLightbox(0)}
        >
          <img src={images[0]} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((url, i) => (
              <div
                key={i}
                className="aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
                onClick={() => openLightbox(i + 1)}
              >
                <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                {i === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-lg">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* 关闭按钮 */}
          <button
            className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 transition-colors"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>

          {/* 计数 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* 上一张 */}
          {images.length > 1 && (
            <button
              className="absolute left-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={(e) => { e.stopPropagation(); prev() }}
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* 图片 */}
          <img
            src={images[lightboxIndex]}
            alt={title}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 下一张 */}
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

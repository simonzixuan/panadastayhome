"use client"

import { useRef, useState, forwardRef, useImperativeHandle } from "react"
import { supabase } from "@/lib/supabase/client"

export interface ImageUploadHandle {
  uploadAll: () => Promise<string[]>
}

interface Props {
  maxFiles?: number
  initialImages?: string[]
}

const ImageUpload = forwardRef<ImageUploadHandle, Props>(({ maxFiles = 10, initialImages = [] }, ref) => {
  const [existingUrls, setExistingUrls] = useState<string[]>(initialImages)
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    async uploadAll() {
      const newUrls: string[] = []
      let hasError = false
      for (const file of files) {
        const ext = file.name.split(".").pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from("listing-images").upload(path, file)
        if (!error) {
          const { data } = supabase.storage.from("listing-images").getPublicUrl(path)
          newUrls.push(data.publicUrl)
        } else {
          console.error("图片上传失败:", file.name, error)
          hasError = true
        }
      }
      setUploadError(hasError)
      return [...existingUrls, ...newUrls]
    },
  }))

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    if (!selected.length) return
    const remaining = maxFiles - existingUrls.length - files.length
    const toAdd = selected.slice(0, remaining)
    setFiles((prev) => [...prev, ...toAdd])
    toAdd.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ""
  }

  function removeExisting(index: number) {
    setExistingUrls((prev) => prev.filter((_, i) => i !== index))
  }

  function removeNew(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const totalCount = existingUrls.length + files.length

  return (
    <div className="space-y-3">
      {uploadError && (
        <p className="text-sm text-red-500">部分图片上传失败，请重试</p>
      )}
      {totalCount < maxFiles && (
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <p className="text-gray-500 text-sm">点击上传图片（最多 {maxFiles} 张）</p>
          <p className="text-gray-400 text-xs mt-1">支持 JPG、PNG、WEBP 格式</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSelect}
          />
        </div>
      )}
      {totalCount > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {existingUrls.map((src, i) => (
            <div key={`existing-${i}`} className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
              <img src={src} className="w-full h-full object-cover" alt="" />
              <button
                type="button"
                onClick={() => removeExisting(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black/80"
              >
                ×
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                  封面
                </span>
              )}
            </div>
          ))}
          {previews.map((src, i) => (
            <div key={`new-${i}`} className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
              <img src={src} className="w-full h-full object-cover" alt="" />
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black/80"
              >
                ×
              </button>
              {existingUrls.length === 0 && i === 0 && (
                <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                  封面
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

ImageUpload.displayName = "ImageUpload"
export default ImageUpload

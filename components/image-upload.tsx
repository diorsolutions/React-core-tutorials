"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cloudinaryService } from "@/lib/cloudinary-service"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  className?: string
}

export function ImageUpload({ value, onChange, label = "Product Image", className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setUploadError("Image size must be less than 5MB")
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      const imageUrl = await cloudinaryService.uploadImage(file)
      onChange(imageUrl)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (!cloudinaryService.isConfigured()) {
    return (
      <div className={className}>
        <Label>{label}</Label>
        <Alert className="mt-2">
          <AlertDescription>
            Cloudinary is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
            NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your environment variables.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={className}>
      <Label>{label}</Label>

      {value ? (
        <div className="mt-2 relative">
          <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            <img src={value || "/placeholder.svg"} alt="Product preview" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="opacity-0 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-[#302dbb] bg-[#302dbb]/5" : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#302dbb] mb-2" />
              <p className="text-sm text-gray-600">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop an image here, or click to select</p>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-2">
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <Alert className="mt-2 border-destructive">
          <AlertDescription className="text-destructive">{uploadError}</AlertDescription>
        </Alert>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
    </div>
  )
}

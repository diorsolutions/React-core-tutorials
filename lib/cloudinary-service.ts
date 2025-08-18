interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
}

interface CloudinaryError {
  message: string
  http_code: number
}

export class CloudinaryService {
  private cloudName: string
  private uploadPreset: string

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  }

  async uploadImage(file: File): Promise<string> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error("Cloudinary configuration missing. Please check environment variables.")
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", this.uploadPreset)
    formData.append("folder", "fast-food-products")

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData: CloudinaryError = await response.json()
        throw new Error(`Upload failed: ${errorData.message}`)
      }

      const data: CloudinaryUploadResponse = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Cloudinary upload error:", error)
      throw new Error(error instanceof Error ? error.message : "Failed to upload image")
    }
  }

  async deleteImage(publicId: string): Promise<boolean> {
    // Note: Deletion requires server-side implementation with API key/secret
    // This is a placeholder for the delete functionality
    console.log("Delete image:", publicId)
    return true
  }

  isConfigured(): boolean {
    return !!(this.cloudName && this.uploadPreset)
  }
}

export const cloudinaryService = new CloudinaryService()

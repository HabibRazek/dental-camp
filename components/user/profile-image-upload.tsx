"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface ProfileImageUploadProps {
  currentImage?: string | null
  userName?: string | null
  onImageUpdate?: (newImageUrl: string) => void
}

export function ProfileImageUpload({ 
  currentImage, 
  userName, 
  onImageUpdate 
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, or WebP image.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('File too large. Please upload an image smaller than 5MB.')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      console.log('📸 Uploading profile image:', file.name)

      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/user/profile/image', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Image uploaded successfully:', data.imageUrl)
        
        toast.success('Profile image updated successfully!')
        
        if (onImageUpdate) {
          onImageUpdate(data.imageUrl)
        }
        
        setPreviewUrl(null) // Clear preview since we have the new image
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
      setPreviewUrl(null) // Clear preview on error
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const clearPreview = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Force refresh image by adding timestamp to avoid caching
  const displayImage = previewUrl || (currentImage ? `${currentImage}?t=${Date.now()}` : currentImage)
  const initials = userName ? userName.split(' ').map(n => n[0]).join('') : 'U'

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32 ring-4 ring-blue-200 shadow-lg">
          <AvatarImage src={displayImage || ""} alt={userName || "User"} />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 text-2xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload Button */}
        <Button
          size="sm"
          onClick={triggerFileSelect}
          disabled={uploading}
          className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>

        {/* Clear Preview Button */}
        {previewUrl && (
          <Button
            size="sm"
            onClick={clearPreview}
            variant="destructive"
            className="absolute top-0 right-0 rounded-full h-6 w-6 p-0 shadow-lg"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="text-center">
          <p className="text-sm text-gray-600">Uploading image...</p>
          <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      {!uploading && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={triggerFileSelect}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Change Photo
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            JPEG, PNG, or WebP. Max 5MB.
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

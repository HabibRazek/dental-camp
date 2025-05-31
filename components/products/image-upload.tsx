"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Star,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import Image from "next/image"
import { useUploadThing } from "@/lib/uploadthing"
import { ImageUploadFallback } from "./image-upload-fallback"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 8,
  disabled = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadThingConfigured, setUploadThingConfigured] = useState(false)

  // Check if UploadThing is properly configured
  useEffect(() => {
    const checkUploadThingConfig = () => {
      try {
        const token = process.env.NEXT_PUBLIC_UPLOADTHING_TOKEN ||
                     (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'dev' : null)
        setUploadThingConfigured(!!token && token !== 'your_uploadthing_token_here')
      } catch (error) {
        setUploadThingConfigured(false)
      }
    }
    checkUploadThingConfig()
  }, [])

  // Safely initialize UploadThing hook with error handling
  let startUpload: ((files: File[]) => Promise<any>) | null = null
  let isUploading = false

  try {
    const uploadThingHook = useUploadThing("prodcutsImage", {
      onClientUploadComplete: (res) => {
        if (res) {
          const newUrls = res.map(file => file.url)
          onImagesChange([...images, ...newUrls])
          toast.success(`${newUrls.length} image(s) uploaded successfully!`)
        }
        setUploading(false)
        setUploadProgress(0)
      },
      onUploadError: (error) => {
        console.error("Upload error:", error)
        toast.error(`Upload failed: ${error.message}`)
        setUploading(false)
        setUploadProgress(0)
        // Fall back to demo mode on error
        setUploadThingConfigured(false)
      },
      onUploadProgress: (progress) => {
        setUploadProgress(progress)
      },
    })

    if (uploadThingConfigured) {
      startUpload = uploadThingHook.startUpload
      isUploading = uploadThingHook.isUploading
    }
  } catch (error) {
    setUploadThingConfigured(false)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return

    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    const filesToUpload = acceptedFiles.slice(0, remainingSlots)
    if (filesToUpload.length < acceptedFiles.length) {
      toast.warning(`Only uploading ${filesToUpload.length} images due to limit`)
    }

    if (startUpload && uploadThingConfigured) {
      setUploading(true)
      try {
        await startUpload(filesToUpload)
      } catch (error) {
        console.error("Upload failed:", error)
        toast.error("Upload failed. Switching to demo mode.")
        setUploadThingConfigured(false)
        setUploading(false)
      }
    } else {
      // Fallback to demo mode if UploadThing is not available
      setUploadThingConfigured(false)
    }
  }, [images.length, maxImages, disabled, startUpload, uploadThingConfigured])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxImages - images.length,
    disabled: disabled || uploading || isUploading
  })

  const removeImage = (index: number) => {
    if (disabled) return
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    toast.success("Image removed")
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (disabled) return
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  const setAsMain = (index: number) => {
    if (disabled || index === 0) return
    const newImages = [...images]
    const [mainImage] = newImages.splice(index, 1)
    newImages.unshift(mainImage)
    onImagesChange(newImages)
    toast.success("Main image updated")
  }

  // Use fallback component if UploadThing is not configured
  if (!uploadThingConfigured) {
    return (
      <ImageUploadFallback
        images={images}
        onImagesChange={onImagesChange}
        maxImages={maxImages}
        disabled={disabled}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Product Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    
                    {/* Main Image Badge */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Main
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!disabled && (
                        <>
                          {index !== 0 && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setAsMain(index)}
                              className="h-8 w-8 p-0"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {index > 0 && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => moveImage(index, index - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {index < images.length - 1 && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => moveImage(index, index + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {(uploading || isUploading) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Uploading images...</span>
            <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Upload Dropzone */}
      {images.length < maxImages && !disabled && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-0">
            <div
              {...getRootProps()}
              className={`p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'bg-blue-50 border-blue-400' 
                  : 'hover:bg-gray-50'
              } ${uploading || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center space-y-4">
                {uploading || isUploading ? (
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                ) : (
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {isDragActive ? 'Drop images here' : 'Upload Product Images'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Drag and drop images here, or click to select files
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 4MB each • {maxImages - images.length} slots remaining
                  </p>
                </div>

                {!uploading && !isUploading && (
                  <Button variant="outline" className="mt-4">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Choose Images
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Tips */}
      {images.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Image Upload Tips:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• First image will be used as the main product image</li>
            <li>• Use high-quality images for better customer engagement</li>
            <li>• Show different angles and details of your product</li>
            <li>• Recommended size: 1000x1000 pixels or larger</li>
          </ul>
        </div>
      )}
    </div>
  )
}

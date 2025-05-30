"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Upload,
  X,
  Image as ImageIcon,
  Star,
  ArrowUp,
  ArrowDown,
  AlertCircle
} from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadFallbackProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUploadFallback({
  images,
  onImagesChange,
  maxImages = 8,
  disabled = false
}: ImageUploadFallbackProps) {
  const [uploading, setUploading] = useState(false)

  // Convert files to base64 URLs for preview (fallback method)
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
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

    try {
      setUploading(true)

      // Convert files to base64 for preview (this is just for demo purposes)
      const base64Images = await Promise.all(
        filesToUpload.map(file => convertToBase64(file))
      )

      onImagesChange([...images, ...base64Images])
      toast.success(`${base64Images.length} image(s) added for preview`)

    } catch (error) {
      toast.error("Failed to process images")
    } finally {
      setUploading(false)
    }
  }, [images.length, maxImages, disabled, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxImages - images.length,
    disabled: disabled || uploading
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

  return (
    <div className="space-y-6">
      {/* UploadThing Configuration Warning */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>UploadThing Not Configured:</strong> Image upload is currently in demo mode.
          To enable real file uploads, please configure your UploadThing token in the environment variables.
          <br />
          <a
            href="https://uploadthing.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-900 mt-1 inline-block"
          >
            Get your UploadThing token here →
          </a>
        </AlertDescription>
      </Alert>

      {/* Current Images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Product Images ({images.length}/{maxImages}) - Preview Mode
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
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {isDragActive ? 'Drop images here' : 'Upload Product Images (Demo Mode)'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Drag and drop images here, or click to select files
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP • {maxImages - images.length} slots remaining
                  </p>
                  <p className="text-xs text-amber-600 font-medium">
                    Note: Images are for preview only until UploadThing is configured
                  </p>
                </div>

                <Button variant="outline" className="mt-4">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Choose Images
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      {images.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">To Enable Real Image Uploads:</h5>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Visit <a href="https://uploadthing.com" target="_blank" rel="noopener noreferrer" className="underline">uploadthing.com</a> and create an account</li>
            <li>Create a new app and get your API token</li>
            <li>Add <code className="bg-blue-100 px-1 rounded">UPLOADTHING_TOKEN="your_token"</code> to your .env file</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      )}
    </div>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"

interface ImageUploadFallbackProps {
  className?: string
  images?: string[]
  onImagesChange?: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUploadFallback({ className }: ImageUploadFallbackProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-500 mb-2">
          Image upload is not available
        </p>
        <p className="text-xs text-gray-400">
          UploadThing configuration required
        </p>
      </CardContent>
    </Card>
  )
}

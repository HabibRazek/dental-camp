"use client"

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  X, 
  FileImage, 
  AlertCircle,
  CheckCircle,
  Camera
} from 'lucide-react'
import { toast } from 'sonner'
import { useUploadThing } from '@/lib/uploadthing'
import Image from 'next/image'

interface PaymentProofUploadProps {
  onImageChange: (imageUrl: string | null) => void
  currentImage?: string | null
  disabled?: boolean
}

export function PaymentProofUpload({ 
  onImageChange, 
  currentImage, 
  disabled = false 
}: PaymentProofUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadThingConfigured, setUploadThingConfigured] = useState(true)

  // UploadThing hook
  let startUpload: ((files: File[]) => Promise<any>) | undefined
  let isUploading = false

  try {
    const uploadThingHook = useUploadThing("paymentProof", {
      onClientUploadComplete: (res) => {
        if (res && res[0]) {
          onImageChange(res[0].url)
          toast.success('Justificatif de paiement téléchargé avec succès!')
        }
        setUploading(false)
        setUploadProgress(0)
      },
      onUploadError: (error) => {
        console.error("Upload error:", error)
        toast.error(`Erreur de téléchargement: ${error.message}`)
        setUploading(false)
        setUploadProgress(0)
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
    if (disabled || uploading || isUploading) return

    const file = acceptedFiles[0]
    if (!file) return

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux. Taille maximale: 10MB")
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error("Veuillez sélectionner un fichier image ou PDF")
      return
    }

    if (startUpload && uploadThingConfigured) {
      setUploading(true)
      try {
        await startUpload([file])
      } catch (error) {
        console.error("Upload failed:", error)
        toast.error("Échec du téléchargement. Veuillez réessayer.")
        setUploading(false)
      }
    } else {
      // Fallback: create a local URL for demo purposes
      const localUrl = URL.createObjectURL(file)
      onImageChange(localUrl)
      toast.success('Image sélectionnée (mode démo)')
    }
  }, [disabled, uploading, isUploading, startUpload, uploadThingConfigured, onImageChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.pdf']
    },
    maxFiles: 1,
    disabled: disabled || uploading || isUploading
  })

  const removeImage = () => {
    onImageChange(null)
    toast.success('Justificatif supprimé')
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Justificatif de paiement *
        </Label>
        <p className="text-xs text-gray-500 mb-3">
          Téléchargez une capture d'écran ou photo de votre virement bancaire
        </p>
      </div>

      {currentImage ? (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                <Image
                  src={currentImage}
                  alt="Justificatif de paiement"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Justificatif téléchargé
                  </span>
                </div>
                <p className="text-xs text-green-700">
                  Votre justificatif de paiement a été téléchargé avec succès
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeImage}
                disabled={disabled}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`text-center cursor-pointer ${
                isDragActive ? 'bg-blue-50' : ''
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              
              {uploading || isUploading ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-8 w-8 text-blue-500 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Téléchargement en cours...</p>
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-gray-500">{uploadProgress}%</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Camera className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      {isDragActive
                        ? "Déposez votre justificatif ici"
                        : "Cliquez ou glissez votre justificatif"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP ou PDF jusqu'à 10MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    className="mt-2"
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    Sélectionner un fichier
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-800">
            <p className="font-medium mb-1">Informations importantes :</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Assurez-vous que le montant et les détails sont visibles</li>
              <li>Incluez votre nom dans la référence du virement</li>
              <li>Le justificatif sera vérifié avant validation de la commande</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

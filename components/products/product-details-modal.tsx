"use client"

import React from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Package, 
  Tag, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Edit,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description?: string
  sku: string
  price: number
  stockQuantity: number
  isActive: boolean
  thumbnail?: string
  images?: string[]
  category?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface ProductDetailsModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  if (!product) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', className: 'bg-red-100 text-red-800' }
    if (stock <= 5) return { text: 'Low Stock', className: 'bg-orange-100 text-orange-800' }
    return { text: 'In Stock', className: 'bg-green-100 text-green-800' }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? { text: 'Active', className: 'bg-green-100 text-green-800' }
      : { text: 'Inactive', className: 'bg-gray-100 text-gray-800' }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Additional Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square relative bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description || 'No description available'}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge className={`${getStatusBadge(product.isActive).className}`}>
                  {getStatusBadge(product.isActive).text}
                </Badge>
                <Badge className={`${getStockBadge(product.stockQuantity).className}`}>
                  {getStockBadge(product.stockQuantity).text}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">SKU:</span>
                  <span className="font-mono text-sm">{product.sku}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="font-semibold text-lg">{formatCurrency(product.price)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Stock:</span>
                  <span className="font-medium">{product.stockQuantity} units</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="text-sm">{product.category?.name || 'Uncategorized'}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Created:</span>
                <span className="text-sm">{formatDate(product.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Updated:</span>
                <span className="text-sm">{formatDate(product.updatedAt)}</span>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href={`/admin/products/${product.id}/edit`}>
                <Button className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
              </Link>
              
              <Link href={`/products/${product.id}`}>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

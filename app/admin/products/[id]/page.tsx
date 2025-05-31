"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowLeft, Edit, Loader2, AlertCircle, Package, DollarSign, Archive, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  description: string | null
  sku: string
  slug: string
  price: string
  costPrice: string | null
  comparePrice: string | null
  stockQuantity: number
  lowStockThreshold: number
  trackQuantity: boolean
  weight: string | null
  metaTitle: string | null
  metaDescription: string | null
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  isActive: boolean
  isFeatured: boolean
  categoryId: string | null
  images: string[]
  thumbnail: string | null
  category?: Category | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export default function ProductViewPage() {
  const params = useParams()
  const productId = Array.isArray(params.id) ? params.id[0] : params.id

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${productId}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Product not found")
            return
          }
          throw new Error("Failed to fetch product")
        }

        const data = await response.json()
        setProduct(data.product)

      } catch (error) {
        console.error('Failed to fetch product:', error)
        setError("Failed to load product data")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout 
        title="Product Details" 
        description="View product information"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading product...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout 
        title="Product Details" 
        description="View product information"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/products">
              <Button variant="ghost" className="mb-4 hover:bg-blue-50 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>

          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  if (!product) {
    return null
  }

  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800",
    PUBLISHED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-red-100 text-red-800",
  }

  const profit = product.costPrice ? parseFloat(product.price) - parseFloat(product.costPrice) : null
  const margin = profit && parseFloat(product.price) > 0 ? (profit / parseFloat(product.price)) * 100 : null

  return (
    <DashboardLayout 
      title={product.name} 
      description={`Product details for ${product.sku}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin/products">
            <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>

          <div className="flex space-x-3">
            <Link href={`/admin/products/${productId}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Status Bar */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">{product.name}</h2>
              <p className="text-sm text-blue-700">
                SKU: {product.sku} • ID: {product.id}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={statusColors[product.status]}>
                {product.status}
              </Badge>
              {product.isActive && (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              )}
              {product.isFeatured && (
                <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            {product.images && product.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {product.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No description provided</p>
                )}
              </CardContent>
            </Card>

            {/* SEO Information */}
            {(product.metaTitle || product.metaDescription) && (
              <Card>
                <CardHeader>
                  <CardTitle>SEO Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.metaTitle && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Meta Title</Label>
                      <p className="text-gray-900">{product.metaTitle}</p>
                    </div>
                  )}
                  {product.metaDescription && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Meta Description</Label>
                      <p className="text-gray-900">{product.metaDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Price</Label>
                  <p className="text-2xl font-bold text-green-600">${parseFloat(product.price).toFixed(2)}</p>
                </div>
                
                {product.costPrice && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Cost Price</Label>
                    <p className="text-lg font-semibold">${parseFloat(product.costPrice).toFixed(2)}</p>
                  </div>
                )}
                
                {product.comparePrice && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Compare Price</Label>
                    <p className="text-lg text-gray-500 line-through">${parseFloat(product.comparePrice).toFixed(2)}</p>
                  </div>
                )}

                {profit !== null && margin !== null && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Profit:</span>
                        <span className="font-medium text-green-600">${profit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Margin:</span>
                        <span className="font-medium text-green-600">{margin.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Stock Quantity</Label>
                  <p className={`text-lg font-semibold ${
                    product.stockQuantity <= product.lowStockThreshold 
                      ? 'text-red-600' 
                      : product.stockQuantity <= 50 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                  }`}>
                    {product.stockQuantity} units
                  </p>
                  {product.stockQuantity <= product.lowStockThreshold && (
                    <p className="text-xs text-red-600 font-medium">⚠️ Low stock alert</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Low Stock Threshold</Label>
                  <p className="text-gray-900">{product.lowStockThreshold} units</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Quantity Tracking</Label>
                  <p className="text-gray-900">{product.trackQuantity ? 'Enabled' : 'Disabled'}</p>
                </div>

                {product.weight && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Weight</Label>
                    <p className="text-gray-900">{parseFloat(product.weight).toFixed(3)} kg</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category */}
            {product.category && (
              <Card>
                <CardHeader>
                  <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-sm">
                    {product.category.name}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Archive className="mr-2 h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <Label className="text-gray-700">Created</Label>
                  <p className="text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-gray-700">Last Updated</Label>
                  <p className="text-gray-900">{new Date(product.updatedAt).toLocaleDateString()}</p>
                </div>
                {product.publishedAt && (
                  <div>
                    <Label className="text-gray-700">Published</Label>
                    <p className="text-gray-900">{new Date(product.publishedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

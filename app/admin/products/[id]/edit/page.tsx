"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ImageUpload } from "@/components/products/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
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
}

interface ProductFormData {
  name: string
  description: string
  sku: string
  price: number
  costPrice?: number
  comparePrice?: number
  stockQuantity: number
  lowStockThreshold: number
  trackQuantity: boolean
  weight?: number
  metaTitle?: string
  metaDescription?: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  isActive: boolean
  isFeatured: boolean
  categoryId?: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = Array.isArray(params.id) ? params.id[0] : params.id

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    sku: "",
    price: 0,
    stockQuantity: 0,
    lowStockThreshold: 10,
    trackQuantity: true,
    status: "DRAFT",
    isActive: true,
    isFeatured: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch product and categories in parallel
        const [productResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch('/api/categories')
        ])

        if (!productResponse.ok) {
          if (productResponse.status === 404) {
            setError("Product not found")
            return
          }
          throw new Error("Failed to fetch product")
        }

        const productData = await productResponse.json()
        const categoriesData = categoriesResponse.ok ? await categoriesResponse.json() : { categories: [] }

        setProduct(productData.product)
        setCategories(categoriesData.categories || [])

        // Populate form with existing product data
        const prod = productData.product
        setFormData({
          name: prod.name || "",
          description: prod.description || "",
          sku: prod.sku || "",
          price: parseFloat(prod.price) || 0,
          costPrice: prod.costPrice ? parseFloat(prod.costPrice) : undefined,
          comparePrice: prod.comparePrice ? parseFloat(prod.comparePrice) : undefined,
          stockQuantity: prod.stockQuantity || 0,
          lowStockThreshold: prod.lowStockThreshold || 10,
          trackQuantity: prod.trackQuantity ?? true,
          weight: prod.weight ? parseFloat(prod.weight) : undefined,
          metaTitle: prod.metaTitle || "",
          metaDescription: prod.metaDescription || "",
          status: prod.status || "DRAFT",
          isActive: prod.isActive ?? true,
          isFeatured: prod.isFeatured ?? false,
          categoryId: prod.categoryId || undefined,
        })

        // Set existing images
        setUploadedImages(prod.images || [])

      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError("Failed to load product data")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId])

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.sku.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)

      const cleanData = {
        ...formData,
        price: Number(formData.price),
        costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
        stockQuantity: Number(formData.stockQuantity),
        lowStockThreshold: Number(formData.lowStockThreshold),
        weight: formData.weight ? Number(formData.weight) : undefined,
        images: uploadedImages,
        thumbnail: uploadedImages[0],
        tags: [],
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (errorData.details && Array.isArray(errorData.details)) {
          const errorMessages = errorData.details.map((detail: any) =>
            `${detail.path.join('.')}: ${detail.message}`
          ).join(', ')
          throw new Error(`Validation errors: ${errorMessages}`)
        }

        throw new Error(errorData.error || 'Failed to update product')
      }

      toast.success('Product updated successfully!')
      router.push('/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Edit Product" description="Update product information">
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
      <DashboardLayout title="Edit Product" description="Update product information">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/products">
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

  return (
    <DashboardLayout
      title={`Edit Product: ${product.name}`}
      description="Update product information and settings"
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

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Product Information</h3>
              <p className="text-sm text-blue-700">
                ID: {product.id} • SKU: {product.sku} • Status: {product.status}
              </p>
            </div>
            <div className="flex space-x-2">
              {product.isActive && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              )}
              {product.isFeatured && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Featured</span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
              <CardTitle className="text-blue-900">Basic Information</CardTitle>
              <CardDescription className="text-blue-700">
                Update the basic details of your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-medium text-gray-700">
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    placeholder="Enter SKU"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <Select
                  value={formData.categoryId || "no-category"}
                  onValueChange={(value) => handleInputChange('categoryId', value === "no-category" ? undefined : value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-category">No category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-green-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
              <CardTitle className="text-green-900">Pricing</CardTitle>
              <CardDescription className="text-green-700">
                Update pricing information for your product
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice" className="text-sm font-medium text-gray-700">
                    Cost Price
                  </Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.costPrice || ''}
                    onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || undefined)}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comparePrice" className="text-sm font-medium text-gray-700">
                    Compare Price
                  </Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.comparePrice || ''}
                    onChange={(e) => handleInputChange('comparePrice', parseFloat(e.target.value) || undefined)}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500">Original price for discount display</p>
                </div>
              </div>

              {/* Profit Calculation */}
              {formData.price > 0 && formData.costPrice && formData.costPrice > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-800">
                    <strong>Profit Analysis:</strong>
                    <div className="mt-1 space-y-1">
                      <div>Profit: ${(formData.price - formData.costPrice).toFixed(2)}</div>
                      <div>Margin: {(((formData.price - formData.costPrice) / formData.price) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="border-orange-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50">
              <CardTitle className="text-orange-900">Inventory Management</CardTitle>
              <CardDescription className="text-orange-700">
                Update stock levels and inventory tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity" className="text-sm font-medium text-gray-700">
                    Stock Quantity
                  </Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    placeholder="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value) || 0)}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                  {formData.stockQuantity <= formData.lowStockThreshold && (
                    <p className="text-xs text-orange-600 font-medium">
                      ⚠️ Stock is at or below low stock threshold
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold" className="text-sm font-medium text-gray-700">
                    Low Stock Threshold
                  </Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    placeholder="10"
                    value={formData.lowStockThreshold}
                    onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 10)}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500">Alert when stock falls below this number</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trackQuantity"
                  checked={formData.trackQuantity}
                  onCheckedChange={(checked) => handleInputChange('trackQuantity', checked)}
                />
                <Label htmlFor="trackQuantity" className="text-sm font-medium text-gray-700">
                  Track quantity
                </Label>
                <p className="text-xs text-gray-500 ml-2">Enable inventory tracking for this product</p>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card className="border-purple-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
              <CardTitle className="text-purple-900">Product Images</CardTitle>
              <CardDescription className="text-purple-700">
                Update product images and gallery
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ImageUpload
                images={uploadedImages}
                onImagesChange={setUploadedImages}
                maxImages={8}
                disabled={isSubmitting}
              />
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-indigo-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/50">
              <CardTitle className="text-indigo-900">Additional Information</CardTitle>
              <CardDescription className="text-indigo-700">
                Update optional details and SEO settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700">
                  Meta Title
                </Label>
                <Input
                  id="metaTitle"
                  placeholder="SEO title (max 60 characters)"
                  value={formData.metaTitle || ''}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500">
                  {(formData.metaTitle || '').length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-sm font-medium text-gray-700">
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  placeholder="SEO description (max 160 characters)"
                  value={formData.metaDescription || ''}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500">
                  {(formData.metaDescription || '').length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status & Visibility */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <CardTitle className="text-gray-900">Status & Visibility</CardTitle>
              <CardDescription className="text-gray-700">
                Control product status and visibility settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                {formData.status === 'PUBLISHED' && (
                  <p className="text-xs text-green-600 font-medium">
                    ✅ Product will be visible to customers
                  </p>
                )}
                {formData.status === 'DRAFT' && (
                  <p className="text-xs text-yellow-600 font-medium">
                    📝 Product is saved as draft (not visible to customers)
                  </p>
                )}
                {formData.status === 'ARCHIVED' && (
                  <p className="text-xs text-red-600 font-medium">
                    🗄️ Product is archived (not visible to customers)
                  </p>
                )}
              </div>

              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active
                  </Label>
                  <p className="text-xs text-gray-500 ml-2">Product is active and available</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  />
                  <Label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                    Featured
                  </Label>
                  <p className="text-xs text-gray-500 ml-2">Show in featured products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <div className="flex space-x-4">
              <Link href="/admin/products">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Link href={`/admin/products/${productId}`}>
                <Button variant="ghost" type="button">
                  Voir le produit
                </Button>
              </Link>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Mettre à jour le produit
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

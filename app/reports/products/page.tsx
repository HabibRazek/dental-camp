"use client"

import React, { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Package, 
  Download, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye,
  Edit
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { ProductDetailsModal } from "@/components/products/product-details-modal"

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stockQuantity: number
  category: {
    id: string
    name: string
  }
  thumbnail?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ProductSummary {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  totalValue: number
  averagePrice: number
}

export default function ProductCatalogsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [summary, setSummary] = useState<ProductSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [allProducts, setAllProducts] = useState<Product[]>([]) // Store all products for client-side filtering
  const [categories, setCategories] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pagination, setPagination] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Fetch products when filters or pagination change (but NOT search term)
  useEffect(() => {
    fetchProducts()
  }, [currentPage, itemsPerPage, categoryFilter, statusFilter, stockFilter])

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProducts()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Build query parameters for pagination and filtering (no search - we'll do client-side)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        category: categoryFilter,
        status: statusFilter,
        stock: stockFilter
      })

      // Fetch products from dedicated catalog API with pagination
      const response = await fetch(`/api/products/catalog?${params}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch product catalog: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const productsData = data.products || []
      const summaryData = data.summary
      const paginationData = data.pagination

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('📦 Product Catalog Data:', {
          totalProducts: productsData.length,
          activeProducts: summaryData?.activeProducts || 0,
          lowStockProducts: summaryData?.lowStockProducts || 0
        })
      }

      setProducts(productsData)
      setAllProducts(productsData) // Store all products for client-side filtering
      setPagination(paginationData)

      // Use summary from API
      if (summaryData) {
        setSummary(summaryData)
      }

      setLastUpdated(new Date())

      // Show success message only on manual refresh
      if (!loading && paginationData) {
        toast.success(`Loaded ${productsData.length} of ${paginationData.totalCount} products`)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`)
      }

      const data = await response.json()
      const categoriesData = data.categories || []

      setCategories(categoriesData)

      if (process.env.NODE_ENV === 'development') {
        console.log('📂 Categories loaded:', categoriesData.length)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    }
  }

  // Client-side filtering for search
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return products
    }

    const searchLower = searchTerm.toLowerCase().trim()
    return products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.category?.name && product.category.name.toLowerCase().includes(searchLower))
    )
  }, [products, searchTerm])

  // Bulk action handlers
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleBulkExport = () => {
    const selectedProductsData = filteredProducts.filter(p => selectedProducts.includes(p.id))

    if (selectedProductsData.length === 0) {
      toast.error('Please select products to export')
      return
    }

    const headers = ['SKU', 'Name', 'Category', 'Price (TND)', 'Stock', 'Status', 'Created Date']
    const csvData = [
      headers.join(','),
      ...selectedProductsData.map(product => [
        product.sku || '',
        `"${(product.name || '').replace(/"/g, '""')}"`, // Escape quotes in product names
        `"${product.category?.name || 'Uncategorized'}"`,
        Number(product.price || 0).toFixed(2), // Convert to number first
        product.stockQuantity || 0,
        product.isActive ? 'Active' : 'Inactive',
        product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `selected-products-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success(`Exported ${selectedProductsData.length} selected products`)
    setSelectedProducts([])
  }

  // Update showBulkActions when selection changes
  React.useEffect(() => {
    setShowBulkActions(selectedProducts.length > 0)
  }, [selectedProducts])

  // View details handler
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setShowProductDetails(true)
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedProducts([]) // Clear selection when changing pages
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page
    setSelectedProducts([]) // Clear selection
  }

  const exportToCSV = async () => {
    try {
      setExportLoading(true)
      toast.info('Preparing export... This may take a moment.')

      // First, check if we have any products on the current page
      if (filteredProducts.length === 0) {
        toast.error('No products available to export. Please add some products first.')
        return
      }

      let allProducts: Product[] = []
      let currentPage = 1
      const pageSize = 50 // Smaller chunks for better reliability
      let hasMorePages = true
      let totalFetched = 0

      // Fetch all products in batches to avoid timeout
      while (hasMorePages && currentPage <= 50) { // Limit to 50 pages max
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: pageSize.toString(),
          category: categoryFilter,
          status: statusFilter,
          stock: stockFilter
        })

        console.log(`🔄 Fetching page ${currentPage} for export...`)

        try {
          const response = await fetch(`/api/products/catalog?${params}`)

          if (!response.ok) {
            const errorText = await response.text()
            console.error('Export API error:', response.status, response.statusText, errorText)

            // If first page fails, try fallback immediately
            if (currentPage === 1) {
              throw new Error(`API Error ${response.status}: ${response.statusText}`)
            } else {
              // If later pages fail, use what we have
              console.warn(`Page ${currentPage} failed, using ${allProducts.length} products collected so far`)
              break
            }
          }

          const data = await response.json()
          const products = data.products || []

          console.log(`✅ Page ${currentPage}: Got ${products.length} products`)
          totalFetched += products.length

          if (products.length === 0) {
            hasMorePages = false
          } else {
            allProducts = [...allProducts, ...products]
            hasMorePages = products.length === pageSize // Continue if we got a full page
            currentPage++
          }
        } catch (pageError) {
          console.error(`Error fetching page ${currentPage}:`, pageError)
          if (currentPage === 1) {
            throw pageError // Re-throw if first page fails
          } else {
            break // Stop if later pages fail
          }
        }
      }

      console.log(`📊 Total products collected: ${allProducts.length}`)

      // Apply client-side search filtering to export data
      let exportProducts = allProducts
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim()
        exportProducts = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.category?.name && product.category.name.toLowerCase().includes(searchLower))
        )
      }

      if (exportProducts.length === 0) {
        throw new Error('No products found matching your filters and search')
      }

      const headers = ['SKU', 'Name', 'Category', 'Price (TND)', 'Stock', 'Status', 'Created Date']
      const csvData = [
        headers.join(','),
        ...exportProducts.map((product, index) => {
          try {
            return [
              product.sku || '',
              `"${(product.name || '').replace(/"/g, '""')}"`, // Escape quotes in product names
              `"${product.category?.name || 'Uncategorized'}"`,
              Number(product.price || 0).toFixed(2), // Convert to number first
              product.stockQuantity || 0,
              product.isActive ? 'Active' : 'Inactive',
              product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''
            ].join(',')
          } catch (error) {
            console.error(`Error processing product ${index}:`, product, error)
            // Return a safe fallback row
            return [
              product.sku || '',
              `"${product.name || 'Unknown Product'}"`,
              '"Uncategorized"',
              '0.00',
              '0',
              'Unknown',
              ''
            ].join(',')
          }
        })
      ].join('\n')

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `product-catalog-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a) // Ensure element is in DOM
      a.click()
      document.body.removeChild(a) // Clean up
      URL.revokeObjectURL(url)

      toast.success(`✅ Successfully exported ${exportProducts.length} products to CSV`)
    } catch (error) {
      console.error('❌ Export failed:', error)

      // Fallback: Export current page data if full export fails
      try {
        console.log('🔄 Attempting fallback export with current page data...')
        if (filteredProducts.length > 0) {
          const headers = ['SKU', 'Name', 'Category', 'Price (TND)', 'Stock', 'Status', 'Created Date']
          const csvData = [
            headers.join(','),
            ...filteredProducts.map(product => [
              product.sku || '',
              `"${(product.name || '').replace(/"/g, '""')}"`,
              `"${product.category?.name || 'Uncategorized'}"`,
              Number(product.price || 0).toFixed(2), // Convert to number first
              product.stockQuantity || 0,
              product.isActive ? 'Active' : 'Inactive',
              product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''
            ].join(','))
          ].join('\n')

          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `product-catalog-current-page-${new Date().toISOString().split('T')[0]}.csv`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast.success(`📄 Exported ${filteredProducts.length} products from current page (fallback mode)`)
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          toast.error(`❌ No products available to export. Error: ${errorMessage}`)
        }
      } catch (fallbackError) {
        console.error('❌ Fallback export also failed:', fallbackError)
        const errorMessage = error instanceof Error ? error.message : 'Please try again later'
        toast.error(`❌ Export failed: ${errorMessage}`)
      }
    } finally {
      setExportLoading(false)
    }
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
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Product Catalogs"
        description="Comprehensive product catalog and inventory management"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading product catalog...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Product Catalogs"
      description="Comprehensive product catalog management and inventory reporting for your dental equipment store"
    >
      <div className="space-y-8">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Category:</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Stock:</Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={fetchProducts}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            {lastUpdated && (
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <Button onClick={exportToCSV} disabled={exportLoading}>
              {exportLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {exportLoading ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{summary.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {summary.activeProducts} active, {summary.inactiveProducts} inactive
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalValue)}</div>
                  <p className="text-xs text-muted-foreground">Total inventory worth</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {summary.lowStockProducts + summary.outOfStockProducts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {summary.lowStockProducts} low, {summary.outOfStockProducts} out
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(summary.averagePrice)}</div>
                  <p className="text-xs text-muted-foreground">Per product average</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Stock Distribution Chart */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Stock Distribution
                </CardTitle>
                <CardDescription>Inventory status breakdown across all products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">In Stock (&gt;5)</span>
                      <span className="text-sm text-green-600 font-medium">
                        {summary.totalProducts - summary.lowStockProducts - summary.outOfStockProducts}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${summary.totalProducts > 0 ? ((summary.totalProducts - summary.lowStockProducts - summary.outOfStockProducts) / summary.totalProducts) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Low Stock (1-5)</span>
                      <span className="text-sm text-orange-600 font-medium">{summary.lowStockProducts}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: `${summary.totalProducts > 0 ? (summary.lowStockProducts / summary.totalProducts) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Out of Stock (0)</span>
                      <span className="text-sm text-red-600 font-medium">{summary.outOfStockProducts}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${summary.totalProducts > 0 ? (summary.outOfStockProducts / summary.totalProducts) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProducts([])}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleBulkExport}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {pagination && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Show:</Label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">per page</span>
              </div>

              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalCount)} of {pagination.totalCount} products
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i
                  if (pageNum > pagination.totalPages) return null

                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Catalog
              </CardTitle>
              <CardDescription>
                Detailed product listing ({filteredProducts.length} {searchTerm ? `filtered from ${products.length}` : ''} products{pagination ? ` of ${pagination.totalCount} total` : ''})
                {searchTerm && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • Searching for "{searchTerm}"
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium w-12">
                        <Checkbox
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all products"
                        />
                      </th>
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">SKU</th>
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-left p-2 font-medium">Price</th>
                      <th className="text-left p-2 font-medium">Stock</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">
                          {searchTerm ? (
                            <div>
                              <p>No products found matching "{searchTerm}"</p>
                              <p className="text-sm mt-1">Try adjusting your search terms or filters</p>
                            </div>
                          ) : (
                            "No products found for the selected criteria"
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => handleSelectProduct(product.id)}
                              aria-label={`Select ${product.name}`}
                            />
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              {product.thumbnail ? (
                                <Image
                                  src={product.thumbnail}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{product.name}</div>
                                {product.description && (
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {product.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <span className="font-mono text-sm">{product.sku}</span>
                          </td>
                          <td className="p-2">
                            <span className="text-sm">{product.category?.name || 'Uncategorized'}</span>
                          </td>
                          <td className="p-2">
                            <span className="font-medium">{formatCurrency(product.price)}</span>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{product.stockQuantity}</span>
                              <Badge className={`text-xs ${getStockBadge(product.stockQuantity).className}`}>
                                {getStockBadge(product.stockQuantity).text}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge className={`text-xs ${getStatusBadge(product.isActive).className}`}>
                              {getStatusBadge(product.isActive).text}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(product)}
                                title="View Details"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Button size="sm" variant="outline" title="Edit Product">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>

              <span className="px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={currentPage === pagination.totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={showProductDetails}
        onClose={() => setShowProductDetails(false)}
      />
    </DashboardLayout>
  )
}

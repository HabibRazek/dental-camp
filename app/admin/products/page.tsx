"use client"

import { useState, useEffect } from "react"
import { ProductsTable, Product } from "@/components/products/products-table"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { SectionLoader } from "@/components/ui/loader"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10

  // Fetch products with pagination
  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      })

      const response = await fetch(`/api/products?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalCount(data.pagination?.totalCount || 0)
      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Handle product edit
  const handleEdit = (product: Product) => {
    // Navigate to edit page
    window.location.href = `/admin/products/${product.id}/edit`
  }

  // Handle product delete
  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast.success('Product deleted successfully')
      fetchProducts(currentPage) // Refresh the current page
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  // Handle status change
  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update product status')
      }

      toast.success(`Product ${newStatus.toLowerCase()} successfully`)
      fetchProducts(currentPage) // Refresh the current page
    } catch (err) {
      toast.error('Failed to update product status')
    }
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchProducts(page)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchProducts(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1)
    }
  }

  useEffect(() => {
    fetchProducts(1)
  }, [])

  if (loading) {
    return (
      <DashboardLayout
        title="Products"
        description="Manage your dental product inventory"
      >
        <SectionLoader size="lg" />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title="Products"
        description="Manage your dental product inventory"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => fetchProducts(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Products"
      description="Manage your dental product inventory with advanced search, filtering, and bulk operations"
    >
      <ProductsTable
        data={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        pagination={{
          currentPage,
          totalPages,
          totalCount,
          itemsPerPage,
          onPageChange: handlePageChange,
          onPreviousPage: handlePreviousPage,
          onNextPage: handleNextPage,
        }}
      />
    </DashboardLayout>
  )
}
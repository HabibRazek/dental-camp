"use client"

import { useState, useEffect } from "react"
import { CategoriesTable, Category } from "@/components/categories/categories-table"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { SectionLoader } from "@/components/ui/loader"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories?includeProducts=true')

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // Handle category edit
  const handleEdit = (category: Category) => {
    // Navigate to edit page
    window.location.href = `/admin/categories/${category.id}/edit`
  }

  // Handle category delete
  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete category')
      }

      toast.success('Category deleted successfully')
      fetchCategories() // Refresh the list
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete category')
    }
  }

  // Handle category status change
  const handleStatusChange = async (categoryId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) {
        throw new Error('Failed to update category status')
      }

      toast.success(`Category ${isActive ? 'activated' : 'deactivated'} successfully`)
      fetchCategories() // Refresh the list
    } catch (err) {
      toast.error('Failed to update category status')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <DashboardLayout
        title="Categories"
        description="Manage your product categories"
      >
        <SectionLoader size="lg" />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title="Categories"
        description="Manage your product categories"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={fetchCategories}
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
      title="Categories"
      description="Manage your product categories with advanced search, filtering, and bulk operations"
    >
      <CategoriesTable
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </DashboardLayout>
  )
}

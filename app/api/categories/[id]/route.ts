import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"
import { z } from "zod"

// Category validation schema
const UpdateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
  description: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters").optional(),
  isActive: z.boolean().optional(),
})

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const categoryData = UpdateCategorySchema.parse(body)

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // If name is being updated, check for uniqueness
    if (categoryData.name && categoryData.name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name: categoryData.name }
      })

      if (nameExists) {
        return NextResponse.json(
          { error: "A category with this name already exists" },
          { status: 400 }
        )
      }
    }

    // If slug is being updated, check for uniqueness
    if (categoryData.slug && categoryData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: categoryData.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 400 }
        )
      }
    }

    // Update the category
    const category = await prisma.category.update({
      where: { id },
      data: categoryData,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Category updated successfully",
      category
    })

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid category data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/categories/[id] - Partially update a category (e.g., toggle status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Only allow specific fields for PATCH
    const allowedFields = ['isActive']
    const updateData: any = {}
    
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Update the category
    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Category updated successfully",
      category
    })

  } catch (error) {
    console.error("Category patch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete category. It contains ${existingCategory._count.products} product(s). Please move or delete the products first.` 
        },
        { status: 400 }
      )
    }

    // Delete the category
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Category deleted successfully"
    })

  } catch (error) {
    console.error("Category deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

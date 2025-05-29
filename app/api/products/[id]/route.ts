import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { UpdateProductSchema } from "@/lib/validations/product"
import { ZodError } from "zod"

const prisma = new PrismaClient()

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Parse dimensions if it exists
    const productWithParsedDimensions = {
      ...product,
      dimensions: product.dimensions ? JSON.parse(product.dimensions) : null
    }

    return NextResponse.json({ product: productWithParsedDimensions })

  } catch (error) {
    console.error("Product GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updateData = UpdateProductSchema.parse({ ...body, id })

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const { id: productId, ...productData } = updateData
    let updatePayload: any = { ...productData }

    // Handle slug generation if name is being updated
    if (productData.name && productData.name !== existingProduct.name) {
      const baseSlug = generateSlug(productData.name)
      let slug = baseSlug
      let counter = 1

      // Ensure unique slug (excluding current product)
      while (true) {
        const existingSlug = await prisma.product.findUnique({
          where: { slug }
        })
        if (!existingSlug || existingSlug.id === id) {
          break
        }
        slug = `${baseSlug}-${counter}`
        counter++
      }
      updatePayload.slug = slug
    }

    // Handle SKU uniqueness if being updated
    if (productData.sku && productData.sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: productData.sku }
      })

      if (existingSku && existingSku.id !== id) {
        return NextResponse.json(
          { error: "A product with this SKU already exists" },
          { status: 400 }
        )
      }
    }

    // Convert dimensions to JSON string if provided
    if (productData.dimensions) {
      updatePayload.dimensions = JSON.stringify(productData.dimensions)
    }

    // Handle publishedAt date
    if (productData.status === 'PUBLISHED' && existingProduct.status !== 'PUBLISHED') {
      updatePayload.publishedAt = new Date()
    } else if (productData.status !== 'PUBLISHED' && existingProduct.status === 'PUBLISHED') {
      updatePayload.publishedAt = null
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updatePayload,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct
    })

  } catch (error) {
    console.error("Product update error:", error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid product data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Delete the product
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Product deleted successfully"
    })

  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

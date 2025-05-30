import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { CreateProductSchema, ProductQuerySchema } from "@/lib/validations/product"
import { ZodError } from "zod"

const prisma = new PrismaClient()

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/products - Get all products with filtering, searching, and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    // Convert string params to appropriate types
    const parsedParams = {
      ...queryParams,
      page: queryParams.page ? parseInt(queryParams.page) : undefined,
      limit: queryParams.limit ? parseInt(queryParams.limit) : undefined,
      isActive: queryParams.isActive ? queryParams.isActive === 'true' : undefined,
      isFeatured: queryParams.isFeatured ? queryParams.isFeatured === 'true' : undefined,
      minPrice: queryParams.minPrice ? parseFloat(queryParams.minPrice) : undefined,
      maxPrice: queryParams.maxPrice ? parseFloat(queryParams.maxPrice) : undefined,
    }

    const {
      page,
      limit,
      search,
      category,
      status,
      isActive,
      isFeatured,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder
    } = ProductQuerySchema.parse(parsedParams)

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (status) {
      where.status = status
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive
    }

    if (typeof isFeatured === 'boolean') {
      where.isFeatured = isFeatured
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = minPrice
      if (maxPrice) where.price.lte = maxPrice
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const productData = CreateProductSchema.parse(body)

    // Generate slug from name
    const baseSlug = generateSlug(productData.name)
    let slug = baseSlug
    let counter = 1

    // Ensure unique slug
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Ensure unique SKU
    const existingProduct = await prisma.product.findUnique({
      where: { sku: productData.sku }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 400 }
      )
    }

    // Convert dimensions to JSON string if provided
    const dimensions = productData.dimensions
      ? JSON.stringify(productData.dimensions)
      : null

    // Create the product
    const product = await prisma.product.create({
      data: {
        ...productData,
        slug,
        dimensions,
        publishedAt: productData.status === 'PUBLISHED' ? new Date() : null,
      },
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

    return NextResponse.json(
      {
        message: "Product created successfully",
        product
      },
      { status: 201 }
    )

  } catch (error) {
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

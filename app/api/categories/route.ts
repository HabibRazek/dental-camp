import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"
import { z } from "zod"

// Category validation schema
const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters"),
  isActive: z.boolean().default(true),
})

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const categories = await prisma.category.findMany({
      where,
      include: includeProducts ? {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            thumbnail: true,
            status: true,
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      } : {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ categories })

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const categoryData = CreateCategorySchema.parse(body)

    // Generate slug from name
    const baseSlug = generateSlug(categoryData.name)
    let slug = baseSlug
    let counter = 1

    // Ensure unique slug
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Ensure unique name
    const existingCategory = await prisma.category.findUnique({
      where: { name: categoryData.name }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      )
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        ...categoryData,
        slug,
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: "Category created successfully",
        category
      },
      { status: 201 }
    )

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

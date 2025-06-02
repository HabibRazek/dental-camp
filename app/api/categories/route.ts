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

// Mock categories for fallback
const mockCategories = [
  {
    id: '1',
    name: 'Composite & Adhésif',
    description: 'Matériaux de restauration dentaire de haute qualité',
    slug: 'composite-adhesif',
    icon: 'heart',
    image: null,
    color: '#3B82F6',
    isActive: true,
    _count: { products: 24 }
  },
  {
    id: '2',
    name: 'Instruments Dentaires',
    description: 'Instruments de précision pour tous vos besoins',
    slug: 'instruments',
    icon: 'scissors',
    image: null,
    color: '#60A5FA',
    isActive: true,
    _count: { products: 45 }
  },
  {
    id: '3',
    name: 'Équipement Médical',
    description: 'Technologies avancées pour votre cabinet',
    slug: 'equipement',
    icon: 'zap',
    image: null,
    color: '#93C5FD',
    isActive: true,
    _count: { products: 18 }
  },
  {
    id: '4',
    name: 'Stérilisation',
    description: 'Solutions complètes d\'hygiène et stérilisation',
    slug: 'sterilisation',
    icon: 'shield',
    image: null,
    color: '#BFDBFE',
    isActive: true,
    _count: { products: 32 }
  },
  {
    id: '5',
    name: 'Diagnostic',
    description: 'Outils de diagnostic de pointe',
    slug: 'diagnostic',
    icon: 'microscope',
    image: null,
    color: '#DBEAFE',
    isActive: true,
    _count: { products: 28 }
  },
  {
    id: '6',
    name: 'Anesthésie',
    description: 'Produits anesthésiques et accessoires',
    slug: 'anesthesie',
    icon: 'syringe',
    image: null,
    color: '#EFF6FF',
    isActive: true,
    _count: { products: 15 }
  }
]

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const isActive = searchParams.get('isActive')

    let categories = mockCategories
    let usingDatabase = false

    // Try to use database if available
    try {
      const where: any = {}
      if (isActive !== null) {
        where.isActive = isActive === 'true'
      }

      const dbCategories = await prisma.category.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          color: true,
          isActive: true,
          createdAt: true,
          products: includeProducts ? {
            select: {
              id: true,
              name: true,
              price: true,
              thumbnail: true,
              status: true,
            }
          } : false,
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: [
          { createdAt: 'asc' },
          { name: 'asc' }
        ]
      })

      if (dbCategories && dbCategories.length > 0) {
        categories = dbCategories
        usingDatabase = true
        console.log(`✅ Loaded ${dbCategories.length} categories from database`)
      } else {
        console.log("📝 No categories found in database, using mock data")
      }
    } catch (dbError) {
      console.log("🔄 Database not available, using mock data:", dbError.message)
    }

    return NextResponse.json({
      categories,
      success: true,
      source: usingDatabase ? "database" : "mock"
    })

  } catch (error) {
    console.error("❌ Error in categories API:", error)

    // Return mock data as fallback
    return NextResponse.json({
      categories: mockCategories,
      success: true,
      source: "fallback"
    })
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

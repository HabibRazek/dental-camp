import { NextResponse } from "next/server"

// Mock categories data for when database is not available (matching your 5 database categories)
const mockCategories = [
  {
    id: '1',
    name: 'Instrumentation Dentaire',
    description: 'L\'instrumentation dentaire de haute qualité',
    slug: 'instrumentation-dentaire',
    icon: 'scissors',
    image: null,
    color: '#3B82F6',
    isActive: true,
    _count: { products: 24 }
  },
  {
    id: '2',
    name: 'Empreinte Dentaire',
    description: 'Une empreinte dentaire de précision',
    slug: 'empreinte-dentaire',
    icon: 'fingerprint',
    image: null,
    color: '#8B5CF6',
    isActive: true,
    _count: { products: 45 }
  },
  {
    id: '3',
    name: 'Composite & Adhésif',
    description: 'En odontologie, le terme composite désigne un matériau de restauration dentaire',
    slug: 'composite-adh-sif',
    icon: 'heart',
    image: null,
    color: '#06B6D4',
    isActive: true,
    _count: { products: 18 }
  },
  {
    id: '4',
    name: 'Fraises & Polissage Dentaire',
    description: 'Les fraises et le polissage dentaire sont des outils essentiels',
    slug: 'fraises-polissage-dentaire',
    icon: 'tool',
    image: null,
    color: '#10B981',
    isActive: true,
    _count: { products: 32 }
  },
  {
    id: '5',
    name: 'Scellement & Collage',
    description: 'In French, "scellement" refers to sealing',
    slug: 'scellement-collage',
    icon: 'shield',
    image: null,
    color: '#F59E0B',
    isActive: true,
    _count: { products: 28 }
  }
]

export async function GET() {
  try {
    let categories = mockCategories
    let usingDatabase = false

    // Try to use database if available
    try {
      const { prisma } = await import("@/lib/prisma")

      const dbCategories = await prisma.category.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          color: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              products: {
                where: {
                  status: "PUBLISHED",
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: [
          { createdAt: "asc" },
          { name: "asc" }
        ],
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
      message: usingDatabase
        ? "Categories retrieved from database successfully"
        : "Categories retrieved successfully (using mock data)",
      source: usingDatabase ? "database" : "mock"
    })

  } catch (error) {
    console.error("❌ Error in categories public API:", error)

    // Return mock data as fallback
    return NextResponse.json({
      categories: mockCategories,
      success: true,
      message: "Categories retrieved successfully (fallback data)",
      source: "fallback"
    })
  }
}

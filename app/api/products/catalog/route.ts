import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Get pagination parameters from query
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const stock = searchParams.get('stock') || ''

    // Calculate offset
    const offset = (page - 1) * limit

    // Build where clause for filtering
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'all') {
      where.categoryId = category
    }

    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }

    if (stock && stock !== 'all') {
      if (stock === 'in_stock') {
        where.stockQuantity = { gt: 5 }
      } else if (stock === 'low_stock') {
        where.stockQuantity = { gte: 1, lte: 5 }
      } else if (stock === 'out_of_stock') {
        where.stockQuantity = 0
      }
    }

    // Fetch products with pagination and filtering
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Fetch all products for summary calculations (without pagination)
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        price: true,
        stockQuantity: true,
        isActive: true
      }
    })

    // Calculate summary statistics from all products (not just current page)
    const summary = {
      totalProducts: allProducts.length,
      activeProducts: allProducts.filter(p => p.isActive).length,
      inactiveProducts: allProducts.filter(p => !p.isActive).length,
      lowStockProducts: allProducts.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length,
      outOfStockProducts: allProducts.filter(p => p.stockQuantity === 0).length,
      totalValue: allProducts.reduce((sum, p) => {
        const price = Number(p.price) || 0
        const stock = Number(p.stockQuantity) || 0
        return sum + (price * stock)
      }, 0),
      averagePrice: allProducts.length > 0
        ? allProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0) / allProducts.length
        : 0
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      products,
      summary,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Product catalog API error:', error)
    return NextResponse.json(
      { error: "Failed to fetch product catalog" },
      { status: 500 }
    )
  }
}

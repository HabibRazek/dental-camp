import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/user/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('🔍 Fetching wishlist for user:', session.user.email)

    // For now, we'll get products and simulate wishlist
    // In a real app, you'd have a wishlist table
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      take: 8, // Limit to 8 products for demo
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📦 Found products for wishlist:', products.length)

    // Transform products to wishlist format
    const wishlistItems = products.map(product => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      originalPrice: product.comparePrice ? Number(product.comparePrice) : null,
      image: product.thumbnail || '/api/placeholder/300/300',
      category: product.category || 'General',
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      reviewCount: Math.floor(Math.random() * 200) + 10, // Random reviews 10-210
      inStock: product.stockQuantity > 0,
      stockQuantity: product.stockQuantity,
      addedDate: new Date().toISOString(),
      slug: product.slug,
      description: product.description || '',
      discount: product.comparePrice && product.price ?
        Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100) :
        null
    }))

    return NextResponse.json({
      success: true,
      items: wishlistItems,
      total: wishlistItems.length
    })

  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/user/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    // In a real app, you'd add to wishlist table
    // For now, we'll just return success
    console.log('❤️ Adding product to wishlist:', productId, 'for user:', session.user.email)

    return NextResponse.json({
      success: true,
      message: "Item added to wishlist"
    })

  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/user/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    // In a real app, you'd remove from wishlist table
    console.log('💔 Removing product from wishlist:', productId, 'for user:', session.user.email)

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist"
    })

  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

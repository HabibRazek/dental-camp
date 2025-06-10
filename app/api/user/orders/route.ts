import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")
    const status = searchParams.get("status")

    // Ensure user can only access their own orders (unless admin)
    if (session.user.role !== "ADMIN" && session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Build where clause - ALWAYS filter by current user's email
    const whereClause: any = {
      customerEmail: session.user.email // Filter by current user's email
    }

    if (status) {
      whereClause.status = status.toUpperCase()
    }

    console.log('🔍 Filtering orders for user email:', session.user.email)
    console.log('🔍 Where clause:', whereClause)

    // Fetch orders for the user
    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: (page - 1) * limit
    })

    console.log('📦 Found orders:', orders.length)
    console.log('📦 Orders data:', orders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerEmail: o.customerEmail,
      status: o.status,
      total: o.total
    })))

    // Process orders to match the expected format
    const processedOrders = orders.map(order => {
      // Parse items if they're stored as JSON string
      let items = []
      try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []
      } catch (e) {
        console.warn('Failed to parse order items:', e)
        items = []
      }

      // Create customer object from order data
      const customer = {
        id: session.user.id || '',
        firstName: order.customerName?.split(' ')[0] || '',
        lastName: order.customerName?.split(' ').slice(1).join(' ') || '',
        email: order.customerEmail || '',
        phone: order.customerPhone || ''
      }

      // Create totals object
      const totals = {
        subtotal: Number(order.subtotal) || 0,
        delivery: Number(order.total) - Number(order.subtotal) || 0,
        total: Number(order.total) || 0
      }

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        items: items,
        customer: customer,
        totals: totals,
        shippingAddress: order.shippingAddress || '',
        shippingCity: order.shippingCity || '',
        shippingPostalCode: order.shippingPostalCode || '',
        shippingCountry: order.shippingCountry || '',
        paymentMethod: order.paymentMethod || '',
        paymentStatus: order.paymentStatus || '',
        createdAt: order.createdAt.toISOString()
      }
    })

    // Get total count for pagination
    const totalCount = await prisma.order.count({
      where: whereClause
    })

    // Calculate statistics
    const stats = {
      total: totalCount,
      pending: await prisma.order.count({
        where: { ...whereClause, status: 'PENDING' }
      }),
      processing: await prisma.order.count({
        where: { ...whereClause, status: 'PROCESSING' }
      }),
      shipped: await prisma.order.count({
        where: { ...whereClause, status: 'SHIPPED' }
      }),
      delivered: await prisma.order.count({
        where: { ...whereClause, status: 'DELIVERED' }
      })
    }

    return NextResponse.json({
      orders: processedOrders,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      stats
    })

  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

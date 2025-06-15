import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    console.log('📊 Fetching order reports:', { timeRange, status, page, limit })

    // Calculate date filter
    let dateFilter: Date | undefined
    const now = new Date()

    switch (timeRange) {
      case "7d":
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1y":
        dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Build where clause
    const where: any = {}
    
    if (dateFilter) {
      where.createdAt = {
        gte: dateFilter
      }
    }

    if (status !== 'all') {
      where.status = status.toUpperCase()
    }

    // Get orders with pagination
    const skip = (page - 1) * limit
    
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          customerEmail: true,
          status: true,
          total: true,
          items: true, // JSON field
          createdAt: true,
          paymentMethod: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    console.log(`📦 Found ${orders.length} orders for reports`)

    // Calculate summary statistics
    const allOrdersInRange = await prisma.order.findMany({
      where: dateFilter ? { createdAt: { gte: dateFilter } } : {},
      select: {
        status: true,
        total: true,
        items: true, // JSON field
        createdAt: true
      }
    })

    const summary = {
      totalOrders: allOrdersInRange.length,
      totalRevenue: allOrdersInRange.reduce((sum, order) => sum + Number(order.total), 0),
      averageOrderValue: allOrdersInRange.length > 0 
        ? allOrdersInRange.reduce((sum, order) => sum + Number(order.total), 0) / allOrdersInRange.length 
        : 0,
      completedOrders: allOrdersInRange.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.status)).length,
      pendingOrders: allOrdersInRange.filter(o => ['PENDING', 'PROCESSING', 'SHIPPED'].includes(o.status)).length,
      cancelledOrders: allOrdersInRange.filter(o => o.status === 'CANCELLED').length,
      totalItems: allOrdersInRange.reduce((sum, order) => {
        const items = Array.isArray(order.items) ? order.items : []
        return sum + items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0)
      }, 0)
    }

    // Calculate daily order trends
    const dailyTrends = []
    const daysToShow = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      
      const dayOrders = allOrdersInRange.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= dayStart && orderDate < dayEnd
      })
      
      dailyTrends.push({
        date: dayStart.toISOString().split('T')[0],
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + Number(order.total), 0)
      })
    }

    // Status distribution
    const statusDistribution = [
      { name: 'En attente', value: summary.pendingOrders, color: '#f59e0b' },
      { name: 'Terminées', value: summary.completedOrders, color: '#10b981' },
      { name: 'Annulées', value: summary.cancelledOrders, color: '#ef4444' }
    ].filter(item => item.value > 0)

    // Format orders for response
    const formattedOrders = orders.map(order => {
      const items = Array.isArray(order.items) ? order.items : []
      const itemsCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        status: order.status,
        total: Number(order.total),
        itemsCount,
        createdAt: order.createdAt.toISOString(),
        paymentMethod: order.paymentMethod || 'N/A'
      }
    })

    console.log('✅ Order reports calculated:', {
      ordersCount: formattedOrders.length,
      totalRevenue: summary.totalRevenue,
      averageOrderValue: summary.averageOrderValue.toFixed(2)
    })

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      summary,
      dailyTrends,
      statusDistribution,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1
      }
    })

  } catch (error) {
    console.error('❌ Order reports API error:', error)
    return NextResponse.json(
      { error: "Failed to fetch order reports" },
      { status: 500 }
    )
  }
}

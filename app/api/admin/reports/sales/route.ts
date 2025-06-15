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

    console.log('📈 Fetching sales analytics:', { timeRange })

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

    // Fetch orders, products, and customers
    const [orders, products, customers] = await Promise.all([
      prisma.order.findMany({
        where: dateFilter ? { createdAt: { gte: dateFilter } } : {},
        select: {
          id: true,
          customerEmail: true,
          total: true,
          items: true, // JSON field
          createdAt: true,
          paymentMethod: true,
          status: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          category: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.user.findMany({
        where: {
          role: 'USER',
          createdAt: dateFilter ? { gte: dateFilter } : undefined
        },
        select: {
          id: true,
          email: true,
          createdAt: true
        }
      })
    ])

    console.log(`💰 Processing ${orders.length} orders for sales analytics`)

    // Calculate basic metrics
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const totalCustomers = new Set(orders.map(order => order.customerEmail)).size

    // Calculate previous period for comparison
    const previousPeriodStart = new Date(dateFilter!.getTime() - (now.getTime() - dateFilter!.getTime()))
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: dateFilter
        }
      }
    })

    const previousRevenue = previousOrders.reduce((sum, order) => sum + Number(order.total), 0)
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
    const ordersGrowth = previousOrders.length > 0 ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100 : 0

    // Top selling products
    const productSales: Record<string, { name: string; sales: number; revenue: number; category: string }> = {}

    orders.forEach(order => {
      const items = Array.isArray(order.items) ? order.items : []
      items.forEach((item: any) => {
        if (item.productId && item.name) {
          const productId = item.productId
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.name,
              sales: 0,
              revenue: 0,
              category: item.category || 'Uncategorized'
            }
          }
          productSales[productId].sales += item.quantity || 0
          productSales[productId].revenue += (Number(item.price) || 0) * (item.quantity || 0)
        }
      })
    })

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Sales by category
    const categorySales: Record<string, number> = {}
    orders.forEach(order => {
      const items = Array.isArray(order.items) ? order.items : []
      items.forEach((item: any) => {
        if (item.category) {
          const category = item.category
          categorySales[category] = (categorySales[category] || 0) + ((Number(item.price) || 0) * (item.quantity || 0))
        }
      })
    })

    const salesByCategory = Object.entries(categorySales)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)

    // Monthly trends
    const monthlyTrends = []
    const monthsToShow = timeRange === '1y' ? 12 : 6
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd
      })
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      monthlyTrends.push({
        month: monthNames[date.getMonth()],
        revenue: monthOrders.reduce((sum, order) => sum + Number(order.total), 0),
        orders: monthOrders.length,
        customers: new Set(monthOrders.map(order => order.customerEmail)).size
      })
    }

    // Customer acquisition
    const newCustomers = customers.length
    const returningCustomers = totalCustomers - newCustomers

    // Payment methods distribution
    const paymentMethods: Record<string, number> = {}
    orders.forEach(order => {
      const method = order.paymentMethod || 'Unknown'
      paymentMethods[method] = (paymentMethods[method] || 0) + 1
    })

    const paymentDistribution = Object.entries(paymentMethods)
      .map(([method, count]) => ({ 
        method, 
        count, 
        percentage: Math.round((count / totalOrders) * 100) 
      }))
      .sort((a, b) => b.count - a.count)

    console.log('✅ Sales analytics calculated:', {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      averageOrderValue: averageOrderValue.toFixed(2),
      revenueGrowth: revenueGrowth.toFixed(1) + '%'
    })

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalCustomers,
        revenueGrowth,
        ordersGrowth,
        newCustomers,
        returningCustomers
      },
      topProducts,
      salesByCategory,
      monthlyTrends,
      paymentDistribution,
      timeRange
    })

  } catch (error) {
    console.error('❌ Sales analytics API error:', error)
    return NextResponse.json(
      { error: "Failed to fetch sales analytics" },
      { status: 500 }
    )
  }
}

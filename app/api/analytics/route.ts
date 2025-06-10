import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Get time range from query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

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
        dateFilter = undefined // No filter for all time
    }

    // Fetch all data directly from database for analytics
    const [orders, customers, products] = await Promise.all([
      // Get orders with optional date filter
      prisma.order.findMany({
        where: dateFilter ? {
          createdAt: {
            gte: dateFilter
          }
        } : undefined,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      
      // Get all users (customers)
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      
      // Get all products
      prisma.product.findMany({
        include: {
          category: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])

    // Calculate analytics
    const totalOrders = orders.length
    const totalCustomers = customers.length
    const totalProducts = products.length
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = Number(order.total) || 0
      return sum + orderTotal
    }, 0)

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate REAL monthly revenue and orders from database
    const monthlyData = []
    const currentDate = new Date()

    // Always show 12 months for the chart
    const monthsToShow = 12

    console.log(`📊 Processing ${orders.length} orders for monthly analytics`)

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' })
      const year = monthDate.getFullYear()
      const monthKey = `${monthName} ${year}`

      // Filter orders for this specific month and year
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === monthDate.getMonth() &&
               orderDate.getFullYear() === monthDate.getFullYear()
      })

      // Calculate total revenue for this month
      const monthRevenue = monthOrders.reduce((sum, order) => {
        const orderTotal = Number(order.total) || 0
        return sum + orderTotal
      }, 0)

      // Count orders for this month
      const orderCount = monthOrders.length

      console.log(`📅 ${monthKey}: ${orderCount} orders, ${monthRevenue} TND revenue`)

      monthlyData.push({
        month: monthKey,
        revenue: monthRevenue,
        orders: orderCount,
        date: monthDate.toISOString().split('T')[0] // For chart x-axis
      })
    }

    console.log(`✅ Generated monthly data for ${monthlyData.length} months`)

    // Use the real monthly data
    const monthlyRevenue = monthlyData

    // Calculate order status distribution
    const statusCounts = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    const orderStatus = [
      { status: 'Completed', count: statusCounts.COMPLETED || 0, color: '#10b981' },
      { status: 'Pending', count: statusCounts.PENDING || 0, color: '#f59e0b' },
      { status: 'Processing', count: statusCounts.PROCESSING || 0, color: '#3b82f6' },
      { status: 'Cancelled', count: statusCounts.CANCELLED || 0, color: '#ef4444' },
    ]

    // Calculate top products (based on order items)
    const productSales: { [key: string]: { name: string, sales: number, revenue: number } } = {}

    orders.forEach(order => {
      try {
        // Parse JSON items safely
        let orderItems = []
        if (Array.isArray(order.items)) {
          orderItems = order.items
        } else if (typeof order.items === 'string') {
          orderItems = JSON.parse(order.items)
        } else if (order.items && typeof order.items === 'object') {
          orderItems = [order.items]
        }

        orderItems.forEach((item: any) => {
          const productId = item.productId || item.id
          if (productId) {
            if (!productSales[productId]) {
              const product = products.find(p => p.id === productId)
              productSales[productId] = {
                name: product?.name || item.name || 'Unknown Product',
                sales: 0,
                revenue: 0
              }
            }
            productSales[productId].sales += item.quantity || 1
            productSales[productId].revenue += (item.price || 0) * (item.quantity || 1)
          }
        })
      } catch (error) {
        console.warn('Failed to parse order items for order:', order.id, error)
      }
    })

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Calculate customer segments (mock data for now)
    const customerSegments = [
      { name: 'New Customers', value: 35, color: '#3b82f6' },
      { name: 'Returning Customers', value: 45, color: '#10b981' },
      { name: 'VIP Customers', value: 20, color: '#f59e0b' },
    ]

    // Calculate growth rates (mock for now - would need historical data)
    const revenueGrowth = Math.random() * 20 - 5
    const ordersGrowth = Math.random() * 15 - 2
    const customersGrowth = Math.random() * 25 - 5
    const productsGrowth = Math.random() * 10 - 2

    const analytics = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      averageOrderValue,
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      productsGrowth,
      monthlyRevenue,
      topProducts,
      customerSegments,
      orderStatus
    }

    return NextResponse.json(analytics, { status: 200 })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    )
  }
}

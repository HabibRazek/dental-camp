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
    const statusCounts: Record<string, number> = orders.reduce((acc: Record<string, number>, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    // Create order status with French labels and only show statuses that have orders
    const orderStatusMap = {
      'COMPLETED': { label: 'Terminées', color: '#10b981' },
      'PENDING': { label: 'En attente', color: '#f59e0b' },
      'PROCESSING': { label: 'En cours', color: '#3b82f6' },
      'CANCELLED': { label: 'Annulées', color: '#ef4444' },
      'SHIPPED': { label: 'Expédiées', color: '#8b5cf6' },
      'DELIVERED': { label: 'Livrées', color: '#059669' }
    }

    const orderStatus = Object.entries(statusCounts)
      .filter(([, count]) => count > 0) // Only show statuses with orders
      .map(([status, count]) => ({
        status: orderStatusMap[status as keyof typeof orderStatusMap]?.label || status,
        count: count,
        color: orderStatusMap[status as keyof typeof orderStatusMap]?.color || '#6b7280',
        originalStatus: status
      }))
      .sort((a, b) => b.count - a.count) // Sort by count descending

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

    // Calculate REAL customer segments based on order history
    const customerOrderCounts: { [key: string]: number } = {}
    const customerRevenue: { [key: string]: number } = {}

    console.log(`👥 Analyzing ${customers.length} customers and ${orders.length} orders for segments`)

    // Count orders and revenue per customer
    orders.forEach(order => {
      const customerId = order.customerId
      if (customerId) {
        customerOrderCounts[customerId] = (customerOrderCounts[customerId] || 0) + 1
        customerRevenue[customerId] = (customerRevenue[customerId] || 0) + (Number(order.total) || 0)
      }
    })

    console.log(`📊 Customer order counts:`, customerOrderCounts)
    console.log(`💰 Customer revenue:`, customerRevenue)

    // Categorize customers
    let newCustomers = 0
    let returningCustomers = 0
    let vipCustomers = 0
    let inactiveCustomers = 0

    customers.forEach(customer => {
      const orderCount = customerOrderCounts[customer.id] || 0
      const revenue = customerRevenue[customer.id] || 0

      if (orderCount === 0) {
        inactiveCustomers++
      } else if (orderCount === 1) {
        newCustomers++
      } else if (orderCount >= 2 && orderCount <= 5) {
        returningCustomers++
      } else if (orderCount > 5 || revenue > 1000) {
        vipCustomers++
      }
    })

    // Calculate percentages based on total customers (not just active)
    const totalCustomersCount = customers.length
    const customerSegments = totalCustomersCount > 0 ? [
      {
        name: 'Nouveaux clients',
        value: Math.round((newCustomers / totalCustomersCount) * 100),
        color: '#3b82f6',
        count: newCustomers
      },
      {
        name: 'Clients fidèles',
        value: Math.round((returningCustomers / totalCustomersCount) * 100),
        color: '#10b981',
        count: returningCustomers
      },
      {
        name: 'Clients VIP',
        value: Math.round((vipCustomers / totalCustomersCount) * 100),
        color: '#f59e0b',
        count: vipCustomers
      },
      {
        name: 'Clients inactifs',
        value: Math.round((inactiveCustomers / totalCustomersCount) * 100),
        color: '#6b7280',
        count: inactiveCustomers
      }
    ].filter(segment => segment.count > 0) : [
      { name: 'Aucun client', value: 100, color: '#6b7280', count: 0 }
    ]

    console.log(`✅ Final customer segments:`, customerSegments)

    // Calculate REAL growth rates based on historical data
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    const endOfTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 1, 0)

    // Current month data
    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= currentMonth
    })
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + Number(order.total), 0)
    const currentMonthCustomers = new Set(currentMonthOrders.map(order => order.customerEmail)).size

    // Last month data
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= lastMonth && orderDate <= endOfLastMonth
    })
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.total), 0)
    const lastMonthCustomers = new Set(lastMonthOrders.map(order => order.customerEmail)).size

    // Two months ago data (for customer growth comparison)
    const twoMonthsAgoCustomers = customers.filter(customer => {
      const customerDate = new Date(customer.createdAt)
      return customerDate <= endOfTwoMonthsAgo
    }).length

    // Calculate real growth rates
    const revenueGrowth = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : currentMonthRevenue > 0 ? 100 : 0

    const ordersGrowth = lastMonthOrders.length > 0
      ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
      : currentMonthOrders.length > 0 ? 100 : 0

    const customersGrowth = twoMonthsAgoCustomers > 0
      ? ((customers.length - twoMonthsAgoCustomers) / twoMonthsAgoCustomers) * 100
      : customers.length > 0 ? 100 : 0

    // Products growth (based on recently added products)
    const recentProducts = products.filter(product => {
      const productDate = new Date(product.createdAt)
      return productDate >= lastMonth
    })
    const productsGrowth = products.length > 0
      ? (recentProducts.length / products.length) * 100
      : 0

    console.log('📈 Growth rates calculated:', {
      revenueGrowth: `${revenueGrowth.toFixed(1)}%`,
      ordersGrowth: `${ordersGrowth.toFixed(1)}%`,
      customersGrowth: `${customersGrowth.toFixed(1)}%`,
      productsGrowth: `${productsGrowth.toFixed(1)}%`
    })

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

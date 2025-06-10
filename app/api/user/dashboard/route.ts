import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('📊 Fetching dashboard data for user:', session.user.email)

    // Calculate date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const last6Months = new Date()
    last6Months.setMonth(now.getMonth() - 6)

    // Fetch user orders
    const orders = await prisma.order.findMany({
      where: {
        customerEmail: session.user.email as string
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📦 Found orders:', orders.length)

    // Calculate basic statistics
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0)
    const pendingOrders = orders.filter(order => order.status === 'PENDING' || order.status === 'PROCESSING').length
    const deliveredOrders = orders.filter(order => order.status === 'DELIVERED').length

    // Calculate this month vs last month
    const thisMonthOrders = orders.filter(order => 
      new Date(order.createdAt) >= startOfMonth
    )
    const lastMonthOrders = orders.filter(order => 
      new Date(order.createdAt) >= startOfLastMonth && 
      new Date(order.createdAt) <= endOfLastMonth
    )

    const thisMonthSpent = thisMonthOrders.reduce((sum, order) => sum + Number(order.total), 0)
    const lastMonthSpent = lastMonthOrders.reduce((sum, order) => sum + Number(order.total), 0)

    // Calculate growth percentages
    const orderGrowth = lastMonthOrders.length > 0 
      ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 
      : thisMonthOrders.length > 0 ? 100 : 0

    const spendingGrowth = lastMonthSpent > 0 
      ? ((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100 
      : thisMonthSpent > 0 ? 100 : 0

    // Calculate monthly spending for chart (last 6 months)
    const monthlySpending = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date()
      monthDate.setMonth(now.getMonth() - i)
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd
      })
      
      const monthTotal = monthOrders.reduce((sum, order) => sum + Number(order.total), 0)
      
      monthlySpending.push({
        month: monthNames[monthDate.getMonth()],
        amount: monthTotal,
        orders: monthOrders.length
      })
    }

    // Calculate order status distribution
    const orderStatusData = [
      { 
        name: 'Delivered', 
        value: Math.round((deliveredOrders / Math.max(totalOrders, 1)) * 100), 
        color: '#10B981',
        count: deliveredOrders
      },
      { 
        name: 'Shipped', 
        value: Math.round((orders.filter(o => o.status === 'SHIPPED').length / Math.max(totalOrders, 1)) * 100), 
        color: '#3B82F6',
        count: orders.filter(o => o.status === 'SHIPPED').length
      },
      { 
        name: 'Processing', 
        value: Math.round((orders.filter(o => o.status === 'PROCESSING').length / Math.max(totalOrders, 1)) * 100), 
        color: '#F59E0B',
        count: orders.filter(o => o.status === 'PROCESSING').length
      },
      { 
        name: 'Pending', 
        value: Math.round((orders.filter(o => o.status === 'PENDING').length / Math.max(totalOrders, 1)) * 100), 
        color: '#EF4444',
        count: orders.filter(o => o.status === 'PENDING').length
      }
    ].filter(item => item.value > 0) // Only include statuses that exist

    // Get recent orders (last 3)
    const recentOrders = orders.slice(0, 3).map(order => ({
      id: order.orderNumber || order.id,
      date: order.createdAt.toISOString().split('T')[0],
      status: order.status,
      total: Number(order.total),
      items: 1, // We don't have order items count, so default to 1
      product: `Order ${order.orderNumber || order.id.slice(-6)}`
    }))

    // Fetch wishlist items (using products as demo)
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      take: 3,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const wishlistItems = products.map(product => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      originalPrice: product.comparePrice ? Number(product.comparePrice) : null,
      discount: product.comparePrice && product.price ?
        Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100) :
        0,
      image: product.thumbnail || '/api/placeholder/300/300',
      inStock: product.stockQuantity > 0
    }))

    // Calculate loyalty points (1 point per TND spent)
    const loyaltyPoints = Math.floor(totalSpent)

    // Calculate savings (from discounts)
    const savedAmount = orders.reduce((sum, order) => {
      // Estimate 10% average savings per order
      return sum + (Number(order.total) * 0.1)
    }, 0)

    // Calculate completion rate
    const completionRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0

    // Get user info
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { createdAt: true }
    })

    const dashboardData = {
      // KPI Stats
      stats: {
        totalOrders,
        totalSpent,
        pendingOrders,
        loyaltyPoints,
        savedAmount,
        completionRate,
        orderGrowth: Math.round(orderGrowth * 10) / 10, // Round to 1 decimal
        spendingGrowth: Math.round(spendingGrowth * 10) / 10,
        wishlistCount: wishlistItems.length
      },

      // Chart Data
      charts: {
        monthlySpending,
        orderStatusData
      },

      // Recent Activity
      recentOrders,
      wishlistItems,

      // User Info
      user: {
        memberSince: user?.createdAt?.toISOString() || new Date().toISOString(),
        lastOrderDate: orders.length > 0 ? orders[0].createdAt.toISOString() : null
      }
    }

    console.log('✅ Dashboard data calculated:', {
      totalOrders,
      totalSpent,
      monthlyDataPoints: monthlySpending.length,
      recentOrdersCount: recentOrders.length,
      wishlistItemsCount: wishlistItems.length
    })

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

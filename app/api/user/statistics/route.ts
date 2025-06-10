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
    const period = searchParams.get("period") || "6months"

    console.log('📊 Fetching statistics for user:', session.user.email, 'period:', period)

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '3months':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6months':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 6)
    }

    // Fetch user's orders
    const orders = await prisma.order.findMany({
      where: {
        customerEmail: session.user.email,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📦 Found orders for statistics:', orders.length)

    // Calculate basic statistics
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0)
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

    // Calculate monthly spending based on selected period
    const monthlySpending = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Determine number of months based on period
    let monthsToShow = 6 // default
    switch (period) {
      case '3months':
        monthsToShow = 3
        break
      case '6months':
        monthsToShow = 6
        break
      case '1year':
        monthsToShow = 12
        break
    }

    console.log('📅 Calculating monthly spending for', monthsToShow, 'months, period:', period)

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthDate = new Date()
      monthDate.setMonth(now.getMonth() - i)
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)

      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd
      })

      const monthTotal = monthOrders.reduce((sum, order) => sum + Number(order.total), 0)

      const monthYear = monthDate.getFullYear()
      const currentYear = now.getFullYear()
      const monthLabel = monthYear === currentYear ?
        monthNames[monthDate.getMonth()] :
        `${monthNames[monthDate.getMonth()]} ${monthYear.toString().slice(-2)}`

      monthlySpending.push({
        month: monthLabel,
        amount: monthTotal
      })

      console.log(`📊 Month ${monthLabel}: ${monthTotal} TND from ${monthOrders.length} orders`)
    }

    // Calculate top categories from order items
    const categoryStats = new Map()
    
    orders.forEach(order => {
      try {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []
        items.forEach((item: any) => {
          const category = item.category || 'General'
          const current = categoryStats.get(category) || { count: 0, total: 0 }
          categoryStats.set(category, {
            count: current.count + (item.quantity || 1),
            total: current.total + (Number(item.price) * (item.quantity || 1))
          })
        })
      } catch (e) {
        console.warn('Failed to parse order items:', e)
      }
    })

    // Convert to array and calculate percentages
    const totalCategoryCount = Array.from(categoryStats.values()).reduce((sum, cat) => sum + cat.count, 0)
    const topCategories = Array.from(categoryStats.entries())
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        percentage: totalCategoryCount > 0 ? Math.round((stats.count / totalCategoryCount) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5 categories

    // Calculate orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'PENDING').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length
    }

    // Calculate loyalty points (simple: 1 point per TND spent)
    const loyaltyPoints = Math.floor(totalSpent)

    // Get user creation date
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { createdAt: true }
    })

    // Find favorite products (most ordered items)
    const productStats = new Map()
    orders.forEach(order => {
      try {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []
        items.forEach((item: any) => {
          const current = productStats.get(item.name) || 0
          productStats.set(item.name, current + (item.quantity || 1))
        })
      } catch (e) {
        console.warn('Failed to parse order items for products:', e)
      }
    })

    const favoriteProducts = Array.from(productStats.entries())
      .map(([name, orders]) => ({ name, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 3) // Top 3 products

    const statistics = {
      totalOrders,
      totalSpent,
      averageOrderValue,
      monthlySpending,
      topCategories,
      ordersByStatus,
      loyaltyPoints,
      memberSince: user?.createdAt?.toISOString() || new Date().toISOString(),
      lastOrderDate: orders.length > 0 ? orders[0].createdAt.toISOString() : null,
      favoriteProducts
    }

    console.log('📊 Calculated statistics:', {
      totalOrders,
      totalSpent,
      categoriesCount: topCategories.length,
      monthlyDataPoints: monthlySpending.length
    })

    return NextResponse.json({
      success: true,
      statistics,
      period
    })

  } catch (error) {
    console.error("Error fetching user statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

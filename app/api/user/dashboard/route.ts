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

    // Calculate DYNAMIC order status distribution with French labels
    const statusCounts: Record<string, number> = {}
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })

    const statusMap = {
      'COMPLETED': { label: 'Terminées', color: '#10B981' },
      'DELIVERED': { label: 'Livrées', color: '#059669' },
      'SHIPPED': { label: 'Expédiées', color: '#3B82F6' },
      'PROCESSING': { label: 'En cours', color: '#F59E0B' },
      'PENDING': { label: 'En attente', color: '#EF4444' },
      'CANCELLED': { label: 'Annulées', color: '#6B7280' }
    }

    const orderStatusData = Object.entries(statusCounts)
      .filter(([, count]) => count > 0) // Only show statuses with orders
      .map(([status, count]) => ({
        name: statusMap[status as keyof typeof statusMap]?.label || status,
        value: Math.round((count / Math.max(totalOrders, 1)) * 100),
        color: statusMap[status as keyof typeof statusMap]?.color || '#6B7280',
        count: count,
        originalStatus: status
      }))
      .sort((a, b) => b.count - a.count) // Sort by count descending

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

    // Calculate DYNAMIC loyalty progress
    const loyaltyTiers = {
      BRONZE: { min: 0, max: 500, name: 'Bronze', next: 'Silver' },
      SILVER: { min: 500, max: 1500, name: 'Silver', next: 'Gold' },
      GOLD: { min: 1500, max: 3000, name: 'Gold', next: 'Platinum' },
      PLATINUM: { min: 3000, max: Infinity, name: 'Platinum', next: null }
    }

    let currentTier = 'BRONZE'
    let loyaltyProgress = 0
    let pointsToNextTier = 0
    let nextTierName: string | null = 'Silver'

    // Determine current tier and progress
    if (loyaltyPoints >= loyaltyTiers.PLATINUM.min) {
      currentTier = 'PLATINUM'
      loyaltyProgress = 100
      pointsToNextTier = 0
      nextTierName = null
    } else if (loyaltyPoints >= loyaltyTiers.GOLD.min) {
      currentTier = 'GOLD'
      const tierRange = loyaltyTiers.GOLD.max - loyaltyTiers.GOLD.min
      const tierProgress = loyaltyPoints - loyaltyTiers.GOLD.min
      loyaltyProgress = Math.round((tierProgress / tierRange) * 100)
      pointsToNextTier = loyaltyTiers.GOLD.max - loyaltyPoints
      nextTierName = loyaltyTiers.GOLD.next
    } else if (loyaltyPoints >= loyaltyTiers.SILVER.min) {
      currentTier = 'SILVER'
      const tierRange = loyaltyTiers.SILVER.max - loyaltyTiers.SILVER.min
      const tierProgress = loyaltyPoints - loyaltyTiers.SILVER.min
      loyaltyProgress = Math.round((tierProgress / tierRange) * 100)
      pointsToNextTier = loyaltyTiers.SILVER.max - loyaltyPoints
      nextTierName = loyaltyTiers.SILVER.next
    } else {
      currentTier = 'BRONZE'
      const tierRange = loyaltyTiers.BRONZE.max - loyaltyTiers.BRONZE.min
      loyaltyProgress = Math.round((loyaltyPoints / tierRange) * 100)
      pointsToNextTier = loyaltyTiers.BRONZE.max - loyaltyPoints
      nextTierName = loyaltyTiers.BRONZE.next
    }

    // Calculate DYNAMIC monthly budget based on user's spending history
    const userSpendingHistory = orders.slice(0, 6) // Last 6 orders
    const averageOrderValue = userSpendingHistory.length > 0
      ? userSpendingHistory.reduce((sum, order) => sum + Number(order.total), 0) / userSpendingHistory.length
      : 200

    // Set dynamic monthly budget based on user's spending pattern
    // Conservative approach: 2-3x average order value or minimum 300 TND
    const monthlyBudget = Math.max(300, Math.round(averageOrderValue * 2.5))
    const currentMonthSpent = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, order) => sum + Number(order.total), 0)

    const savingsGoalProgress = Math.min(Math.round((currentMonthSpent / monthlyBudget) * 100), 100)
    const remainingBudget = Math.max(0, monthlyBudget - currentMonthSpent)

    // Calculate actual savings from discounts and deals
    const savedAmount = orders.reduce((sum, order) => {
      // Calculate savings based on order items if available
      try {
        let orderItems = []
        if (Array.isArray(order.items)) {
          orderItems = order.items
        } else if (typeof order.items === 'string') {
          orderItems = JSON.parse(order.items)
        }

        const orderSavings = orderItems.reduce((itemSum: number, item: any) => {
          const originalPrice = item.originalPrice || item.comparePrice || item.price
          const currentPrice = item.price
          if (originalPrice && currentPrice && originalPrice > currentPrice) {
            return itemSum + ((originalPrice - currentPrice) * (item.quantity || 1))
          }
          return itemSum
        }, 0)

        return sum + orderSavings
      } catch {
        // Fallback: estimate 8% average savings per order
        return sum + (Number(order.total) * 0.08)
      }
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
        wishlistCount: wishlistItems.length,
        // NEW: Dynamic loyalty and savings data
        currentMonthSpent,
        remainingBudget,
        monthlyBudget
      },

      // NEW: Dynamic progress data
      progress: {
        loyalty: {
          currentTier,
          progress: loyaltyProgress,
          pointsToNext: pointsToNextTier,
          nextTier: nextTierName,
          totalPoints: loyaltyPoints
        },
        savings: {
          progress: savingsGoalProgress,
          spent: currentMonthSpent,
          budget: monthlyBudget,
          remaining: remainingBudget,
          totalSaved: savedAmount
        }
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
      loyaltyTier: currentTier,
      loyaltyProgress: `${loyaltyProgress}%`,
      savingsProgress: `${savingsGoalProgress}%`,
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

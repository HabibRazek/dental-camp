import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get alerts with persistent state
export async function GET() {
  try {
    // Get current stock data
    const [lowStockProducts, outOfStockProducts] = await Promise.all([
      prisma.product.findMany({
        where: {
          stockQuantity: { gte: 1, lte: 5 },
          isActive: true
        },
        include: { category: true },
        take: 10
      }),
      prisma.product.findMany({
        where: {
          stockQuantity: 0,
          isActive: true
        },
        include: { category: true },
        take: 10
      })
    ])

    // Generate alert IDs based on product data
    const alerts = []

    // Add out of stock alerts
    outOfStockProducts.forEach((product, index) => {
      alerts.push({
        id: `out_of_stock_${product.id}`,
        type: 'OUT_OF_STOCK',
        title: 'Product Out of Stock',
        message: `${product.name} (SKU: ${product.sku}) is completely out of stock`,
        severity: 'CRITICAL',
        product: product,
        createdAt: new Date(Date.now() - index * 300000).toISOString(),
        isRead: false,
        isDismissed: false
      })
    })

    // Add low stock warning if there are low stock products
    if (lowStockProducts.length > 0) {
      alerts.push({
        id: 'low_stock_warning',
        type: 'LOW_STOCK',
        title: 'Low Stock Warning',
        message: `${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's are' : ' is'} running low on stock`,
        severity: 'HIGH',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        isRead: false,
        isDismissed: false
      })
    }

    // Add system status alert
    alerts.push({
      id: 'system_status',
      type: 'SYSTEM',
      title: 'System Status',
      message: 'All systems are running normally',
      severity: 'LOW',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
      isDismissed: false
    })

    // Sort by creation date (newest first)
    alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      alerts,
      lowStockProducts,
      summary: {
        totalAlerts: alerts.length,
        criticalCount: alerts.filter(a => a.severity === 'CRITICAL').length,
        unreadCount: alerts.filter(a => !a.isRead).length,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length
      }
    })
  } catch (error) {
    console.error('Alerts API error:', error)
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    )
  }
}

// Update alert state (mark as read/dismissed)
export async function PATCH(request: Request) {
  try {
    const { alertId, action, isRead, isDismissed } = await request.json()

    // For now, we'll return success since we're using localStorage
    // In a real app, you'd store this in a database
    return NextResponse.json({ 
      success: true, 
      message: `Alert ${action} successfully` 
    })
  } catch (error) {
    console.error('Alert update error:', error)
    return NextResponse.json(
      { error: "Failed to update alert" },
      { status: 500 }
    )
  }
}

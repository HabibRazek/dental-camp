import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get low stock and out of stock products count
    const [lowStockCount, outOfStockCount] = await Promise.all([
      prisma.product.count({
        where: {
          stockQuantity: { gte: 1, lte: 5 },
          isActive: true
        }
      }),
      prisma.product.count({
        where: {
          stockQuantity: 0,
          isActive: true
        }
      })
    ])

    // Calculate base alert count (will be filtered on client side)
    const baseAlertCount = outOfStockCount + (lowStockCount > 0 ? 1 : 0)

    return NextResponse.json({
      baseAlertCount,
      lowStockCount,
      outOfStockCount,
      hasAlerts: baseAlertCount > 0
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch alerts count" },
      { status: 500 }
    )
  }
}

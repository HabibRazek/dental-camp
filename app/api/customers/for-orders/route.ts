import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch active customers for order creation (no auth required for internal use)
    const users = await prisma.user.findMany({
      where: {
        isActive: true, // Only active customers
      },
      select: {
        id: true,
        name: true,
        email: true,
        // Add phone if it exists in your schema
        // phone: true,
      },
      orderBy: {
        name: 'asc'
      },
      take: 100 // Limit to 100 customers for performance
    })

    // Transform users to customers format expected by the dialog
    const customers = users.map(user => ({
      id: user.id,
      name: user.name || user.email.split('@')[0], // Fallback to email prefix if no name
      email: user.email,
      phone: '', // Add phone field if available in your schema
    }))

    return NextResponse.json({
      customers,
      total: customers.length
    }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch customers for orders:', error)
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
}

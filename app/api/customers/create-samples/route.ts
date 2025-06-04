import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    // Check if there are already customers
    const existingCustomers = await prisma.user.count({
      where: { isActive: true }
    })

    if (existingCustomers >= 5) {
      return NextResponse.json({
        success: true,
        message: "Sample customers already exist",
        count: existingCustomers
      })
    }

    // Create sample customers for order testing
    const sampleCustomers = [
      {
        name: "Dr. Ahmed Ben Ali",
        email: "ahmed.benali@dental.tn",
        password: "password123",
        isActive: true,
        emailVerified: new Date()
      },
      {
        name: "Dr. Fatima Khelifi",
        email: "fatima.khelifi@clinic.tn",
        password: "password123",
        isActive: true,
        emailVerified: new Date()
      },
      {
        name: "Dr. Mohamed Trabelsi",
        email: "mohamed.trabelsi@dental.tn",
        password: "password123",
        isActive: true,
        emailVerified: new Date()
      },
      {
        name: "Dr. Amina Sassi",
        email: "amina.sassi@clinic.tn",
        password: "password123",
        isActive: true,
        emailVerified: new Date()
      },
      {
        name: "Dr. Karim Bouazizi",
        email: "karim.bouazizi@dental.tn",
        password: "password123",
        isActive: true,
        emailVerified: new Date()
      },
      {
        name: "Dr. Leila Mansouri",
        email: "leila.mansouri@clinic.tn",
        password: "password123",
        isActive: true,
        emailVerified: new Date()
      }
    ]

    let createdCount = 0

    for (const customerData of sampleCustomers) {
      // Check if customer already exists
      const existingCustomer = await prisma.user.findUnique({
        where: { email: customerData.email }
      })

      if (!existingCustomer) {
        const hashedPassword = await bcrypt.hash(customerData.password, 12)

        await prisma.user.create({
          data: {
            name: customerData.name,
            email: customerData.email,
            password: hashedPassword,
            isActive: customerData.isActive,
            emailVerified: customerData.emailVerified
          }
        })

        createdCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdCount} sample customers successfully`,
      createdCount,
      totalCustomers: existingCustomers + createdCount
    })
  } catch (error) {
    console.error('Failed to create sample customers:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create sample customers'
    }, { status: 500 })
  }
}

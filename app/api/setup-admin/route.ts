import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const adminEmail = "admin@dental-camp.com"
    const adminPassword = "admin123"

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      // Update existing user to admin
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          role: "ADMIN",
          isActive: true,
          emailVerified: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: "Admin user updated successfully",
        user: {
          email: updatedUser.email,
          role: updatedUser.role,
          id: updatedUser.id
        }
      })
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin User",
        role: "ADMIN",
        isActive: true,
        emailVerified: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        email: adminUser.email,
        role: adminUser.role,
        id: adminUser.id
      },
      credentials: {
        email: adminEmail,
        password: adminPassword
      }
    })
  } catch (error) {
    console.error('Setup admin error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to setup admin user'
    }, { status: 500 })
  }
}

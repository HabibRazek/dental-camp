import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    console.log(`👑 Creating new admin user: ${name} (${email})`)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // If user exists, update them to admin
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name,
          role: "ADMIN",
          isActive: true,
          emailVerified: new Date()
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return NextResponse.json({
        success: true,
        message: "Existing user updated to admin successfully",
        user: updatedUser,
        credentials: {
          email,
          password: "Password unchanged - use existing password"
        }
      }, { status: 200 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new admin user
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
        emailVerified: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })

    console.log(`✅ Admin user created successfully: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: newAdmin,
      credentials: {
        email,
        password
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create admin error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

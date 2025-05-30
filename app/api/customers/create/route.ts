import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Force this API route to use Node.js runtime
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, password, autoVerify = true } = body

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
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    console.log(`👤 Creating new customer: ${name} (${email})`)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: true, // Automatically activate the account
        emailVerified: autoVerify ? new Date() : null, // Automatically verify if requested
      },
      include: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    })

    // Return the created user (without password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      message: "Customer created successfully",
      user: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
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

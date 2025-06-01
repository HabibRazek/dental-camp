import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Force this API route to use Node.js runtime
export const runtime = 'nodejs'

export async function PATCH(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only admins can change user roles
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only admins can change user roles" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, role } = body

    // Validate required fields
    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      )
    }

    // Validate role value
    if (!['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be USER or ADMIN" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent users from changing their own role
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 }
      )
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user: updatedUser
    }, { status: 200 })

  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getAllUsers, toggleUserStatus, updateEmailVerification, deleteUser } from "@/lib/db"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Force this API route to use Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      )
    }

    const result = await getAllUsers(page, limit, search)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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
    const { userId, action, value, email } = body

    // Handle enable/disable functionality by email
    if (email && ['enable', 'disable'].includes(action)) {
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, isActive: true }
      })

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      // Prevent users from disabling themselves
      if (user.email === session.user.email && action === 'disable') {
        return NextResponse.json(
          { error: "You cannot disable your own account" },
          { status: 400 }
        )
      }

      // Update user status
      const isActive = action === 'enable'
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { isActive },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true
        }
      })

      console.log(`👤 User ${email} ${action}d by ${session.user.email}`)

      return NextResponse.json(
        {
          success: true,
          message: `User ${action}d successfully`,
          user: updatedUser
        },
        { status: 200 }
      )
    }

    // Handle existing functionality by userId
    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'toggleStatus':
        if (typeof value !== 'boolean') {
          return NextResponse.json(
            { error: "Invalid value for toggleStatus" },
            { status: 400 }
          )
        }
        result = await toggleUserStatus(userId, value)
        break

      case 'updateVerification':
        const emailVerified = value ? new Date() : null
        result = await updateEmailVerification(userId, emailVerified)
        break

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Prevent users from deleting themselves
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 403 }
      )
    }

    const result = await deleteUser(userId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: result.message,
        deletedUser: result.deletedUser
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { createSampleUsers } from "@/lib/db"
import { auth } from "@/auth"

// Force this API route to use Node.js runtime
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated (optional for development)
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: "Sample user creation is only allowed in development" },
        { status: 403 }
      )
    }

    const result = await createSampleUsers()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: result.message,
        success: true 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error creating sample users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

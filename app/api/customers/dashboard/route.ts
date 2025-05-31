import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getAllUsers } from "@/lib/db"

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

    // Get all users for dashboard calculations
    // We'll get more users for better statistics
    const result = await getAllUsers(1, 100) // Get first 100 users for stats

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

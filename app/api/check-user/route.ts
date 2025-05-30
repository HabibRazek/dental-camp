import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force this API route to use Node.js runtime
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists and get their status
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        isActive: true,
        emailVerified: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { 
          exists: false,
          isActive: false,
          isVerified: false
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { 
        exists: true,
        isActive: user.isActive,
        isVerified: !!user.emailVerified
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error checking user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { generateVerificationCode, verifyEmailWithCode } from "@/lib/db"
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email"
import { auth } from "@/auth"

// Force this API route to use Node.js runtime
export const runtime = 'nodejs'

// Send verification code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, userId } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Generate verification code
    const { code } = await generateVerificationCode(email, userId)

    // Send verification email
    const emailResult = await sendVerificationEmail(email, code)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent to your email",
        messageId: emailResult.messageId
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Verify email with code
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      )
    }

    // Verify the code
    const result = await verifyEmailWithCode(email, code)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Send welcome email
    await sendWelcomeEmail(email, result.user?.name)

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
        user: result.user
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

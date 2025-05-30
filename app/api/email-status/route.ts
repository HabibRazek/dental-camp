import { NextRequest, NextResponse } from "next/server"
import { verifyEmailConfig } from "@/lib/email"

// Force this API route to use Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Test email configuration
    const isEmailConfigValid = await verifyEmailConfig()

    const config = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? process.env.SMTP_USER.substring(0, 3) + '***' : 'Not set',
      from: process.env.SMTP_FROM,
      isConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
      isWorking: isEmailConfigValid
    }

    return NextResponse.json(
      {
        success: true,
        config,
        message: isEmailConfigValid ? "Email system is working" : "Email system has issues"
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check email status",
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}

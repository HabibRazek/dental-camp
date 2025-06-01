import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Only show debug info in development or if explicitly enabled
    if (process.env.NODE_ENV === "production" && process.env.DEBUG_ENV !== "true") {
      return NextResponse.json(
        { error: "Debug endpoint disabled in production" },
        { status: 403 }
      )
    }

    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
      hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasSmtpConfig: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
      hasUploadThingToken: !!process.env.UPLOADTHING_TOKEN,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      status: "Environment check",
      environment: envInfo,
      message: "All environment variables checked"
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

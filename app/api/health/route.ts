import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    }

    // Test database connection
    let dbStatus = "unknown"
    try {
      const { prisma } = await import("@/lib/prisma")
      await prisma.$queryRaw`SELECT 1`
      dbStatus = "connected"
    } catch (dbError) {
      dbStatus = "disconnected"
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbStatus,
      auth: {
        configured: envCheck.hasAuthSecret && envCheck.hasNextAuthUrl,
        provider: "google",
        baseUrl: process.env.NEXTAUTH_URL
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

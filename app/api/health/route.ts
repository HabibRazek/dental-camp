import { NextResponse } from "next/server"

export async function GET() {
  try {
    const startTime = Date.now()
    
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
    let dbResponseTime = 0
    try {
      const dbStart = Date.now()
      const { prisma } = await import("@/lib/prisma")
      await prisma.$queryRaw`SELECT 1`
      dbResponseTime = Date.now() - dbStart
      dbStatus = "connected"
    } catch (dbError) {
      dbStatus = "disconnected"
      console.error("Database health check failed:", dbError)
    }

    // Calculate total response time
    const totalResponseTime = Date.now() - startTime

    // Determine overall health status
    const isHealthy = dbStatus === "connected" && 
                     envCheck.hasAuthSecret && 
                     envCheck.hasNextAuthUrl && 
                     envCheck.hasDatabaseUrl

    const response = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "unknown",
      environment: process.env.NODE_ENV,
      checks: {
        database: {
          status: dbStatus,
          responseTime: `${dbResponseTime}ms`
        },
        environment: {
          configured: envCheck.hasAuthSecret && envCheck.hasNextAuthUrl && envCheck.hasDatabaseUrl,
          details: envCheck
        },
        auth: {
          configured: envCheck.hasAuthSecret && envCheck.hasNextAuthUrl,
          provider: "google",
          baseUrl: process.env.NEXTAUTH_URL
        }
      },
      performance: {
        responseTime: `${totalResponseTime}ms`,
        memory: {
          used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
        }
      }
    }

    return NextResponse.json(
      response,
      { status: isHealthy ? 200 : 503 }
    )
  } catch (error) {
    console.error("Health check error:", error)
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

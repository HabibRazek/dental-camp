import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
// Dynamic import for bcrypt to avoid build issues

// Security validation schemas
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Password confirmation is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const SecuritySettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  loginNotifications: z.boolean(),
  sessionTimeout: z.number().min(5).max(1440), // 5 minutes to 24 hours
  passwordExpiry: z.number().min(30).max(365), // 30 days to 1 year
  ipWhitelist: z.array(z.string()).optional()
})

// GET /api/security - Get current security settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's security settings
    let user
    try {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          twoFactorEnabled: true,
          loginNotifications: true,
          sessionTimeout: true,
          passwordExpiry: true,
          ipWhitelist: true
        }
      })
    } catch (dbError: any) {
      // If security fields don't exist, try to add them
      if (dbError.message?.includes('column')) {
        console.log('⚠️ Security fields missing, attempting to add them...')
        try {
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "loginNotifications" BOOLEAN DEFAULT true;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "sessionTimeout" INTEGER DEFAULT 30;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordExpiry" INTEGER DEFAULT 90;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "ipWhitelist" TEXT[] DEFAULT ARRAY[]::TEXT[];`
          console.log('✅ Added security fields to database')

          // Retry the query
          user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
              twoFactorEnabled: true,
              loginNotifications: true,
              sessionTimeout: true,
              passwordExpiry: true,
              ipWhitelist: true
            }
          })
        } catch (retryError) {
          console.error('❌ Failed to add security fields:', retryError)
          // Return basic user info without security fields
          user = { twoFactorEnabled: false, loginNotifications: true, sessionTimeout: 30, passwordExpiry: 90, ipWhitelist: [] }
        }
      } else {
        throw dbError
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const response = {
      twoFactorEnabled: user.twoFactorEnabled || false,
      loginNotifications: user.loginNotifications !== false, // default true
      sessionTimeout: user.sessionTimeout || 30,
      passwordExpiry: user.passwordExpiry || 90,
      ipWhitelist: user.ipWhitelist || []
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Security GET error:', error)
    return NextResponse.json(
      { error: "Failed to fetch security settings" },
      { status: 500 }
    )
  }
}

// POST /api/security - Update security settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, data } = body

    if (type === 'password') {
      // Handle password change
      const validatedData = ChangePasswordSchema.parse(data)

      try {
        // Get current user with password
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { password: true }
        })

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          )
        }

        if (!user.password) {
          return NextResponse.json(
            { error: "No password set for this user" },
            { status: 400 }
          )
        }

        // Dynamic import bcrypt to avoid build issues
        const bcrypt = await import("bcryptjs")

        // Verify current password with proper type handling
        const currentPassword: string = validatedData.currentPassword
        const storedPassword: string = user.password
        const isValidPassword = await bcrypt.compare(currentPassword, storedPassword)

        if (!isValidPassword) {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 400 }
          )
        }

        // Hash new password
        const newPassword: string = validatedData.newPassword
        const hashedPassword = await bcrypt.hash(newPassword, 12)

        // Update password
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            password: hashedPassword,
            passwordChangedAt: new Date()
          }
        })

        return NextResponse.json({
          success: true,
          message: "Password changed successfully"
        })
      } catch (bcryptError) {
        console.error('Bcrypt error:', bcryptError)
        return NextResponse.json(
          { error: "Failed to process password change" },
          { status: 500 }
        )
      }
    } else if (type === 'settings') {
      // Handle security settings update
      const validatedData = SecuritySettingsSchema.parse(data)

      await prisma.user.update({
        where: { id: session.user.id },
        data: validatedData
      })

      return NextResponse.json({
        success: true,
        message: "Security settings updated successfully"
      })
    } else if (type === '2fa') {
      // Handle 2FA enable/disable
      const { enabled } = data

      try {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            twoFactorEnabled: enabled,
            twoFactorEnabledAt: enabled ? new Date() : null
          }
        })
      } catch (dbError: any) {
        // If 2FA fields don't exist, add them and retry
        if (dbError.message?.includes('twoFactor')) {
          console.log('⚠️ 2FA fields missing, adding them...')
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabledAt" TIMESTAMP(3);`

          // Retry the update
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              twoFactorEnabled: enabled,
              twoFactorEnabledAt: enabled ? new Date() : null
            }
          })
        } else {
          throw dbError
        }
      }

      return NextResponse.json({
        success: true,
        message: enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled"
      })
    } else {
      return NextResponse.json(
        { error: "Invalid request type" },
        { status: 400 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error('Security POST error:', error)
    return NextResponse.json(
      { error: "Failed to update security settings" },
      { status: 500 }
    )
  }
}

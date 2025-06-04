import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorEnabled: true,
        loginNotifications: true,
        sessionTimeout: true,
        passwordExpiry: true,
        ipWhitelist: true
      }
    })

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

      // Verify current password
      const isValidPassword = await bcrypt.compare(validatedData.currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        )
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12)

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
      
      await prisma.user.update({
        where: { id: session.user.id },
        data: { 
          twoFactorEnabled: enabled,
          twoFactorEnabledAt: enabled ? new Date() : null
        }
      })

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

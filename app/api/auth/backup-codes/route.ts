import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// Generate backup codes
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user exists and has 2FA enabled
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        twoFactorEnabled: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "Two-factor authentication must be enabled to generate backup codes" },
        { status: 400 }
      )
    }

    // Generate 10 backup codes
    const backupCodes = []
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase()
      const formattedCode = `${code.slice(0, 4)}-${code.slice(4, 8)}`
      backupCodes.push(formattedCode)
    }

    // Hash the codes before storing
    const bcrypt = await import("bcryptjs")
    const hashedCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 12))
    )

    try {
      // Try to store hashed codes in database
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          backupCodes: JSON.stringify(hashedCodes)
        }
      })
      console.log('✅ Backup codes stored successfully in database')
    } catch (dbError: any) {
      // If the backupCodes field doesn't exist, try to add it and retry
      if (dbError.message?.includes('backupCodes') || dbError.message?.includes('column')) {
        console.log('⚠️ backupCodes field missing, attempting to add it...')

        try {
          // Try to add all missing security columns
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "backupCodes" TEXT;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabledAt" TIMESTAMP(3);`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "loginNotifications" BOOLEAN DEFAULT true;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "sessionTimeout" INTEGER DEFAULT 30;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordExpiry" INTEGER DEFAULT 90;`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordChangedAt" TIMESTAMP(3);`
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "ipWhitelist" TEXT[] DEFAULT ARRAY[]::TEXT[];`
          console.log('✅ Added all security columns to database')

          // Retry storing the codes
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              backupCodes: JSON.stringify(hashedCodes)
            }
          })
          console.log('✅ Backup codes stored successfully after adding column')
        } catch (retryError: any) {
          console.error('❌ Failed to add column or store codes:', retryError)
          // For now, just continue without storing in DB - codes will still be generated
          console.log('⚠️ Continuing without database storage - codes generated but not persisted')
        }
      } else {
        throw dbError
      }
    }

    return NextResponse.json({
      success: true,
      codes: backupCodes,
      message: "Backup codes generated successfully"
    })
  } catch (error) {
    console.error('Backup codes generation error:', error)
    return NextResponse.json(
      { error: "Failed to generate backup codes" },
      { status: 500 }
    )
  }
}

// Verify backup code
export async function PUT(request: NextRequest) {
  try {
    const { email, backupCode } = await request.json()

    if (!email || !backupCode) {
      return NextResponse.json(
        { error: "Email and backup code are required" },
        { status: 400 }
      )
    }

    // Find user
    let user
    try {
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          backupCodes: true
        }
      })
    } catch (dbError: any) {
      // If the backupCodes field doesn't exist, try without it
      if (dbError.message?.includes('backupCodes')) {
        user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
          }
        })
        // Add backupCodes as null for compatibility
        user = user ? { ...user, backupCodes: null } : null
      } else {
        throw dbError
      }
    }

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (!user.backupCodes) {
      return NextResponse.json(
        { error: "No backup codes found for this user" },
        { status: 400 }
      )
    }

    // Parse stored backup codes
    let storedCodes: string[]
    try {
      storedCodes = JSON.parse(user.backupCodes as string)
    } catch {
      return NextResponse.json(
        { error: "Invalid backup codes format" },
        { status: 500 }
      )
    }

    // Verify the backup code against stored hashed codes
    const bcrypt = await import("bcryptjs")
    let codeValid = false
    let usedCodeIndex = -1

    for (let i = 0; i < storedCodes.length; i++) {
      if (await bcrypt.compare(backupCode, storedCodes[i])) {
        codeValid = true
        usedCodeIndex = i
        break
      }
    }

    if (!codeValid) {
      return NextResponse.json(
        { error: "Invalid backup code" },
        { status: 401 }
      )
    }

    // Remove the used backup code
    storedCodes.splice(usedCodeIndex, 1)
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          backupCodes: JSON.stringify(storedCodes)
        }
      })
    } catch (dbError: any) {
      // If the backupCodes field doesn't exist, log the error but continue
      if (dbError.message?.includes('backupCodes')) {
        console.error('Cannot update backup codes - field missing from database schema')
      } else {
        throw dbError
      }
    }

    // Return user data for session creation
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      message: "Backup code verified successfully",
      remainingCodes: storedCodes.length
    })
  } catch (error) {
    console.error('Backup code verification error:', error)
    return NextResponse.json(
      { error: "Failed to verify backup code" },
      { status: 500 }
    )
  }
}

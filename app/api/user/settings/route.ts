import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/user/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('⚙️ Fetching settings for user:', session.user.email)

    // For now, return default settings since we don't have a settings table
    // In a real app, you'd fetch from a user_settings table
    const defaultSettings = {
      notifications: {
        email: true,
        push: true,
        sms: false,
        orderUpdates: true,
        promotions: false,
        newsletter: true
      },
      privacy: {
        profileVisibility: 'private',
        showEmail: false,
        showPhone: false,
        dataCollection: true
      },
      appearance: {
        theme: 'system',
        language: 'en',
        currency: 'TND',
        timezone: 'Africa/Tunis'
      },
      security: {
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeout: 30
      }
    }

    return NextResponse.json({
      success: true,
      settings: defaultSettings
    })

  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/user/settings - Save user settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await request.json()

    console.log('💾 Saving settings for user:', session.user.email)
    console.log('📋 Settings data:', settings)

    // For now, we'll just simulate saving
    // In a real app, you'd save to a user_settings table
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      settings: settings
    })

  } catch (error) {
    console.error("Error saving user settings:", error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

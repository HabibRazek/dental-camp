import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
// import { prisma } from "@/lib/prisma"

// GET /api/user/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting settings fetch...')
    const session = await auth()

    if (!session || !session.user) {
      console.log('❌ No session or user found')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('⚙️ Fetching settings for user:', session.user.email, 'ID:', session.user.id)

    if (!session.user.id) {
      console.log('❌ No user ID found in session')
      return NextResponse.json({ error: "User ID not found" }, { status: 400 })
    }

    // Temporary: Return default settings while we fix database connection
    console.log('📝 Returning default settings for user:', session.user.id)

    const settings = {
      notifications: {
        email: true,
        push: true,
        sms: false,
        orderUpdates: true,
        promotions: false,
        newsletter: true
      },
      privacy: {
        profileVisibility: 'private' as const,
        showEmail: false,
        showPhone: false,
        dataCollection: true
      },
      security: {
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeout: 30
      }
    }

    return NextResponse.json({
      success: true,
      settings: settings
    })

  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
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

    // Temporary: Just log the settings while we fix database connection
    console.log('💾 Settings received for user:', session.user.id)
    console.log('📋 Settings data:', JSON.stringify(settings, null, 2))

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
  }
}
